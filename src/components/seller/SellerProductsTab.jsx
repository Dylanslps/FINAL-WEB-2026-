'use client';

import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function SellerProductsTab({
  products,
  loading,
  formatIDR,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-base">Katalog Produk Toko</h2>
          <p className="text-xs text-ink-2">Total {products.length} produk aktif</p>
        </div>
        <button
          type="button"
          onClick={onAddProduct}
          className="min-h-11 px-4 inline-flex items-center gap-1.5 rounded-md bg-ink text-canvas font-semibold text-xs hover:opacity-85"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Tambah produk baru
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-ink-2">Memuat daftar produk...</div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-surface border border-line space-y-2">
          <p className="text-sm font-medium">Belum ada produk di toko ini</p>
          <p className="text-xs text-ink-2">
            Klik tombol Tambah produk baru di kanan atas untuk mulai menambahkan sepatu atau pakaian.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-ink-2 uppercase border-b border-line">
                <tr>
                  <th className="p-3.5">Produk</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Harga</th>
                  <th className="p-3.5">Stok</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image_url}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded object-contain bg-surface-2 border border-line p-0.5"
                      />
                      <div className="max-w-xs truncate">
                        <p className="font-semibold text-ink truncate">{p.name}</p>
                        <p className="text-xs text-ink-2 truncate">{p.brand || 'Stride Studio'}</p>
                      </div>
                    </td>
                    <td className="p-3.5 text-ink-2">{p.category_name}</td>
                    <td className="p-3.5 font-semibold tabular-nums">{formatIDR(p.price)}</td>
                    <td className="p-3.5 tabular-nums">{p.stock} unit</td>
                    <td className="p-3.5 tabular-nums">{Number(p.rating_avg || 0).toFixed(1)} / 5</td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditProduct(p)}
                          aria-label={`Edit ${p.name}`}
                          className="w-9 h-9 rounded-md bg-canvas border border-line text-ink hover:bg-surface-2 inline-flex items-center justify-center"
                        >
                          <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(p.id)}
                          aria-label={`Hapus ${p.name}`}
                          className="w-9 h-9 rounded-md bg-canvas border border-line text-ink-2 hover:text-accent hover:border-accent inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
