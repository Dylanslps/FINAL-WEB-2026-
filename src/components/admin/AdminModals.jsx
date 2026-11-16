'use client';

import { useEffect } from 'react';
import { FolderTree, AlertTriangle, X } from 'lucide-react';

export function CategoryModal({ modal, setModal, onSave, isSubmitting }) {
  useEffect(() => {
    if (!modal.isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setModal((m) => ({ ...m, isOpen: false }));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal.isOpen, setModal]);

  if (!modal.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60"
    >
      <div className="max-w-md w-full bg-surface border border-line rounded-xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <h3 id="category-modal-title" className="font-semibold text-base flex items-center gap-2">
            <FolderTree className="w-5 h-5" aria-hidden="true" />
            <span>{modal.isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
          </h3>
          <button
            type="button"
            onClick={() => setModal({ ...modal, isOpen: false })}
            aria-label="Tutup dialog kategori"
            className="w-9 h-9 rounded-md flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label htmlFor="cat-name" className="text-ink font-semibold block">Nama kategori *</label>
            <input
              id="cat-name"
              type="text"
              required
              placeholder="Contoh: Sepatu Lari"
              value={modal.name}
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
              className="w-full h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cat-slug" className="text-ink font-semibold block">Slug URL (opsional)</label>
            <input
              id="cat-slug"
              type="text"
              placeholder="sepatu-lari"
              value={modal.slug}
              onChange={(e) => setModal({ ...modal, slug: e.target.value })}
              className="w-full h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cat-desc" className="text-ink font-semibold block">Deskripsi</label>
            <textarea
              id="cat-desc"
              rows={3}
              placeholder="Jelaskan jenis produk dalam kategori ini..."
              value={modal.description}
              onChange={(e) => setModal({ ...modal, description: e.target.value })}
              className="w-full p-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="min-h-11 px-4 rounded-md bg-surface-2 hover:bg-line text-ink font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 px-5 rounded-md bg-ink text-canvas font-semibold hover:opacity-85 disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeleteConfirmModal({ modal, setModal, onConfirm, isSubmitting }) {
  useEffect(() => {
    if (!modal.isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setModal({ isOpen: false, type: null, id: null, title: '' });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal.isOpen, setModal]);

  if (!modal.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60"
    >
      <div className="max-w-md w-full bg-surface border border-line rounded-xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3 text-accent">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
          <h3 id="delete-modal-title" className="font-semibold text-ink text-base">Konfirmasi Penghapusan</h3>
        </div>

        <p className="text-xs text-ink-2 leading-relaxed">
          Apakah Anda yakin ingin menghapus:
          <span className="font-semibold text-ink block mt-1">{modal.title}</span>
        </p>

        <p className="text-xs text-accent bg-surface-2 p-3 rounded-md border border-line">
          Tindakan ini tidak dapat dibatalkan dan akan langsung menghapus data di database.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
          <button
            type="button"
            onClick={() => setModal({ isOpen: false, type: null, id: null, title: '' })}
            className="min-h-11 px-4 rounded-md bg-surface-2 hover:bg-line text-ink text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="min-h-11 px-5 rounded-md bg-accent text-canvas text-xs font-semibold hover:opacity-85 disabled:opacity-50"
          >
            {isSubmitting ? 'Menghapus...' : 'Ya, hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
