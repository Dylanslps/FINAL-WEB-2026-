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
      className="max-w-xl p-6 rounded-xl bg-surface border border-line space-y-4"
    >
      <h2 className="font-semibold text-base border-b border-line pb-3">
        Pengaturan Profil Toko
      </h2>

      <div className="space-y-1.5">
        <label htmlFor="store-name" className="text-xs font-semibold text-ink block">
          Nama toko *
        </label>
        <input
          id="store-name"
          type="text"
          required
          value={storeForm.name}
          onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
          className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink focus:outline-none focus:border-ink"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="store-desc" className="text-xs font-semibold text-ink block">
          Deskripsi toko
        </label>
        <textarea
          id="store-desc"
          rows={3}
          value={storeForm.description}
          onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
          className="w-full p-3 rounded-md bg-canvas border border-line text-sm text-ink focus:outline-none focus:border-ink"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="store-logo" className="text-xs font-semibold text-ink block">
          URL logo toko
        </label>
        <input
          id="store-logo"
          type="url"
          value={storeForm.logoUrl}
          onChange={(e) => setStoreForm({ ...storeForm, logoUrl: e.target.value })}
          placeholder="https://cdn.dummyjson.com/..."
          className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="min-h-11 px-6 rounded-md bg-ink text-canvas font-semibold text-xs hover:opacity-85 inline-flex items-center gap-1.5 disabled:opacity-50"
      >
        <Save className="w-4 h-4" aria-hidden="true" /> Simpan perubahan
      </button>
    </form>
  );
}
