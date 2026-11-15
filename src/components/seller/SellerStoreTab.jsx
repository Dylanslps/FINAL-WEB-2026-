'use client';

import { Save } from 'lucide-react';

export default function SellerStoreTab({
  storeForm,
  setStoreForm,
  onSubmit,
  submitting,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl p-6 rounded-2xl bg-[#121722] border border-[#20293A] space-y-4"
    >
      <h2 className="text-base font-bold text-white border-b border-[#20293A] pb-3 font-sans">
        Pengaturan Profil Toko Merchant
      </h2>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-300">Nama Toko *</label>
        <input
          type="text"
          required
          value={storeForm.name}
          onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
          className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-300">Deskripsi Toko</label>
        <textarea
          rows={3}
          value={storeForm.description}
          onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
          className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-300">URL Logo Toko (Gambar Internet)</label>
        <input
          type="url"
          value={storeForm.logoUrl}
          onChange={(e) => setStoreForm({ ...storeForm, logoUrl: e.target.value })}
          placeholder="https://images.unsplash.com/..."
          className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 rounded-xl bg-[#FF1E27] text-white font-black text-xs hover:bg-[#FFD000] hover:text-black transition-colors flex items-center gap-1.5 disabled:opacity-50 uppercase tracking-wider shadow-md shadow-[#FF1E27]/20"
      >
        <Save className="w-4 h-4" /> Simpan Perubahan Profil
      </button>
    </form>
  );
}
