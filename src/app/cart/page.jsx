'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import CartItemList from '@/components/cart/CartItemList';
import CartSummary from '@/components/cart/CartSummary';
import CartOrderSuccess from '@/components/cart/CartOrderSuccess';

const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

export default function CartPage() {
  const { user, switchAccount } = useAuth();
  const { refreshCart } = useCart();

  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  const loadCart = useCallback(async () => {
    if (!user || user.role !== 'buyer') {
      setLoading(false);
      return;
    }

    try {
      setLoadError('');
      const res = await fetch(`/api/cart?buyerId=${user.id}`);
      if (!res.ok) throw new Error('Gagal memuat keranjang dari server.');
      const data = await res.json();
      setCart(data);
    } catch (err) {
      setLoadError(err.message || 'Gagal memuat keranjang.');
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
      <div className="max-w-md mx-auto my-12 text-center space-y-4 p-8 rounded-xl bg-surface border border-line">
        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mx-auto text-ink">
          <ShoppingBag className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="font-display uppercase text-2xl">Anda belum masuk</h1>
        <p className="text-sm text-ink-2">
          Masuk ke akun Buyer untuk melihat keranjang dan melanjutkan ke checkout.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => switchAccount('buyer')}
            className="w-full min-h-11 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
          >
            Masuk cepat sebagai Buyer (Dylan)
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

  if (user.role !== 'buyer') {
    return (
      <div className="max-w-md mx-auto my-12 text-center space-y-4 p-8 rounded-xl bg-surface border border-line">
        <div className="w-12 h-12 rounded-full bg-surface-2 text-warn flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="font-display uppercase text-2xl">Khusus akun Buyer</h1>
        <p className="text-sm text-ink-2">
          Anda sedang masuk sebagai <strong>{user.role}</strong> ({user.name}). Beralih ke akun Buyer untuk berbelanja.
        </p>
        <button
          type="button"
          onClick={() => switchAccount('buyer')}
          className="w-full min-h-11 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
        >
          Beralih ke akun Buyer (Dylan)
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
      <div className="py-24 text-center text-sm text-ink-2">
        Memuat daftar barang di keranjang belanja Anda...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-xl bg-surface border border-accent text-center space-y-3">
        <p className="font-semibold text-sm text-accent">{loadError}</p>
        <p className="text-xs text-ink-2">Pastikan koneksi database PostgreSQL aktif lalu muat ulang.</p>
        <button
          type="button"
          onClick={loadCart}
          className="min-h-11 px-5 rounded-md bg-ink text-canvas text-xs font-semibold"
        >
          Coba muat ulang
        </button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center space-y-4 p-8 rounded-xl bg-surface border border-line">
        <div className="w-12 h-12 rounded-full bg-surface-2 text-ink-2 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="font-display uppercase text-2xl">Keranjang masih kosong</h1>
        <p className="text-sm text-ink-2">
          Anda belum menambahkan sepatu atau pakaian ke keranjang belanja.
        </p>
        <div className="pt-2">
          <Link
            href="/katalog"
            className="inline-flex items-center justify-center min-h-11 px-6 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
          >
            Lihat katalog produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-display uppercase text-3xl sm:text-4xl">
            Keranjang Belanja ({cart.totalItems})
          </h1>
          <p className="text-sm text-ink-2 mt-1">
            Periksa ukuran dan jumlah barang sebelum menyelesaikan pesanan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearCart}
          className="min-h-11 px-3 text-xs font-semibold text-accent hover:underline"
        >
          Kosongkan keranjang
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
