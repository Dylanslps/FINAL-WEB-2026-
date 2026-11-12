'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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
      setErrorMsg('Email dan password wajib diisi.');
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
        throw new Error(data.error || 'Login gagal.');
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

  const fillAndLogin = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] flex items-center justify-center mx-auto shadow-lg shadow-[#FF1E27]/15">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase font-mono">
          BTR <span className="text-[#FFD000]">VITALITY</span>
        </h1>
        <p className="text-xs text-gray-400">
          Masuk untuk akses transaksi official pro kit BTR, toko merchant, atau root admin.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="p-6 rounded-2xl bg-[#121722] border border-[#20293A] space-y-5">
        
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF1E27]" /> Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF1E27]" /> Kata Sandi (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#FF1E27] text-white font-black uppercase tracking-wider text-xs hover:bg-[#FFD000] hover:text-black transition-all shadow-lg shadow-[#FF1E27]/25 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-[#20293A] text-center text-xs text-gray-400">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#FFD000] hover:underline font-bold">
            Daftar Akun Baru
          </Link>
        </div>

      </div>

      {/* Kotak Akun Pengujian Demo (Fitur Khusus untuk Pengujian Aslab / Dosen) */}
      <div className="p-5 rounded-2xl bg-[#0B0E14] border border-[#262E3D] space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Akun Pengujian Demo (Klik untuk Isi):</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillAndLogin('buyer@gmail.com', 'buyer123')}
            className="p-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] hover:border-[#00F0FF] text-left transition-colors space-y-0.5"
          >
            <p className="font-bold text-white flex items-center gap-1">🛒 Buyer</p>
            <p className="text-[10px] text-gray-400 font-mono">buyer@gmail.com</p>
          </button>

          <button
            type="button"
            onClick={() => fillAndLogin('seller1@apexgear.com', 'seller123')}
            className="p-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] hover:border-[#FF5E00] text-left transition-colors space-y-0.5"
          >
            <p className="font-bold text-white flex items-center gap-1">🏪 Seller Approved</p>
            <p className="text-[10px] text-gray-400 font-mono">seller1@apexgear.com</p>
          </button>

          <button
            type="button"
            onClick={() => fillAndLogin('seller3@pending.com', 'seller123')}
            className="p-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] hover:border-amber-400 text-left transition-colors space-y-0.5"
          >
            <p className="font-bold text-white flex items-center gap-1">⏳ Seller Pending</p>
            <p className="text-[10px] text-gray-400 font-mono">seller3@pending.com</p>
          </button>

          <button
            type="button"
            onClick={() => fillAndLogin('admin@esports.com', 'admin123')}
            className="p-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] hover:border-purple-400 text-left transition-colors space-y-0.5"
          >
            <p className="font-bold text-white flex items-center gap-1">🛡️ Super Admin</p>
            <p className="text-[10px] text-gray-400 font-mono">admin@esports.com</p>
          </button>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-gray-500 font-mono text-sm">Loading login...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
