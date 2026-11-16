'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function SellerProductModal({
  isOpen,
  onClose,
  editingProduct,
  productForm,
  setProductForm,
  categories,
  onSubmit,
  submitting,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="seller-product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60"
    >
      <div className="w-full max-w-lg p-6 rounded-xl bg-surface border border-line shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h3 id="seller-product-modal-title" className="font-semibold text-base">
            {editingProduct ? 'Edit Produk Toko' : 'Tambah Produk Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog produk"
            className="w-9 h-9 rounded-md flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="prod-name" className="text-xs font-semibold text-ink block">
              Nama produk *
            </label>
            <input
              id="prod-name"
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="Masukkan nama sepatu atau pakaian"
              className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="prod-cat" className="text-xs font-semibold text-ink block">
                Kategori *
              </label>
              <select
                id="prod-cat"
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink focus:outline-none focus:border-ink"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="prod-brand" className="text-xs font-semibold text-ink block">
                Merek *
              </label>
              <input
                id="prod-brand"
                type="text"
                required
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                placeholder="Nike, Puma, Off White..."
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="prod-price" className="text-xs font-semibold text-ink block">
                Harga (IDR) *
              </label>
              <input
                id="prod-price"
                type="number"
                required
                min="1000"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="1500000"
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prod-stock" className="text-xs font-semibold text-ink block">
                Stok barang *
              </label>
              <input
                id="prod-stock"
                type="number"
                required
                min="0"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                placeholder="20"
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="prod-img" className="text-xs font-semibold text-ink block">
              URL gambar produk *
            </label>
            <input
              id="prod-img"
              type="url"
              required
              value={productForm.imageUrl}
              onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
              placeholder="https://cdn.dummyjson.com/..."
              className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="prod-desc" className="text-xs font-semibold text-ink block">
              Deskripsi produk
            </label>
            <textarea
              id="prod-desc"
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Jelaskan material, potongan, dan detail ukuran..."
              className="w-full p-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={productForm.isFeatured}
              onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded border-line"
            />
            <label htmlFor="isFeatured" className="text-xs text-ink font-medium">
              Tampilkan di bagian Pilihan Minggu Ini pada beranda
            </label>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-11 rounded-md bg-surface-2 text-ink border border-line hover:bg-line text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 min-h-11 rounded-md bg-ink text-canvas font-semibold text-xs hover:opacity-85 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
