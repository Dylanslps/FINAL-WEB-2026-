'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import CartItemList from '@/components/cart/CartItemList';
import CartSummary from '@/components/cart/CartSummary';
import CartOrderSuccess from '@/components/cart/CartOrderSuccess';

export default function CartPage() {
  const { user, switchAccount } = useAuth();
  const { refreshCart } = useCart();

  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const loadCart = useCallback(async () => {
    if (!user || user.role !== 'buyer') {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/cart?buyerId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch {
      // silent fallback
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQty = async (cartItemId, newQty) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItemId,
          buyerId: user.id,
          quantity: newQty,
        }),
      });
      if (res.ok) {
        await loadCart();
        await refreshCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const res = await fetch(`/api/cart?cartItemId=${cartItemId}&buyerId=${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadCart();
        await refreshCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch(`/api/cart?action=clear&buyerId=${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadCart();
        await refreshCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setErrorMsg('Alamat pengiriman wajib diisi untuk memproses pesanan.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user.id,
          shippingAddress: shippingAddress.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses checkout.');
      }

      setSuccessOrder(data.order);
      await refreshCart();
      await loadCart();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#121722] border border-[#20293A]">
        <div className="w-12 h-12 rounded-full bg-[#1A2232] flex items-center justify-center mx-auto text-[#FF1E27]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white font-sans">Anda Belum Masuk Akun</h2>
        <p className="text-xs text-gray-400">
          Silakan masuk atau gunakan akun pengujian Buyer untuk melihat dan memproses keranjang belanja.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => switchAccount('buyer')}
            className="w-full py-2.5 rounded-xl bg-[#FF1E27] text-white font-black text-xs hover:bg-[#FFD000] hover:text-black transition-all uppercase tracking-wider"
          >
            Masuk Cepat sebagai Buyer (Dylan)
          </button>
          <Link
            href="/login"
            className="w-full py-2.5 rounded-xl bg-[#0A0D14] text-gray-300 border border-[#20293A] font-bold text-xs hover:text-white transition-all uppercase tracking-wider"
          >
            Halaman Login / Register
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'buyer') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#121722] border border-[#20293A]">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white font-sans">Akses Keranjang Khusus Buyer</h2>
        <p className="text-xs text-gray-400">
          Anda saat ini masuk sebagai <strong>{user.role.toUpperCase()}</strong> ({user.name}). Untuk melakukan pembelian, beralihlah ke akun Buyer.
        </p>
        <button
          onClick={() => switchAccount('buyer')}
          className="w-full py-2.5 rounded-xl bg-[#FF1E27] text-white font-black text-xs hover:bg-[#FFD000] hover:text-black transition-all uppercase tracking-wider"
        >
          Beralih ke Akun Buyer (Dylan)
        </button>
      </div>
    );
  }

  if (successOrder) {
    return (
      <CartOrderSuccess
        order={successOrder}
        shippingAddress={shippingAddress}
        formatIDR={formatIDR}
      />
    );
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-gray-400 font-mono animate-pulse">
        Memuat keranjang belanja...
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#121722] border border-[#20293A]">
        <div className="w-14 h-14 rounded-full bg-[#0A0D14] border border-[#20293A] text-gray-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white font-sans">Keranjang Belanja Kosong</h2>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Belum ada item gear atau jersey yang Anda tambahkan ke keranjang.
        </p>
        <div className="pt-2">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF1E27] text-white font-black text-xs hover:bg-[#FFD000] hover:text-black transition-all uppercase tracking-wider shadow-md shadow-[#FF1E27]/20"
          >
            Jelajahi Katalog Turnamen <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between border-b border-[#20293A] pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5 font-sans">
            <ShoppingBag className="w-6 h-6 text-[#FF1E27]" />
            Keranjang Belanja ({cart.totalItems} Item)
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Periksa item pilihan Anda sebelum menyelesaikan checkout turnamen.
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-mono"
        >
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <CartItemList
            items={cart.items}
            updateQty={updateQty}
            removeItem={removeItem}
            formatIDR={formatIDR}
          />
        </div>

        <div className="lg:col-span-5">
          <CartSummary
            totalItems={cart.totalItems}
            totalAmount={cart.totalAmount}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            notes={notes}
            setNotes={setNotes}
            onSubmit={handleCheckout}
            submitting={submitting}
            errorMsg={errorMsg}
            formatIDR={formatIDR}
          />
        </div>
      </div>
    </div>
  );
}
