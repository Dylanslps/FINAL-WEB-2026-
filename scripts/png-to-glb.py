import sys
import struct
import json
import os
import cv2
import numpy as np

# Penggunaan: python scripts/png-to-glb.py <input.png> <output.glb>
png_in = sys.argv[1] if len(sys.argv) > 1 else os.path.join('public', 'hero', 'airforcewhite.png')
out_glb = sys.argv[2] if len(sys.argv) > 2 else os.path.join('public', 'models', 'airforcewhite.glb')

im_rgba = cv2.imread(png_in, cv2.IMREAD_UNCHANGED)
if im_rgba is None or im_rgba.shape[2] < 4:
    raise RuntimeError(f'File PNG RGBA tidak valid: {png_in}')

h, w = im_rgba.shape[:2]
alpha_full = im_rgba[:, :, 3]
ys, xs = np.where(alpha_full > 20)
pad = 10
y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + pad)
x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + pad)
crop = im_rgba[y0:y1, x0:x1]

gw, gh = 220, 190
grid_rgba = cv2.resize(crop, (gw, gh), interpolation=cv2.INTER_AREA)
alpha = cv2.GaussianBlur(grid_rgba[:, :, 3].astype(np.float32) / 255.0, (5, 5), 1.0)
mask = (alpha > 0.42).astype(np.uint8)

num_l, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
if num_l > 1:
    largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = np.where(labels == largest, 1, 0).astype(np.uint8)

dist = cv2.distanceTransform(mask, cv2.DIST_L2, 5).astype(np.float32)
dist_smooth = cv2.GaussianBlur(dist, (15, 15), 3.6) * mask
max_d = dist_smooth.max() + 1e-5
d_norm = np.clip(dist_smooth / (max_d * 0.78), 0.0, 1.0)
inflated = np.sqrt(np.clip(1.0 - np.power(1.0 - d_norm, 2.0), 0.0, 1.0))

bgr = grid_rgba[:, :, :3].astype(np.float32) / 255.0
lum = 0.114 * bgr[:, :, 0] + 0.587 * bgr[:, :, 1] + 0.299 * bgr[:, :, 2]
lum_local = lum - cv2.GaussianBlur(lum, (9, 9), 2.0)
swoosh_emboss = np.clip((0.88 - lum) * 0.16, -0.015, 0.03)
relief = (lum_local * 0.045 + swoosh_emboss) * np.clip(dist / 4.0, 0.0, 1.0)

thickness = 0.28
Z = cv2.GaussianBlur((inflated * thickness + relief) * mask, (3, 3), 0.8) * mask
Z[mask == 0] = 0.0

aspect = (x1 - x0) / float(y1 - y0)
xs_lin = np.linspace(-0.5 * aspect, 0.5 * aspect, gw, dtype=np.float32)
ys_lin = np.linspace(0.5, -0.5, gh, dtype=np.float32)
XX, YY = np.meshgrid(xs_lin, ys_lin)
UU, VV = np.meshgrid(
    np.linspace(0.0, 1.0, gw, dtype=np.float32),
    np.linspace(0.0, 1.0, gh, dtype=np.float32)
)

dz_dx = cv2.Sobel(Z, cv2.CV_32F, 1, 0, ksize=3) / (aspect / gw * 8.0)
dz_dy = -cv2.Sobel(Z, cv2.CV_32F, 0, 1, ksize=3) / (1.0 / gh * 8.0)
dmx = -cv2.Sobel(dist, cv2.CV_32F, 1, 0, ksize=3)
dmy = cv2.Sobel(dist, cv2.CV_32F, 0, 1, ksize=3)

def make_normals(sign):
    nx = -sign * dz_dx
    ny = -sign * dz_dy
    nz = np.full_like(Z, sign, dtype=np.float32)
    edge_w = np.clip(1.0 - dist / 3.5, 0.0, 1.0)
    nx = nx * (1.0 - edge_w) + dmx * edge_w
    ny = ny * (1.0 - edge_w) + dmy * edge_w
    nz = nz * (1.0 - edge_w * 0.9)
    norm = np.sqrt(nx*nx + ny*ny + nz*nz + 1e-8)
    return np.stack([nx/norm, ny/norm, nz/norm], axis=-1)

N_front = make_normals(1.0)
N_back = make_normals(-1.0)

mask_dil = cv2.dilate(mask, np.ones((2, 2), np.uint8))
front_idx = np.full((gh, gw), -1, dtype=np.int32)
back_idx = np.full((gh, gw), -1, dtype=np.int32)

positions, normals, uvs = [], [], []
for r in range(gh):
    for c in range(gw):
        if mask_dil[r, c]:
            front_idx[r, c] = len(positions)
            positions.append((XX[r, c], YY[r, c], Z[r, c]))
            normals.append(tuple(N_front[r, c]))
            uvs.append((UU[r, c], VV[r, c]))

            if Z[r, c] > 1e-5:
                back_idx[r, c] = len(positions)
                positions.append((XX[r, c], YY[r, c], -Z[r, c]))
                normals.append(tuple(N_back[r, c]))
                uvs.append((UU[r, c], VV[r, c]))
            else:
                back_idx[r, c] = front_idx[r, c]

