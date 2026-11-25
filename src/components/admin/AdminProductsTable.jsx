import Link from 'next/link';
import { Search, ExternalLink, Trash2, Plus, Edit3 } from 'lucide-react';

export default function AdminProductsTable({
  products,
  productSearch,
  setProductSearch,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-base">Manajemen & Moderasi Produk</h2>
          <p className="text-xs text-ink-2">
            Kelola katalog seluruh toko: tambah produk, ganti toko penjual, kategori, harga, dan stok.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <label htmlFor="admin-product-search" className="sr-only">Cari produk atau toko</label>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" aria-hidden="true" />
            <input
              id="admin-product-search"
              type="search"
              placeholder="Cari produk atau toko..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full h-11 pl-9 pr-3 rounded-md bg-surface border border-line focus:border-ink text-xs text-ink placeholder:text-ink-2 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onAddProduct}
            className="min-h-11 px-4 rounded-md bg-ink text-canvas text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-85 transition-opacity whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 border-b border-line text-ink-2 uppercase">
              <tr>
                <th className="p-4">Produk</th>
                <th className="p-4">Toko Penjual</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(products || []).length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-ink-2 text-xs">
                    {productSearch
                      ? `Tidak ada produk yang cocok dengan pencarian "${productSearch}". Kosongkan kotak pencarian untuk melihat semua produk.`
                      : 'Belum ada produk di katalog.'}
                  </td>
                </tr>
              ) : (
                (products || []).map((p) => (
                  <tr key={p.id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image_url}
                          alt={p.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-contain bg-surface-2 border border-line p-0.5 flex-shrink-0"
                        />
                        <div>
                          <Link
                            href={`/produk/${p.slug}`}
                            className="font-semibold text-ink hover:underline inline-flex items-center gap-1"
                          >
                            <span>{p.name}</span>
                            <ExternalLink className="w-3 h-3 text-ink-2" aria-hidden="true" />
                          </Link>
                          <div className="text-xs text-ink-2">ID #{p.id} · {p.brand || 'Stride Studio'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-ink">{p.store_name}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-surface-2 border border-line text-ink">
                        {p.category_name}
                      </span>
                    </td>
                    <td className="p-4 font-semibold tabular-nums">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 tabular-nums">
                      <span className={p.stock < 5 ? 'text-accent font-semibold' : 'text-ink'}>
                        {p.stock} unit
                      </span>
                    </td>
                    <td className="p-4 tabular-nums">
                      {Number(p.rating_avg || 0).toFixed(1)} / 5
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditProduct(p)}
                          title="Edit detail produk & atur toko"
                          className="min-h-9 px-3 rounded-md bg-canvas border border-line hover:border-ink text-ink-2 hover:text-ink text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(p)}
                          title="Hapus produk dari katalog"
                          className="min-h-9 px-3 rounded-md bg-canvas border border-line hover:border-accent text-ink-2 hover:text-accent text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
