import Image from 'next/image';
import Link from 'next/link';
import { Search, ExternalLink, Trash2 } from 'lucide-react';

export default function AdminProductsTable({
  products,
  productSearch,
  setProductSearch,
  onDeleteProduct,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Moderasi Seluruh Katalog
          </h2>
          <p className="text-xs text-gray-400">
            Pantau gear turnamen dan turunkan produk yang melanggar aturan platform
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Cari produk atau toko..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#10141D] border border-[#1C2331] focus:border-purple-500 text-xs text-white placeholder-gray-500 outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#1C2331] bg-[#10141D] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151A23] border-b border-[#1C2331] text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Produk</th>
                <th className="p-4">Toko Penjual</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2331]">
              {(products || []).length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 font-mono text-xs">
                    Tidak ada produk yang cocok dengan pencarian &quot;{productSearch}&quot;.
                  </td>
                </tr>
              ) : (
                (products || []).map((p) => (
                <tr key={p.id} className="hover:bg-[#151A23]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-[#151A23] flex-shrink-0 border border-[#262E3D]">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt={p.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : null}
                      </div>
                      <div>
                        <Link
                          href={`/produk/${p.slug}`}
                          target="_blank"
                          className="font-bold text-white hover:text-[#FF1E27] transition-colors flex items-center gap-1"
                        >
                          <span>{p.name}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </Link>
                        <span className="text-[10px] text-gray-500 font-mono">ID: #{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-200 font-medium">{p.store_name}</div>
                    <div className="text-[10px] text-gray-500">Seller ID #{p.seller_id}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#151A23] border border-[#262E3D] text-gray-300">
                      {p.category_name}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    Rp {Number(p.price).toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 font-mono">
                    <span className={p.stock < 5 ? 'text-red-400 font-bold' : 'text-gray-300'}>
                      {p.stock} unit
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <span>★</span>
                      <span>{Number(p.rating || 0).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onDeleteProduct(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
