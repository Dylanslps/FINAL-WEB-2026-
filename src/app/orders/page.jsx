'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, CheckCircle2, AlertCircle, ArrowRight, Truck } from 'lucide-react';

export default function OrdersPage() {
  const { user, switchAccount } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const loadOrders = useCallback(async () => {
    if (!user || user.role !== 'buyer') {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/orders?buyerId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // silent fallback
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Clock className="w-3 h-3" /> Menunggu Pembayaran
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFD000]/10 border border-[#FFD000]/30 text-[#FFD000] text-xs font-mono font-bold">
            <Truck className="w-3 h-3" /> Sedang Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle2 className="w-3 h-3" /> Pesanan Selesai
          </span>
        );
      case 'Dibatalkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
            <AlertCircle className="w-3 h-3" /> Dibatalkan
          </span>
        );
      default:
        return <span className="text-xs text-gray-400">{status}</span>;
    }
  };

  if (!user || user.role !== 'buyer') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#121722] border border-[#20293A]">
        <div className="w-12 h-12 rounded-full bg-[#1A2232] flex items-center justify-center mx-auto text-[#FF1E27]">
          <Package className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Riwayat Pesanan Khusus Buyer</h2>
        <p className="text-xs text-gray-400">
          Silakan masuk sebagai Buyer untuk melihat seluruh riwayat dan melacak pesanan Anda.
        </p>
        <button
          onClick={() => switchAccount('buyer')}
          className="w-full py-2.5 rounded-xl bg-[#FF1E27] text-white font-bold text-xs hover:bg-[#FFD000] hover:text-black transition-all"
        >
          Masuk Cepat sebagai Buyer (Dylan)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="border-b border-[#20293A] pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Package className="w-6 h-6 text-[#FF1E27]" />
          Riwayat & Pelacakan Pesanan
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Pantau status pesanan, alamat pengiriman, dan berikan ulasan bintang setelah pesanan selesai.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400 font-mono animate-pulse">
          Memuat riwayat transaksi...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-2xl bg-[#121722] border border-[#20293A] p-8 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#0A0D14] border border-[#20293A] flex items-center justify-center mx-auto text-gray-500">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Belum Ada Riwayat Pesanan</h3>
          <p className="text-xs text-gray-400">
            Anda belum pernah melakukan pemesanan gear esports di toko ini.
          </p>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF1E27] text-white font-bold text-xs hover:bg-[#FFD000] hover:text-black transition-all"
          >
            Mulai Belanja <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-[#121722] border border-[#20293A] hover:border-[#FF1E27]/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#20293A] pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-[#FF1E27]">
                    {order.order_number}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Rincian Produk Singkat */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {order.thumbnail_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={order.thumbnail_image}
                      alt="Thumbnail Pesanan"
                      className="w-14 h-14 rounded-lg object-cover bg-[#0A0D14] border border-[#20293A] flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-white truncate max-w-md">
                      {order.product_names ? order.product_names.join(', ') : 'Rincian Barang'}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      Total: {order.total_items} Barang
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-[#20293A] pt-3 sm:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-mono">Total Belanja</p>
                    <p className="text-sm font-extrabold text-[#FF1E27] font-mono">
                      {formatIDR(order.total_amount)}
                    </p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#182030] hover:bg-[#FF1E27] text-white font-bold text-xs transition-colors border border-[#20293A]"
                  >
                    Lacak & Rincian <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
