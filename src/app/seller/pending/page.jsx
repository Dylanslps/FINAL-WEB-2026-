'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Clock, XCircle, CheckCircle2, Trash2, Store, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export default function SellerPendingPage() {
  const router = useRouter();
  const { user, logout, switchAccount } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDeleteRejectedAccount = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun toko yang ditolak ini? Tindakan ini permanen.')) {
      return;
    }

    setDeleting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_rejected',
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus akun.');
      }

      logout();
      router.push('/');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#151A23] border border-[#262E3D]">
        <div className="w-12 h-12 rounded-full bg-[#262E3D] flex items-center justify-center mx-auto text-amber-400">
          <Store className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Status Pengajuan Seller</h2>
        <p className="text-xs text-gray-400">
          Silakan masuk ke akun seller Anda untuk memeriksa status verifikasi toko.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => switchAccount('seller_pending')}
            className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-all"
          >
            Uji Coba Cepat: Masuk sebagai Seller Pending (Budi)
          </button>
          <Link
            href="/login"
            className="w-full py-2.5 rounded-xl bg-[#0B0E14] text-gray-300 border border-[#262E3D] font-bold text-xs hover:text-white"
          >
            Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  // Jika Seller sudah disetujui
  if (user.role === 'seller' && user.status === 'approved') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6 p-8 rounded-2xl bg-[#151A23] border border-emerald-500/40 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">Toko Anda Telah Disetujui!</h2>
          <p className="text-xs text-gray-400">
            Akun seller Anda ({user.name}) aktif dan siap mengelola katalog produk.
          </p>
        </div>
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs hover:bg-[#00F0FF]/90 transition-all shadow-lg shadow-[#00F0FF]/25"
        >
          Masuk ke Dashboard Seller <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Jika Seller Ditolak (Sesuai Spesifikasi: Muncul Tombol Delete Account)
  if (user.role === 'seller' && user.status === 'rejected') {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-6 p-8 rounded-2xl bg-[#151A23] border border-rose-500/40 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
            STATUS: DITOLAK (REJECTED)
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Pengajuan Toko Anda Ditolak
          </h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Maaf, pengajuan toko untuk akun <strong>{user.name}</strong> tidak memenuhi persyaratan standar verifikasi admin kami.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-4 rounded-xl bg-[#0B0E14] border border-[#262E3D] text-left text-xs space-y-3">
          <p className="text-gray-300">
            Sesuai regulasi sistem, Anda dapat menghapus data akun toko ini dan mengajukan kembali di kemudian hari.
          </p>
          <button
            onClick={handleDeleteRejectedAccount}
            disabled={deleting}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Menghapus Akun...' : 'Hapus Akun Saya (Delete Account)'}
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Default: Seller Berstatus PENDING (Menunggu Ditinjau)
  return (
    <div className="max-w-lg mx-auto py-12 text-center space-y-6 p-8 rounded-2xl bg-[#151A23] border border-amber-500/30 shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 animate-pulse">
        <Clock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold tracking-wider">
          STATUS: MENUNGGU VERIFIKASI
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Akun Anda Sedang Ditinjau
        </h1>
        <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
          Pengajuan toko untuk <strong>{user.name}</strong> sedang dievaluasi oleh tim Admin VALIANT. Anda belum dapat mengunggah produk hingga status disetujui.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#0B0E14] border border-[#262E3D] text-left text-xs space-y-2 font-mono">
        <div className="flex justify-between">
          <span className="text-gray-400">Email Seller:</span>
          <span className="text-gray-200">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status Toko:</span>
          <span className="text-amber-400 font-bold">Pending Approval</span>
        </div>
      </div>

      {/* Shortcut Demo Pengujian Cepat untuk Dosen / Aslab */}
      <div className="p-4 rounded-xl bg-[#0B0E14]/60 border border-[#262E3D] text-left text-xs space-y-2">
        <p className="text-[10px] text-gray-400 font-mono uppercase font-bold text-center">
          Pintasan Pengujian (Aslab / Dosen):
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => switchAccount('admin')}
            className="py-2 px-3 rounded-lg bg-[#262E3D] hover:bg-purple-500/20 hover:text-purple-300 text-gray-200 font-medium text-center text-xs transition-colors"
          >
            🛡️ Buka Panel Admin (Untuk Approve)
          </button>
          <button
            onClick={() => switchAccount('seller')}
            className="py-2 px-3 rounded-lg bg-[#262E3D] hover:bg-[#FF5E00]/20 hover:text-[#FF5E00] text-gray-200 font-medium text-center text-xs transition-colors"
          >
            🏪 Masuk Seller Approved (Apex)
          </button>
        </div>
      </div>
    </div>
  );
}
