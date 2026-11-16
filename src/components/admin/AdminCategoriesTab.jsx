import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategoriesTab({ categories, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-base">Kategori Produk</h2>
          <p className="text-xs text-ink-2">
            Kelola kategori sepatu, pakaian, dan aksesori untuk katalog toko.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="min-h-11 px-4 rounded-md bg-ink text-canvas text-xs font-semibold inline-flex items-center gap-2 hover:opacity-85"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Tambah kategori</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(categories || []).length === 0 ? (
          <div className="col-span-full p-8 text-center text-ink-2 text-xs rounded-xl bg-surface border border-line">
            Belum ada kategori. Klik Tambah kategori untuk membuat kategori baru.
          </div>
        ) : (
          (categories || []).map((cat) => (
            <article
              key={cat.id}
              className="p-4 rounded-xl bg-surface border border-line space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <h3 className="font-semibold text-sm">{cat.name}</h3>
                <p className="text-xs text-ink-2">/{cat.slug}</p>
                <p className="text-xs text-ink-2 line-clamp-2 pt-1">
                  {cat.description || 'Tidak ada deskripsi kategori'}
                </p>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-surface-2 text-ink border border-line tabular-nums">
                  {cat.product_count || 0} produk
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(cat)}
                    aria-label={`Edit kategori ${cat.name}`}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-md bg-canvas border border-line text-ink hover:bg-surface-2"
                  >
                    <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(cat)}
                    aria-label={`Hapus kategori ${cat.name}`}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-md bg-canvas border border-line text-ink-2 hover:text-accent hover:border-accent"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
