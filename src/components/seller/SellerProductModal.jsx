'use client';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-[#121722] border border-[#20293A] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#20293A] pb-3">
          <h3 className="font-bold text-white text-base">
            {editingProduct ? 'Edit Produk Toko' : 'Tambah Produk Baru'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Nama Produk *</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="Contoh: SteelSeries Apex Pro TKL Keyboard"
              className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white focus:outline-none focus:border-[#FF1E27]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Kategori *</label>
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white focus:outline-none focus:border-[#FF1E27]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Brand *</label>
              <input
                type="text"
                required
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                placeholder="Razer, Logitech, BTR"
                className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white focus:outline-none focus:border-[#FF1E27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Harga (IDR) *</label>
              <input
                type="number"
                required
                min="1000"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="1500000"
                className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white focus:outline-none focus:border-[#FF1E27]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Stok Barang *</label>
              <input
                type="number"
                required
                min="0"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                placeholder="25"
                className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white focus:outline-none focus:border-[#FF1E27]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">URL Gambar (Internet API/CDN) *</label>
            <input
              type="url"
              required
              value={productForm.imageUrl}
              onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white focus:outline-none focus:border-[#FF1E27]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Deskripsi & Spek</label>
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Jelaskan switch, sensor, polling rate..."
              className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white focus:outline-none focus:border-[#FF1E27]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={productForm.isFeatured}
              onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
              className="rounded bg-[#0A0D14] border-[#20293A] text-[#FF1E27] focus:ring-[#FF1E27]"
            />
            <label htmlFor="isFeatured" className="text-xs text-gray-300 font-medium">
              Tandai sebagai Featured Drop (Tampil di Hero Homepage)
            </label>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#0A0D14] text-gray-300 border border-[#20293A] hover:bg-[#1A2232] text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[#FF1E27] text-white font-extrabold text-xs hover:bg-[#FFD000] hover:text-black transition-all shadow-md shadow-[#FF1E27]/20 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
