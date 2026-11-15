import { FolderTree, AlertTriangle } from 'lucide-react';

export function CategoryModal({ modal, setModal, onSave, isSubmitting }) {
  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-md w-full bg-[#10141D] border border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2331]">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-purple-400" />
            <span>{modal.isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
          </h3>
          <button onClick={() => setModal({ ...modal, isOpen: false })} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-400 font-semibold">Nama Kategori</label>
            <input
              type="text"
              required
              placeholder="e.g. Esports Jersey"
              value={modal.name}
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] focus:border-purple-500 text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-400 font-semibold">Slug URL (Opsional)</label>
            <input
              type="text"
              placeholder="e.g. esports-jersey"
              value={modal.slug}
              onChange={(e) => setModal({ ...modal, slug: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] focus:border-purple-500 text-white outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-400 font-semibold">URL Gambar Thumbnail</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={modal.image_url}
              onChange={(e) => setModal({ ...modal, image_url: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] focus:border-purple-500 text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-400 font-semibold">Deskripsi</label>
            <textarea
              rows={3}
              placeholder="Deskripsi kategori..."
              value={modal.description}
              onChange={(e) => setModal({ ...modal, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#151A23] border border-[#262E3D] focus:border-purple-500 text-white outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C2331]">
            <button
              type="button"
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="px-4 py-2 rounded-xl bg-[#151A23] hover:bg-[#1E2638] text-gray-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeleteConfirmModal({ modal, setModal, onConfirm, isSubmitting }) {
  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-md w-full bg-[#10141D] border border-red-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <h3 className="font-bold text-white text-sm">Konfirmasi Penghapusan</h3>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Apakah Anda yakin ingin menghapus:{' '}
          <span className="font-bold text-white block mt-1">{modal.title}</span>
        </p>

        <p className="text-[11px] text-red-400/80 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
          Tindakan ini tidak dapat dibatalkan dan akan langsung mempengaruhi data di database.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C2331]">
          <button
            type="button"
            onClick={() => setModal({ isOpen: false, type: null, id: null, title: '' })}
            className="px-4 py-2 rounded-xl bg-[#151A23] hover:bg-[#1E2638] text-gray-300 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold disabled:opacity-50"
          >
            {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
