'use client';

import { useEffect } from 'react';
import { FolderTree, AlertTriangle, X, Package } from 'lucide-react';

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

export function AdminProductModal({
  modal,
  setModal,
  stores = [],
  categories = [],
  onSave,
  isSubmitting,
}) {
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
      aria-labelledby="admin-product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60"
    >
      <div className="max-w-xl w-full bg-surface border border-line rounded-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <h3 id="admin-product-modal-title" className="font-semibold text-base flex items-center gap-2 text-ink">
            <Package className="w-5 h-5" aria-hidden="true" />
            <span>{modal.isEdit ? 'Edit Produk & Pengaturan Toko Penjual' : 'Tambah Produk Baru ke Toko'}</span>
          </h3>
          <button
            type="button"
            onClick={() => setModal({ ...modal, isOpen: false })}
            aria-label="Tutup dialog produk"
            className="w-9 h-9 rounded-md flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4 text-xs">
          {/* Toko Penjual (Store) & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="admin-prod-store" className="text-ink font-semibold block">
                Toko Penjual (Store) *
              </label>
              <select
                id="admin-prod-store"
                required
                value={modal.storeId}
                onChange={(e) => setModal({ ...modal, storeId: e.target.value })}
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink outline-none"
              >
                <option value="" disabled>Pilih Toko Penjual</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.seller_name})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-ink-2">Pilih toko tempat produk ini bernaung.</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="admin-prod-cat" className="text-ink font-semibold block">
                Kategori *
              </label>
              <select
                id="admin-prod-cat"
                required
                value={modal.categoryId}
                onChange={(e) => setModal({ ...modal, categoryId: e.target.value })}
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink outline-none"
              >
                <option value="" disabled>Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-ink-2">Klasifikasi jenis produk di katalog.</p>
            </div>
          </div>

          {/* Nama Produk & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="admin-prod-name" className="text-ink font-semibold block">
                Nama Produk *
              </label>
              <input
                id="admin-prod-name"
                type="text"
                required
                placeholder="Contoh: Nike Air Force 1 '07"
                value={modal.name}
                onChange={(e) => setModal({ ...modal, name: e.target.value })}
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="admin-prod-brand" className="text-ink font-semibold block">
                Merek / Brand
              </label>
              <input
                id="admin-prod-brand"
                type="text"
                placeholder="Nike, Puma, dsb."
                value={modal.brand}
                onChange={(e) => setModal({ ...modal, brand: e.target.value })}
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none"
              />
            </div>
          </div>

          {/* Harga & Stok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="admin-prod-price" className="text-ink font-semibold block">
                Harga (IDR) *
              </label>
              <input
                id="admin-prod-price"
                type="number"
                required
                min="0"
                step="any"
                placeholder="1919840"
                value={modal.price}
                onChange={(e) => setModal({ ...modal, price: e.target.value })}
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="admin-prod-stock" className="text-ink font-semibold block">
                Jumlah Stok (Unit) *
              </label>
              <input
                id="admin-prod-stock"
                type="number"
                required
                min="0"
                placeholder="20"
                value={modal.stock}
                onChange={(e) => setModal({ ...modal, stock: e.target.value })}
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none"
              />
            </div>
          </div>

          {/* URL Gambar Produk & Live Thumbnail Preview */}
          <div className="space-y-1">
            <label htmlFor="admin-prod-img" className="text-ink font-semibold block">
              URL Gambar Produk *
            </label>
            <div className="flex gap-3 items-center">
              <input
                id="admin-prod-img"
                type="text"
                required
                placeholder="https://... atau /hero/airforcewhite.png"
                value={modal.imageUrl}
                onChange={(e) => setModal({ ...modal, imageUrl: e.target.value })}
                className="flex-1 h-11 px-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none"
              />
              {modal.imageUrl && (
                <div className="w-11 h-11 rounded-md bg-surface-2 border border-line p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={modal.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1">
            <label htmlFor="admin-prod-desc" className="text-ink font-semibold block">
              Deskripsi Produk
            </label>
            <textarea
              id="admin-prod-desc"
              rows={3}
              placeholder="Deskripsi produk, material, keunggulan..."
              value={modal.description}
              onChange={(e) => setModal({ ...modal, description: e.target.value })}
              className="w-full p-3 rounded-md bg-canvas border border-line focus:border-ink text-sm text-ink placeholder:text-ink-2 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
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
              {isSubmitting ? 'Menyimpan...' : modal.isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
