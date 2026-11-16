'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Clock, XCircle, CheckCircle2, Trash2, Store, AlertCircle } from 'lucide-react';

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
      <div className="max-w-md mx-auto my-12 text-center space-y-4 p-8 rounded-xl bg-surface border border-line">
        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mx-auto text-warn">
          <Store className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="font-display uppercase text-2xl">Status Pengajuan Seller</h1>
        <p className="text-sm text-ink-2">
          Masuk ke akun seller Anda untuk memeriksa status verifikasi toko.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => switchAccount('seller_pending')}
            className="w-full min-h-11 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
          >
            Uji coba: masuk sebagai Seller Pending (Budi)
          </button>
          <Link
            href="/login"
            className="w-full min-h-11 inline-flex items-center justify-center rounded-md bg-surface-2 text-ink border border-line font-semibold text-sm hover:bg-line"
          >
            Buka halaman login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role === 'seller' && user.status === 'approved') {
    return (
      <div className="max-w-md mx-auto my-12 text-center space-y-5 p-8 rounded-xl bg-surface border border-line">
        <div className="w-14 h-14 rounded-full bg-surface-2 text-ok flex items-center justify-center mx-auto border border-line">
          <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display uppercase text-3xl">Toko telah disetujui</h1>
          <p className="text-sm text-ink-2">
            Akun seller Anda ({user.name}) sudah aktif dan dapat mengelola produk.
          </p>
        </div>
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center justify-center min-h-11 px-6 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
        >
          Buka dashboard seller
        </Link>
      </div>
    );
  }

  if (user.role === 'seller' && user.status === 'rejected') {
    return (
      <div className="max-w-lg mx-auto my-12 text-center space-y-6 p-8 rounded-xl bg-surface border border-accent">
        <div className="w-14 h-14 rounded-full bg-surface-2 text-accent flex items-center justify-center mx-auto border border-line">
          <XCircle className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded bg-surface-2 text-accent border border-line text-xs font-semibold">
            Status: Ditolak (Rejected)
          </span>
          <h1 className="font-display uppercase text-3xl">
            Pengajuan toko ditolak
          </h1>
          <p className="text-sm text-ink-2 max-w-sm mx-auto leading-relaxed">
            Pengajuan toko untuk akun <strong>{user.name}</strong> belum memenuhi kriteria verifikasi admin.
          </p>
        </div>

        {errorMsg && (
          <div role="alert" className="flex items-center gap-2 p-2.5 rounded-md bg-surface-2 border border-accent text-accent text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-4 rounded-lg bg-canvas border border-line text-left text-xs space-y-3">
          <p className="text-ink-2">
            Anda dapat menghapus akun toko yang ditolak ini dan mengajukan pendaftaran baru kembali.
          </p>
          <button
            type="button"
            onClick={handleDeleteRejectedAccount}
            disabled={deleting}
            className="w-full min-h-11 px-4 rounded-md bg-accent text-canvas font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-85 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            {deleting ? 'Menghapus akun...' : 'Hapus akun saya (Delete Account)'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-12 text-center space-y-6 p-8 rounded-xl bg-surface border border-line">
      <div className="w-14 h-14 rounded-full bg-surface-2 text-warn flex items-center justify-center mx-auto border border-line">
        <Clock className="w-7 h-7" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded bg-surface-2 text-warn border border-line text-xs font-semibold">
          Status: Menunggu Verifikasi
        </span>
        <h1 className="font-display uppercase text-3xl">
          Akun Anda sedang ditinjau
        </h1>
        <p className="text-sm text-ink-2 max-w-sm mx-auto leading-relaxed">
          Pengajuan toko untuk <strong>{user.name}</strong> sedang diperiksa oleh Admin STRIDE. Anda dapat mengelola produk setelah toko disetujui.
        </p>
      </div>

      <div className="p-4 rounded-lg bg-canvas border border-line text-left text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-ink-2">Email seller</span>
          <span className="text-ink font-medium">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-2">Status toko</span>
          <span className="text-warn font-semibold">Pending Approval</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-surface-2 border border-line text-left text-xs space-y-2">
        <p className="text-ink-2 font-semibold text-center">
          Pintasan pengujian praktikum
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { switchAccount('admin'); router.push('/admin/dashboard'); }}
            className="min-h-11 px-3 rounded-md bg-surface border border-line hover:bg-canvas text-ink font-semibold text-center"
          >
            Buka panel Admin (untuk Approve)
          </button>
          <button
            type="button"
            onClick={() => { switchAccount('seller'); router.push('/seller/dashboard'); }}
            className="min-h-11 px-3 rounded-md bg-surface border border-line hover:bg-canvas text-ink font-semibold text-center"
          >
            Masuk Seller Approved
          </button>
        </div>
      </div>
    </div>
  );
}
