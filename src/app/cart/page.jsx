'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
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
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#151A23] border border-[#262E3D]">
        <div className="w-12 h-12 rounded-full bg-[#262E3D] flex items-center justify-center mx-auto text-[#00F0FF]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Anda Belum Masuk Akun</h2>
        <p className="text-xs text-gray-400">
          Silakan masuk atau gunakan akun pengujian Buyer untuk melihat dan memproses keranjang belanja.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => switchAccount('buyer')}
            className="w-full py-2.5 rounded-xl bg-[#00F0FF] text-black font-bold text-xs hover:bg-[#00F0FF]/90 transition-all"
          >
            Masuk Cepat sebagai Buyer (Dylan)
          </button>
          <Link
            href="/login"
            className="w-full py-2.5 rounded-xl bg-[#0B0E14] text-gray-300 border border-[#262E3D] font-bold text-xs hover:text-white transition-all"
          >
            Halaman Login / Register
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'buyer') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#151A23] border border-[#262E3D]">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Akses Keranjang Khusus Buyer</h2>
        <p className="text-xs text-gray-400">
          Anda saat ini masuk sebagai <strong>{user.role.toUpperCase()}</strong> ({user.name}). Untuk melakukan pembelian, beralihlah ke akun Buyer.
        </p>
        <button
          onClick={() => switchAccount('buyer')}
          className="w-full py-2.5 rounded-xl bg-[#00F0FF] text-black font-bold text-xs hover:bg-[#00F0FF]/90 transition-all"
        >
          Beralih ke Akun Buyer (Dylan)
        </button>
      </div>
    );
  }

  if (successOrder) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-6 p-8 rounded-2xl bg-[#151A23] border border-[#00F0FF]/40 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">Pesanan Berhasil Dibuat!</h2>
          <p className="text-xs text-gray-400 font-mono">
            Nomor Pesanan: <strong className="text-[#00F0FF]">{successOrder.order_number}</strong>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B0E14] border border-[#262E3D] text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Status Pesanan:</span>
            <span className="font-bold text-amber-400">{successOrder.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Pembayaran:</span>
            <span className="font-bold text-[#00F0FF]">{formatIDR(successOrder.total_amount)}</span>
          </div>
          <div className="pt-2 border-t border-[#262E3D] text-gray-400">
            Alamat Pengiriman: <br />
            <span className="text-gray-200">{shippingAddress}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href="/orders"
            className="flex-1 py-3 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs hover:bg-[#00F0FF]/90 transition-colors"
          >
            Lihat Riwayat & Lacak Pesanan →
          </Link>
          <Link
            href="/katalog"
            className="px-4 py-3 rounded-xl bg-[#0B0E14] text-gray-300 border border-[#262E3D] text-xs font-bold hover:text-white"
          >
            Belanja Lagi
          </Link>
        </div>
      </div>
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
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#151A23] border border-[#262E3D]">
        <div className="w-14 h-14 rounded-full bg-[#0B0E14] border border-[#262E3D] text-gray-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Keranjang Belanja Kosong</h2>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Belum ada item gear atau jersey yang Anda tambahkan ke keranjang.
        </p>
        <div className="pt-2">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00F0FF] text-black font-bold text-xs hover:bg-[#00F0FF]/90 transition-all"
          >
            Jelajahi Katalog Turnamen <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#262E3D] pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#00F0FF]" />
            Keranjang Belanja ({cart.totalItems} Item)
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Periksa item pilihan Anda sebelum menyelesaikan checkout.
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
        
        {/* Kolom Kiri: Daftar Item Keranjang (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.cart_item_id}
              className="p-4 rounded-xl bg-[#151A23] border border-[#262E3D] flex gap-4 items-center"
            >
              {/* Gambar Item */}
              <Link
                href={`/produk/${item.product_slug}`}
                className="w-20 h-20 rounded-lg bg-[#0B0E14] border border-[#262E3D] overflow-hidden flex-shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Rincian Item */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[10px] text-gray-400 font-mono truncate">
                  Toko: {item.store_name}
                </p>
                <Link href={`/produk/${item.product_slug}`}>
                  <h3 className="text-sm font-bold text-white hover:text-[#00F0FF] truncate">
                    {item.product_name}
                  </h3>
                </Link>
                <p className="text-xs font-mono font-bold text-[#00F0FF]">
                  {formatIDR(item.product_price)}
                </p>
              </div>

              {/* Kontrol Kuantitas & Subtotal */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5 bg-[#0B0E14] border border-[#262E3D] rounded-lg p-1">
                  <button
                    onClick={() => updateQty(item.cart_item_id, item.quantity - 1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-mono font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.cart_item_id, item.quantity + 1)}
                    disabled={item.quantity >= item.product_stock}
                    className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-extrabold text-white">
                    {formatIDR(item.subtotal)}
                  </span>
                  <button
                    onClick={() => removeItem(item.cart_item_id)}
                    className="text-gray-500 hover:text-rose-400 transition-colors"
                    title="Hapus barang"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kolom Kanan: Form Alamat & Checkout Box (5/12) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleCheckout}
            className="p-6 rounded-2xl bg-[#121722] border border-[#20293A] space-y-6 sticky top-24"
          >
            <h2 className="text-base font-bold text-white border-b border-[#20293A] pb-3 uppercase tracking-wider font-mono">
              Ringkasan & Pengiriman
            </h2>

            {/* Input Alamat Pengiriman */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF1E27]" /> Alamat Pengiriman Lengkap *
              </label>
              <textarea
                required
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap rumah, nomor jalan, kota, dan kode pos..."
                className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
              />
            </div>

            {/* Catatan Tambahan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Catatan Pesanan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Packing ekstra jersey BTR / titip di pos"
                className="w-full p-2 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
              />
            </div>

            {/* Kalkulasi Ringkasan */}
            <div className="space-y-2 pt-4 border-t border-[#20293A] text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({cart.totalItems} barang)</span>
                <span className="font-mono text-gray-200">{formatIDR(cart.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Ongkos Kirim Standar Turnamen</span>
                <span className="font-mono text-emerald-400 font-bold">GRATIS</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#20293A]">
                <span>Total Tagihan</span>
                <span className="text-[#FF1E27] font-mono font-black text-base">
                  {formatIDR(cart.totalAmount)}
                </span>
              </div>
            </div>

            {/* Error Banner jika ada */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Tombol Checkout */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#FF1E27] text-white font-black uppercase tracking-wider text-xs hover:bg-[#FFD000] hover:text-black transition-all shadow-lg shadow-[#FF1E27]/25 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Memproses Pesanan...' : 'Konfirmasi Checkout & Buat Pesanan'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transaksi atomik PostgreSQL (Langsung tercatat di database).</span>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
