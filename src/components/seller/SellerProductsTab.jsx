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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-sans">Katalog Produk Toko</h2>
          <p className="text-xs text-gray-400 font-mono">Total {products.length} item aktif</p>
        </div>
        <button
          onClick={onAddProduct}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF1E27] text-white font-black text-xs hover:bg-[#FFD000] hover:text-black transition-all shadow-md shadow-[#FF1E27]/20 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400 font-mono">Memuat produk...</div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#121722] border border-[#20293A] text-gray-400 text-xs">
          Belum ada produk di toko Anda. Klik &quot;Tambah Produk Baru&quot; untuk mulai menjual perlengkapan esports.
        </div>
      ) : (
        <div className="rounded-2xl bg-[#121722] border border-[#20293A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0D14] text-gray-400 uppercase font-mono border-b border-[#20293A] text-[11px]">
                <tr>
                  <th className="p-3.5">Produk</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Harga</th>
                  <th className="p-3.5">Stok</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20293A]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1A2232] transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-[#0A0D14] border border-[#20293A]"
                      />
                      <div className="max-w-xs truncate">
                        <p className="font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{p.brand || 'VALIANT PRO'}</p>
                      </div>
                    </td>
                    <td className="p-3.5 text-gray-300 font-mono">{p.category_name}</td>
                    <td className="p-3.5 font-bold font-mono text-[#FF1E27]">{formatIDR(p.price)}</td>
                    <td className="p-3.5 font-mono text-gray-300">{p.stock} Unit</td>
                    <td className="p-3.5 font-mono text-amber-400">★ {Number(p.rating_avg || 5.0).toFixed(1)}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onEditProduct(p)}
                        className="p-1.5 rounded-lg bg-[#0A0D14] border border-[#20293A] text-gray-300 hover:text-white hover:border-[#FFD000] transition-colors"
                        title="Edit Produk"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-[#0A0D14] border border-[#20293A] text-gray-300 hover:text-rose-400 hover:border-rose-500 transition-colors"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
