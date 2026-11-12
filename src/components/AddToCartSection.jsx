'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check, AlertCircle, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function AddToCartSection({ product }) {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }

    if (user.role !== 'buyer') {
      setErrorMsg('Hanya akun Buyer yang dapat membeli produk.');
      setTimeout(() => setErrorMsg(''), 3500);
      return;
    }

    setAdding(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user.id,
          productId: product.id,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan ke keranjang');
      }

      setSuccess(true);
      await refreshCart();
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setAdding(false);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div className="p-5 rounded-xl bg-[#151A23] border border-[#262E3D] space-y-4">
      {/* Kuantitas Selector */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-300">Jumlah Beli:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1 || product.stock < 1}
            className="w-8 h-8 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-gray-300 hover:text-white hover:border-[#00F0FF] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono font-bold text-white text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increment}
            disabled={quantity >= product.stock || product.stock < 1}
            className="w-8 h-8 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-gray-300 hover:text-white hover:border-[#00F0FF] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Kalkulasi Subtotal */}
      <div className="flex items-baseline justify-between pt-2 border-t border-[#262E3D]/60 text-xs">
        <span className="text-gray-400">Subtotal Belanja:</span>
        <span className="font-extrabold text-[#00F0FF] font-mono text-base">
          {formatIDR(subtotal)}
        </span>
      </div>

      {/* Alert Error */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tombol Aksi */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={adding || product.stock < 1}
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
          success
            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
            : product.stock < 1
            ? 'bg-[#262E3D] text-gray-500 cursor-not-allowed shadow-none'
            : 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 shadow-[#00F0FF]/20 hover:scale-[1.02]'
        }`}
      >
        {success ? (
          <>
            <Check className="w-4 h-4" /> Berhasil Ditambahkan ke Keranjang
          </>
        ) : product.stock < 1 ? (
          'Stok Produk Habis'
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            {user ? 'Tambah ke Keranjang Belanja' : 'Masuk untuk Membeli'}
          </>
        )}
      </button>

      <p className="text-[11px] text-gray-400 text-center">
        {user?.role === 'buyer'
          ? '✓ Pengiriman cepat standar turnamen.'
          : 'Catatan: Anda sedang dalam mode penjelajahan.'}
      </p>
    </div>
  );
}