indices = []
for r in range(gh - 1):
    for c in range(gw - 1):
        if mask[r, c] or mask[r+1, c] or mask[r, c+1] or mask[r+1, c+1]:
            f00, f10, f01, f11 = front_idx[r, c], front_idx[r+1, c], front_idx[r, c+1], front_idx[r+1, c+1]
            if f00 >= 0 and f10 >= 0 and f01 >= 0 and f11 >= 0:
                indices.extend([f00, f10, f01, f01, f10, f11])
            b00, b10, b01, b11 = back_idx[r, c], back_idx[r+1, c], back_idx[r, c+1], back_idx[r+1, c+1]
            if b00 >= 0 and b10 >= 0 and b01 >= 0 and b11 >= 0:
                indices.extend([b00, b01, b10, b01, b11, b10])

pos_arr = np.array(positions, dtype=np.float32)
norm_arr = np.array(normals, dtype=np.float32)
uv_arr = np.array(uvs, dtype=np.float32)
idx_arr = np.array(indices, dtype=np.uint32)

tex_crop = cv2.resize(crop, (1024, 1024), interpolation=cv2.INTER_CUBIC)
# Tone down max brightness slightly (0.86x) so studio directional lights don't blow out white leather
tex_bgr = np.clip(tex_crop[:, :, :3].astype(np.float32) * 0.86, 0, 255).astype(np.uint8)
tex_a = tex_crop[:, :, 3]
inv_mask = (tex_a < 180).astype(np.uint8)
tex_bgr_clean = cv2.inpaint(tex_bgr, inv_mask, 7, cv2.INPAINT_TELEA)
ok, tex_bytes = cv2.imencode('.jpg', tex_bgr_clean, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
tex_bytes = tex_bytes.tobytes()

bin_buf = bytearray()
def add_bv(raw_bytes, target=None):
    while len(bin_buf) % 4 != 0:
        bin_buf.append(0)
    offset = len(bin_buf)
    bin_buf.extend(raw_bytes)
    bv = {'buffer': 0, 'byteOffset': offset, 'byteLength': len(raw_bytes)}
    if target is not None:
        bv['target'] = target
    return bv

bv_pos = add_bv(pos_arr.tobytes(), 34962)
bv_norm = add_bv(norm_arr.tobytes(), 34962)
bv_uv = add_bv(uv_arr.tobytes(), 34962)
bv_idx = add_bv(idx_arr.tobytes(), 34963)
bv_tex = add_bv(tex_bytes)

while len(bin_buf) % 4 != 0:
    bin_buf.append(0)

gltf_json = {
    'asset': {'version': '2.0', 'generator': 'STRIDE-PNG-to-3D'},
    'scene': 0,
    'scenes': [{'nodes': [0]}],
    'nodes': [{'mesh': 0, 'name': 'AirForceWhite3D'}],
    'meshes': [{
        'name': 'AirForceWhite3D',
        'primitives': [{
            'attributes': {'POSITION': 0, 'NORMAL': 1, 'TEXCOORD_0': 2},
            'indices': 3,
            'material': 0
        }]
    }],
    'materials': [{
        'name': 'AirForceLeather',
        'doubleSided': True,
        'pbrMetallicRoughness': {
            'baseColorTexture': {'index': 0},
            'metallicFactor': 0.04,
            'roughnessFactor': 0.52
        }
    }],
    'textures': [{'source': 0}],
    'images': [{'bufferView': 4, 'mimeType': 'image/jpeg'}],
    'buffers': [{'byteLength': len(bin_buf)}],
    'bufferViews': [bv_pos, bv_norm, bv_uv, bv_idx, bv_tex],
    'accessors': [
        {
            'bufferView': 0, 'componentType': 5126, 'count': len(pos_arr), 'type': 'VEC3',
            'min': pos_arr.min(axis=0).tolist(), 'max': pos_arr.max(axis=0).tolist()
        },
        {'bufferView': 1, 'componentType': 5126, 'count': len(norm_arr), 'type': 'VEC3'},
        {'bufferView': 2, 'componentType': 5126, 'count': len(uv_arr), 'type': 'VEC2'},
        {'bufferView': 3, 'componentType': 5125, 'count': len(idx_arr), 'type': 'SCALAR'}
    ]
}

json_bytes = json.dumps(gltf_json, separators=(',', ':')).encode('utf-8')
while len(json_bytes) % 4 != 0:
    json_bytes += b' '

os.makedirs(os.path.dirname(out_glb), exist_ok=True)
total_len = 12 + 8 + len(json_bytes) + 8 + len(bin_buf)
with open(out_glb, 'wb') as f:
    f.write(struct.pack('<III', 0x46546C67, 2, total_len))
    f.write(struct.pack('<II', len(json_bytes), 0x4E4F534A))
    f.write(json_bytes)
    f.write(struct.pack('<II', len(bin_buf), 0x004E4942))
    f.write(bin_buf)

print(f'Berhasil membuat {out_glb} ({total_len} bytes, {len(pos_arr)} vertices, {len(idx_arr)//3} triangles)')
