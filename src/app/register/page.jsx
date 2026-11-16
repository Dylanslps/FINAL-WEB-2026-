'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Store, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState('buyer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    storeName: '',
    storeDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const action = role === 'buyer' ? 'register_buyer' : 'register_seller';
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Pendaftaran gagal.');
      }

      login(data.user);

      if (role === 'buyer') {
        router.push('/katalog');
      } else {
        router.push('/seller/pending');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="font-display uppercase text-4xl">Daftar Akun Baru</h1>
        <p className="text-sm text-ink-2">
          Pilih peran sebagai pembeli atau penjual toko di STRIDE.
        </p>
      </div>

      {/* Pilihan peran */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-surface border border-line gap-1">
        <button
          type="button"
          aria-pressed={role === 'buyer'}
          onClick={() => { setRole('buyer'); setErrorMsg(''); }}
          className={`min-h-11 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            role === 'buyer'
              ? 'bg-ink text-canvas'
              : 'text-ink-2 hover:text-ink hover:bg-surface-2'
          }`}
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          Pembeli (Buyer)
        </button>

        <button
          type="button"
          aria-pressed={role === 'seller'}
          onClick={() => { setRole('seller'); setErrorMsg(''); }}
          className={`min-h-11 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            role === 'seller'
              ? 'bg-ink text-canvas'
              : 'text-ink-2 hover:text-ink hover:bg-surface-2'
          }`}
        >
          <Store className="w-4 h-4" aria-hidden="true" />
          Penjual (Seller)
        </button>
      </div>

      <div className="p-6 rounded-xl bg-surface border border-line space-y-5">
        {role === 'seller' && (
          <div className="p-3 rounded-md bg-surface-2 border border-line text-ink-2 text-xs leading-relaxed">
            Pendaftaran Seller akan berstatus <strong className="text-warn">Pending</strong> terlebih dahulu dan ditinjau oleh Admin sebelum toko dapat menjual produk.
          </div>
        )}

        {errorMsg && (
          <div role="alert" className="flex items-center gap-2 p-3 rounded-md bg-surface-2 border border-accent text-accent text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="text-xs font-semibold text-ink block">
              Nama lengkap *
            </label>
            <input
              id="reg-name"
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="text-xs font-semibold text-ink block">
                Alamat email *
              </label>
              <input
                id="reg-email"
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@contoh.com"
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="text-xs font-semibold text-ink block">
                Kata sandi *
              </label>
              <input
                id="reg-password"
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-phone" className="text-xs font-semibold text-ink block">
              Nomor telepon
            </label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="081234567890"
              className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-address" className="text-xs font-semibold text-ink block">
              Alamat domisili / pengiriman
            </label>
            <textarea
              id="reg-address"
              rows={2}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Tulis alamat lengkap Anda..."
              className="w-full p-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          {role === 'seller' && (
            <div className="pt-4 border-t border-line space-y-4">
              <h2 className="text-sm font-semibold">Informasi Toko</h2>

              <div className="space-y-1.5">
                <label htmlFor="reg-store-name" className="text-xs font-semibold text-ink block">
                  Nama toko *
                </label>
                <input
                  id="reg-store-name"
                  type="text"
                  required={role === 'seller'}
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Masukkan nama toko"
                  className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-store-desc" className="text-xs font-semibold text-ink block">
                  Deskripsi singkat toko
                </label>
                <textarea
                  id="reg-store-desc"
                  rows={2}
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Jelaskan jenis sepatu atau pakaian yang dijual toko Anda..."
                  className="w-full p-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-12 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {loading
              ? 'Mendaftarkan akun...'
              : role === 'buyer'
              ? 'Selesaikan pendaftaran pembeli'
              : 'Kirim pengajuan toko'}
          </button>
        </form>

        <div className="pt-3 border-t border-line text-center text-xs text-ink-2">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-ink underline underline-offset-4 font-semibold">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
