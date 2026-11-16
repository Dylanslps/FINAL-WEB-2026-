'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, CheckCircle2, AlertCircle, Truck } from 'lucide-react';

const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

export default function OrdersPage() {
  const { user, switchAccount } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadOrders = useCallback(async () => {
    if (!user || user.role !== 'buyer') {
      setLoading(false);
      return;
    }

    try {
      setLoadError('');
      const res = await fetch(`/api/orders?buyerId=${user.id}`);
      if (!res.ok) throw new Error('Gagal memuat riwayat pesanan dari server.');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setLoadError(err.message || 'Gagal memuat riwayat pesanan.');
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 border border-line text-warn text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Menunggu Pembayaran
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 border border-line text-ink text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" aria-hidden="true" /> Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 border border-line text-ok text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Selesai
          </span>
        );
      case 'Dibatalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 border border-line text-accent text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" /> Dibatalkan
          </span>
        );
      default:
        return <span className="text-xs text-ink-2">{status}</span>;
    }
  };

  if (!user || user.role !== 'buyer') {
    return (
      <div className="max-w-md mx-auto my-12 text-center space-y-4 p-8 rounded-xl bg-surface border border-line">
        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mx-auto text-ink">
          <Package className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="font-display uppercase text-2xl">Khusus akun Buyer</h1>
        <p className="text-sm text-ink-2">
          Masuk sebagai Buyer untuk melihat riwayat transaksi dan melacak status pengiriman.
        </p>
        <button
          type="button"
          onClick={() => switchAccount('buyer')}
          className="w-full min-h-11 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
        >
          Masuk cepat sebagai Buyer (Dylan)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="border-b border-line pb-4">
        <h1 className="font-display uppercase text-3xl sm:text-4xl">
          Riwayat & Pelacakan Pesanan
        </h1>
        <p className="text-sm text-ink-2 mt-1">
          Pantau status pesanan Anda dan berikan ulasan produk setelah pesanan berstatus Selesai.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-ink-2">
          Memuat riwayat pesanan Anda...
        </div>
      ) : loadError ? (
        <div className="max-w-md mx-auto p-6 rounded-xl bg-surface border border-accent text-center space-y-3">
          <p className="font-semibold text-sm text-accent">{loadError}</p>
          <p className="text-xs text-ink-2">Periksa koneksi server lalu coba muat ulang.</p>
          <button
            type="button"
            onClick={loadOrders}
            className="min-h-11 px-5 rounded-md bg-ink text-canvas text-xs font-semibold"
          >
            Muat ulang
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-xl bg-surface border border-line p-8 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mx-auto text-ink-2">
            <Package className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-semibold text-base">Belum ada pesanan</h2>
          <p className="text-sm text-ink-2">
            Anda belum pernah melakukan checkout. Pilih produk di katalog untuk membuat pesanan pertama.
          </p>
          <Link
            href="/katalog"
            className="inline-flex items-center justify-center min-h-11 px-6 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
          >
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="p-5 rounded-xl bg-surface border border-line space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-sm">{order.order_number}</span>
                  <time className="text-xs text-ink-2">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {order.thumbnail_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={order.thumbnail_image}
                      alt={order.product_names?.[0] || 'Produk pesanan'}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-lg object-contain bg-surface-2 border border-line p-1 flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold line-clamp-1 max-w-md">
                      {order.product_names ? order.product_names.join(', ') : 'Rincian Barang'}
                    </p>
                    <p className="text-xs text-ink-2 mt-0.5">
                      Total {order.total_items} unit
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-line pt-3 sm:pt-0">
                  <div className="text-right">
                    <p className="text-xs text-ink-2">Total belanja</p>
                    <p className="text-sm font-bold tabular-nums">
                      {formatIDR(order.total_amount)}
                    </p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="min-h-11 px-4 inline-flex items-center rounded-md bg-ink text-canvas font-semibold text-xs hover:opacity-85"
                  >
                    Rincian & lacak
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
