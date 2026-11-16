'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal masuk.');
      }

      login(data.user);

      if (redirect === 'cart') {
        router.push('/cart');
      } else if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'seller') {
        if (data.user.status === 'approved') {
          router.push('/seller/dashboard');
        } else {
          router.push('/seller/pending');
        }
      } else {
        router.push('/katalog');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="font-display uppercase text-4xl">Masuk ke Stride</h1>
        <p className="text-sm text-ink-2">
          Masuk sebagai pembeli, pemilik toko, atau administrator.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-surface border border-line space-y-5">
        {errorMsg && (
          <div role="alert" className="flex items-center gap-2 p-3 rounded-md bg-surface-2 border border-accent text-accent text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-ink block">
              Alamat email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-ink block">
              Kata sandi
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-12 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Memeriksa kredensial...' : 'Masuk'}
          </button>
        </form>

        <div className="pt-3 border-t border-line text-center text-xs text-ink-2">
          Belum punya akun?{' '}
          <Link href="/register" className="text-ink underline underline-offset-4 font-semibold">
            Daftar akun baru
          </Link>
        </div>
      </div>

      {/* Akun pengujian */}
      <div className="p-5 rounded-xl bg-surface border border-line space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ink">Akun pengujian praktikum (klik untuk isi)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillCredentials('buyer@gmail.com', 'buyer123')}
            className="p-3 rounded-md bg-canvas border border-line hover:bg-surface-2 text-left space-y-0.5"
          >
            <span className="font-semibold text-ink block">Buyer</span>
            <span className="text-ink-2 block truncate">buyer@gmail.com</span>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials('seller1@stride.id', 'seller123')}
            className="p-3 rounded-md bg-canvas border border-line hover:bg-surface-2 text-left space-y-0.5"
          >
            <span className="font-semibold text-ink block">Seller</span>
            <span className="text-ink-2 block truncate">seller1@stride.id</span>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials('admin@stride.id', 'admin123')}
            className="p-3 rounded-md bg-canvas border border-line hover:bg-surface-2 text-left space-y-0.5"
          >
            <span className="font-semibold text-ink block">Admin</span>
            <span className="text-ink-2 block truncate">admin@stride.id</span>
          </button>
        </div>

        <div className="pt-2 text-center border-t border-line">
          <Link href="/" className="text-xs text-ink-2 hover:text-ink underline underline-offset-4">
            Lanjut menjelajah sebagai tamu tanpa masuk
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-ink-2">Memuat formulir masuk...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
