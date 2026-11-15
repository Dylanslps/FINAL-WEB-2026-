import Image from 'next/image';
import { FolderTree, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategoriesTab({ categories, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Kategori Perlengkapan Turnamen
          </h2>
          <p className="text-xs text-gray-400">
            Kelola klasifikasi produk turnamen untuk mempermudah pencarian buyer
          </p>
        </div>

        <button
          onClick={onAdd}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(categories || []).length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 font-mono text-xs rounded-2xl bg-[#10141D] border border-[#1C2331]">
            Belum ada kategori yang ditambahkan.
          </div>
        ) : (
          (categories || []).map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-2xl bg-[#10141D] border border-[#1C2331] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-full h-28 relative rounded-xl overflow-hidden bg-[#151A23] border border-[#1C2331]">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <FolderTree className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                <p className="text-[11px] text-gray-400 font-mono">/{cat.slug}</p>
              </div>

              <p className="text-xs text-gray-400 line-clamp-2">
                {cat.description || 'Tidak ada deskripsi kategori'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1C2331] flex items-center justify-between text-xs">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#151A23] text-gray-400 font-mono">
                {cat.product_count || 0} Produk
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(cat)}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                  title="Edit Kategori"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDelete(cat)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}
