'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, ShoppingBag, Store, User, Mail, Lock, Phone, MapPin, FileText, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] flex items-center justify-center mx-auto shadow-lg shadow-[#00F0FF]/10">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Pendaftaran Akun Baru
        </h1>
        <p className="text-xs text-gray-400">
          Bergabung ke platform resmi turnamen esports VALIANT.
        </p>
      </div>

      {/* Role Selector Tabs (Sesuai Spesifikasi: Buyer atau Seller) */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#151A23] border border-[#262E3D] gap-1.5">
        <button
          type="button"
          onClick={() => { setRole('buyer'); setErrorMsg(''); }}
          className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            role === 'buyer'
              ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20 font-extrabold'
              : 'text-gray-400 hover:text-white hover:bg-[#262E3D]/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Daftar sebagai Pembeli (Buyer)
        </button>

        <button
          type="button"
          onClick={() => { setRole('seller'); setErrorMsg(''); }}
          className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            role === 'seller'
              ? 'bg-[#FF5E00] text-white shadow-lg shadow-[#FF5E00]/20 font-extrabold'
              : 'text-gray-400 hover:text-white hover:bg-[#262E3D]/50'
          }`}
        >
          <Store className="w-4 h-4" />
          Daftar sebagai Penjual (Seller)
        </button>
      </div>

      {/* Form Container */}
      <div className="p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] space-y-5">
        
        {role === 'seller' && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Catatan: Pendaftaran Seller akan berstatus <strong>Pending</strong> terlebih dahulu dan ditinjau oleh Admin sebelum toko aktif.
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Identitas Diri */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00F0FF]" /> Nama Lengkap *
            </label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Dylan Dwiputra"
              className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#00F0FF]" /> Alamat Email *
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#00F0FF]" /> Kata Sandi *
              </label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00F0FF]" /> Nomor WhatsApp / Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="081234567890"
              className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" /> Alamat Pengiriman
            </label>
            <textarea
              rows={2}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Alamat domisili lengkap..."
              className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          {/* Kolom Khusus Seller */}
          {role === 'seller' && (
            <div className="pt-4 border-t border-[#262E3D] space-y-4">
              <h3 className="text-xs font-bold text-[#FF5E00] uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4" /> Informasi Toko Esports:
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Nama Toko *</label>
                <input
                  type="text"
                  required={role === 'seller'}
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Contoh: CyberTech Pro Gaming Gear"
                  className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5E00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Deskripsi Singkat Toko</label>
                <textarea
                  rows={2}
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Ceritakan jenis produk gear turnamen yang ingin Anda jual..."
                  className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5E00]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${
              role === 'buyer'
                ? 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 shadow-[#00F0FF]/25'
                : 'bg-[#FF5E00] text-white hover:bg-[#FF5E00]/90 shadow-[#FF5E00]/25'
            }`}
          >
            {loading
              ? 'Mendaftarkan Akun...'
              : role === 'buyer'
              ? 'Selesaikan Pendaftaran Pembeli'
              : 'Kirim Pengajuan Toko Seller'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-[#262E3D] text-center text-xs text-gray-400">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="text-[#00F0FF] hover:underline font-bold">
            Masuk di Sini
          </Link>
        </div>

      </div>

    </div>
  );
}
