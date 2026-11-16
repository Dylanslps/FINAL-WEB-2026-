'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ReviewModal from '@/components/ReviewModal';
import { Clock, Truck, CheckCircle2, AlertCircle, MapPin, Store, Star, ArrowLeft } from 'lucide-react';

const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

export default function OrderDetailTracker({ order }) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const openReview = (item) => {
    setSelectedProduct(item);
    setIsReviewOpen(true);
  };

  const steps = [
    { title: 'Menunggu Pembayaran', icon: Clock, desc: 'Pesanan diterima dan menunggu diproses oleh penjual.' },
    { title: 'Diproses', icon: Truck, desc: 'Penjual sedang mengemas dan mengirimkan barang.' },
    { title: 'Selesai', icon: CheckCircle2, desc: 'Pesanan telah selesai dan diterima pembeli.' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.title === order.status);
  const isCanceled = order.status === 'Dibatalkan';

  return (
    <div className="space-y-8 py-4">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink py-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Kembali ke riwayat pesanan
      </Link>

      <div className="p-6 rounded-xl bg-surface border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-2">Rincian pesanan</p>
          <h1 className="font-display uppercase text-2xl sm:text-3xl mt-1">
            {order.order_number}
          </h1>
          <p className="text-xs text-ink-2 mt-1">
            Dibuat pada{' '}
            {new Date(order.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-xs text-ink-2">Total pembayaran</p>
          <p className="text-2xl font-bold tabular-nums">
            {formatIDR(order.total_amount)}
          </p>
        </div>
      </div>

      {/* Status pelacakan */}
      <div className="p-6 rounded-xl bg-surface border border-line space-y-4">
        <h2 className="font-semibold text-sm">Status Pengiriman</h2>

        {isCanceled ? (
          <div className="p-4 rounded-lg bg-surface-2 border border-accent text-accent text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span>Pesanan ini telah dibatalkan.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPastOrCurrent = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.title}
                  className={`p-4 rounded-lg border ${
                    isCurrent
                      ? 'bg-canvas border-ink'
                      : isPastOrCurrent
                      ? 'bg-canvas border-ok'
                      : 'bg-surface-2 border-line opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center ${
                        isCurrent
                          ? 'bg-ink text-canvas'
                          : isPastOrCurrent
                          ? 'bg-ok text-canvas'
                          : 'bg-surface text-ink-2 border border-line'
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold">{step.title}</span>
                  </div>
                  <p className="text-xs text-ink-2 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Daftar barang & tombol ulasan */}
      <div className="p-6 rounded-xl bg-surface border border-line space-y-4">
        <h2 className="font-semibold text-sm">
          Barang yang dipesan ({order.items.length})
        </h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.order_item_id}
              className="p-4 rounded-lg bg-canvas border border-line flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-md object-contain bg-surface-2 border border-line p-1 flex-shrink-0"
                />
                <div className="space-y-1">
                  <p className="text-xs text-ink-2 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5" aria-hidden="true" /> {item.store_name}
                  </p>
                  <Link
                    href={`/produk/${item.product_slug}`}
                    className="font-semibold text-sm hover:underline block"
                  >
                    {item.product_name}
                  </Link>

                  {(item.selected_variant || item.selected_color) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs text-ink-2">
                      {item.selected_variant && (
                        <span className="px-2 py-0.5 rounded bg-surface border border-line text-ink">
                          Ukuran: {item.selected_variant}
                        </span>
                      )}
                      {item.selected_color && (
                        <span className="px-2 py-0.5 rounded bg-surface border border-line text-ink">
                          Warna: {item.selected_color}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-ink-2 tabular-nums">
                    {item.quantity} x {formatIDR(item.price)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="sm:text-right">
                  <p className="text-xs text-ink-2">Subtotal</p>
                  <p className="text-sm font-bold tabular-nums">
                    {formatIDR(item.subtotal)}
                  </p>
                </div>

                {order.status === 'Selesai' ? (
                  item.review_id ? (
                    <div className="px-3 py-2 rounded-md bg-surface-2 border border-line text-ok text-xs font-medium flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                      <span>Dinilai {item.review_rating}/5</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openReview(item)}
                      className="min-h-11 px-4 rounded-md bg-ink text-canvas font-semibold text-xs flex items-center gap-1.5 hover:opacity-85"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" /> Beri ulasan
                    </button>
                  )
                ) : (
                  <span className="text-xs text-ink-2">
                    Ulasan dibuka saat status Selesai
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info pengiriman */}
      <div className="p-6 rounded-xl bg-surface border border-line space-y-3">
        <h2 className="font-semibold text-sm flex items-center gap-1.5">
          <MapPin className="w-4 h-4" aria-hidden="true" /> Alamat Pengiriman
        </h2>
        <div className="p-4 rounded-lg bg-canvas border border-line text-xs text-ink space-y-1">
          <p className="font-semibold">{order.buyer_name} ({order.buyer_email})</p>
          <p className="text-ink-2">{order.shipping_address}</p>
          {order.notes && (
            <p className="pt-1 text-ink-2">Catatan pembeli: &quot;{order.notes}&quot;</p>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          orderId={order.id}
          product={selectedProduct}
          buyerId={user?.id || order.buyer_id}
          onReviewSuccess={() => {
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
