import sys
import struct
import json
import os
import cv2
import numpy as np

png_in = sys.argv[1] if len(sys.argv) > 1 else os.path.join('public', 'hero', 'airforcewhite.png')
out_glb = sys.argv[2] if len(sys.argv) > 2 else os.path.join('public', 'models', 'airforcewhite.glb')

im_rgba = cv2.imread(png_in, cv2.IMREAD_UNCHANGED)
if im_rgba is None or im_rgba.shape[2] < 4:
    raise RuntimeError(f'File PNG RGBA tidak valid: {png_in}')

# 1. Putar gambar sebesar +26.5 derajat agar sol sepatu sejajar horizontal (sumbu anatomis sepatu)
h_orig, w_orig = im_rgba.shape[:2]
pad = 120
padded = cv2.copyMakeBorder(im_rgba, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=(0, 0, 0, 0))
hp, wp = padded.shape[:2]
center_pt = (wp / 2.0, hp / 2.0)
SHOE_ANGLE_DEG = -25.5  # di gambar asli, sol miring -25.5 deg (ujung kiri bawah ke tumit kanan atas)
M_to_horiz = cv2.getRotationMatrix2D(center_pt, SHOE_ANGLE_DEG, 1.0)
horiz_rgba = cv2.warpAffine(padded, M_to_horiz, (wp, hp), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))

alpha_h = horiz_rgba[:, :, 3]
ys, xs = np.where(alpha_h > 40)
x_min, x_max = int(xs.min()), int(xs.max())
y_min, y_max = int(ys.min()), int(ys.max())
shoe_len = float(x_max - x_min)
shoe_height = float(y_max - y_min)

# 2. Ekstrak profil atas v_top(u) dan profil bawah sol v_bot(u) sepanjang panjang sepatu u in [0, 1]
NU = 180  # resolusi sepanjang panjang sepatu (toe -> heel)
NV = 96   # resolusi mengelilingi penampang melintang sepatu (cross-section loop)

u_vals = np.linspace(0.0, 1.0, NU, dtype=np.float32)
x_cols = np.clip(np.round(x_min + u_vals * shoe_len).astype(np.int32), 0, wp - 1)

v_top_px = np.zeros(NU, dtype=np.float32)
v_bot_px = np.zeros(NU, dtype=np.float32)

for i, xc in enumerate(x_cols):
    col_y = np.where(alpha_h[:, max(0, xc-1):min(wp, xc+2)] > 40)[0]
    if len(col_y) > 0:
        v_top_px[i] = float(col_y.min())
        v_bot_px[i] = float(col_y.max())
    elif i > 0:
        v_top_px[i] = v_top_px[i - 1]
        v_bot_px[i] = v_bot_px[i - 1]

# Haluskan kurva siluet atas dan bawah
v_top_px = cv2.GaussianBlur(v_top_px.reshape(-1, 1), (1, 9), 2.0).ravel()
v_bot_px = cv2.GaussianBlur(v_bot_px.reshape(-1, 1), (1, 9), 2.0).ravel()

# 3. Profil lebar telapak kaki anatomis Air Force 1: W(u)
# u=0 adalah ujung jari (toe tip), u=1 adalah belakang tumit (heel)
sin_u = np.clip(np.sin(np.clip(u_vals, 0.0, 1.0) * np.pi), 0.0, 1.0)
forefoot_bump = 0.20 * np.exp(-((u_vals - 0.30) / 0.18) ** 2)
arch_waist = -0.10 * np.exp(-((u_vals - 0.58) / 0.13) ** 2)
heel_round = 0.12 * np.exp(-((u_vals - 0.84) / 0.14) ** 2)
width_profile = (np.power(sin_u, 0.48) * (0.88 + forefoot_bump + arch_waist + heel_round))
width_profile[0] = 0.0
width_profile[-1] = 0.0
MAX_HALF_WIDTH_PX = shoe_len * 0.175  # lebar total sepatu ~35% dari panjang sepatu
W_px = width_profile * MAX_HALF_WIDTH_PX

# 4. Siapkan tekstur bersih (inpaint di luar siluet agar tepi UV mulus) + peta relief dari gambar asli
mask_orig = (im_rgba[:, :, 3] > 35).astype(np.uint8)
bgr_orig = im_rgba[:, :, :3]
# Sedikit turunkan kecerahan puncak agar pencahayaan 3D menampilkan gradasi kulit putih dengan jelas
bgr_toned = np.clip(bgr_orig.astype(np.float32) * 0.90, 0, 255).astype(np.uint8)
inv_orig = (im_rgba[:, :, 3] < 180).astype(np.uint8)
tex_inpainted = cv2.inpaint(bgr_toned, inv_orig, 7, cv2.INPAINT_TELEA)

# Buat lubang pergelangan kaki (collar interior) berwarna abu gelap alami pada bagian dalam kerah
lum_h = cv2.cvtColor(horiz_rgba[:, :, :3], cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
lum_blur = cv2.GaussianBlur(lum_h, (9, 9), 2.0)
relief_h = (lum_h - lum_blur) * 5.5 + np.clip((0.88 - lum_h) * 4.5, -1.5, 3.0)

# Matriks invers untuk memetakan titik (x_h, y_h) kembali ke koordinat UV gambar asli (w_orig, h_orig)
M_from_horiz = cv2.getRotationMatrix2D(center_pt, -SHOE_ANGLE_DEG, 1.0)

# 5. Bangun grid vertex 3D (NU x NV) mengelilingi penampang melintang sepatu:
# theta in [0, 2*pi]:
#   theta = 0       -> tengah bawah telapak sol (bottom center, z = 0, y = v_bot)
#   theta = pi/2    -> sisi luar/depan sepatu (+Z side, menghadap kamera)
#   theta = pi      -> puncak atas sepatu (top ridge: toe-box / laces / collar, z = 0, y = v_top)
#   theta = 3*pi/2  -> sisi dalam/belakang sepatu (-Z side)
thetas = np.linspace(0.0, 2.0 * np.pi, NV, endpoint=False, dtype=np.float32)

grid_xyz = np.zeros((NU, NV, 3), dtype=np.float32)
grid_uv = np.zeros((NU, NV, 2), dtype=np.float32)

scale_norm = 1.0 / shoe_len

for i in range(NU):
    u = u_vals[i]
    xh = float(x_cols[i])
    yt = float(v_top_px[i])
    yb = float(v_bot_px[i])
    col_h = max(4.0, yb - yt)
    w_col = float(W_px[i])

    # Cek apakah kolom u berada di area lubang masuk kaki (ankle collar opening: u in [0.63, 0.89])
    collar_w = np.exp(-((u - 0.77) / 0.095) ** 2) if 0.58 < u < 0.93 else 0.0

    for j, th in enumerate(thetas):
        s = np.sin(th)   # +1 di sisi depan (+Z), -1 di sisi belakang (-Z)
        c = -np.cos(th)  # -1 di bawah sol (th=0), +1 di puncak atas (th=pi)
        h_frac = 0.5 * (c + 1.0)  # 0.0 di dasar sol -> 1.0 di puncak atas

        # Bentuk penampang sepatu (Cross-section shaping):
        # Bagian bawah (h_frac < 0.28 adalah sol/midsole): dinding vertikal lebar dengan dasar sol rata!
        if h_frac < 0.08:
            # Dasar sol rata (flat outsole tread)
            t_sole = h_frac / 0.08
            y_local = yb - (1.0 - np.cos(t_sole * np.pi * 0.5)) * (col_h * 0.04)
            z_local = np.sign(s) * (t_sole ** 0.55) * w_col * 0.96
        elif h_frac < 0.32:
            # Dinding vertikal midsole (tempat tulisan AIR)
            t_mid = (h_frac - 0.08) / 0.24
            y_local = yb - (0.04 + t_mid * 0.26) * col_h
            z_local = np.sign(s) * (0.96 + 0.04 * np.sin(t_mid * np.pi)) * w_col
        else:
            # Bagian upper kulit, punggung sepatu (vamp/laces), dan kerah (collar)
            t_up = (h_frac - 0.32) / 0.68
            # Lebar melengkung mulus menuju puncak punggung sepatu (super-ellipse)
            z_factor = np.power(np.clip(1.0 - np.power(t_up, 1.85), 0.0, 1.0), 0.48)
            # Di area kerah (collar_w > 0), dekat puncak (t_up > 0.72), lekukkan ke bawah membentuk lubang pergelangan kaki!
            collar_indent = 0.0
            if collar_w > 0.05 and t_up > 0.70:
                t_rim = (t_up - 0.70) / 0.30
                collar_indent = collar_w * np.sin(t_rim * np.pi * 0.5) * (col_h * 0.16)
            y_local = yb - (0.30 + 0.70 * np.power(t_up, 0.88)) * col_h + collar_indent
            z_local = np.sign(s) * z_factor * w_col

        # Tambahkan relief detail jahitan & Swoosh pada dinding samping
        r_yi = int(np.clip(round(y_local), 0, hp - 1))
        r_xi = int(np.clip(round(xh), 0, wp - 1))
        rel = float(relief_h[r_yi, r_xi]) * (abs(s) ** 0.7)
        if 0 < i < NU - 1:
            z_local += np.sign(s) * rel

        # Putar kembali (xh, y_local) sebesar -SHOE_ANGLE_DEG ke posisi miring ikonik asli
        ox = M_from_horiz[0, 0] * xh + M_from_horiz[0, 1] * y_local + M_from_horiz[0, 2] - pad
        oy = M_from_horiz[1, 0] * xh + M_from_horiz[1, 1] * y_local + M_from_horiz[1, 2] - pad

        # Koordinat UV dipetakan langsung ke tekstur gambar asli (Air Force White)
        # Untuk dasar sol & puncak atas, jaga sampel UV sedikit di dalam tepi siluet agar warna sol abu-abu dan kulit putih mulus
        y_uv_sample = np.clip(y_local, yt + 3.0, yb - 3.0)
        ux = M_from_horiz[0, 0] * xh + M_from_horiz[0, 1] * y_uv_sample + M_from_horiz[0, 2] - pad
        uy = M_from_horiz[1, 0] * xh + M_from_horiz[1, 1] * y_uv_sample + M_from_horiz[1, 2] - pad
        u_tex = np.clip(ux / float(w_orig), 0.002, 0.998)
        v_tex = np.clip(uy / float(h_orig), 0.002, 0.998)

        # Pusatkan koordinat 3D (X, Y, Z)
        cx_orig = w_orig * 0.5
        cy_orig = h_orig * 0.46
        X3 = (ox - cx_orig) * scale_norm
        Y3 = -(oy - cy_orig) * scale_norm
        Z3 = z_local * scale_norm

        grid_xyz[i, j] = (X3, Y3, Z3)
        grid_uv[i, j] = (u_tex, v_tex)

# 6. Hitung vertex normals mulus dari turunan grid (du x dv)
du_vec = np.roll(grid_xyz, -1, axis=0) - np.roll(grid_xyz, 1, axis=0)
dv_vec = np.roll(grid_xyz, -1, axis=1) - np.roll(grid_xyz, 1, axis=1)
du_vec[0] = grid_xyz[1] - grid_xyz[0]
du_vec[-1] = grid_xyz[-1] - grid_xyz[-2]

raw_normals = np.cross(dv_vec, du_vec)
n_len = np.linalg.norm(raw_normals, axis=-1, keepdims=True) + 1e-8
grid_norm = raw_normals / n_len
# Pastikan normal di ujung jari dan tumit mengarah keluar
grid_norm[0] = np.array([-0.9, -0.2, 0.0], dtype=np.float32)
grid_norm[0] /= np.linalg.norm(grid_norm[0])
grid_norm[-1] = np.array([0.9, 0.2, 0.0], dtype=np.float32)
grid_norm[-1] /= np.linalg.norm(grid_norm[-1])

pos_arr = grid_xyz.reshape(-1, 3).astype(np.float32)
norm_arr = grid_norm.reshape(-1, 3).astype(np.float32)
uv_arr = grid_uv.reshape(-1, 2).astype(np.float32)

indices = []
for i in range(NU - 1):
    for j in range(NV):
        jn = (j + 1) % NV
        v00 = i * NV + j
        v10 = (i + 1) * NV + j
        v01 = i * NV + jn
        v11 = (i + 1) * NV + jn
        indices.extend([v00, v01, v10, v01, v11, v10])

idx_arr = np.array(indices, dtype=np.uint32)

# Encode tekstur 1024x1024
tex_resized = cv2.resize(tex_inpainted, (1024, 1024), interpolation=cv2.INTER_CUBIC)
ok, tex_bytes = cv2.imencode('.jpg', tex_resized, [int(cv2.IMWRITE_JPEG_QUALITY), 93])
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
    'asset': {'version': '2.0', 'generator': 'STRIDE-3D-ShoeLast-Generator'},
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
            'roughnessFactor': 0.46
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
