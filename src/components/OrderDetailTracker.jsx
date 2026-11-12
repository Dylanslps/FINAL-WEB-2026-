'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ReviewModal from '@/components/ReviewModal';
import { Clock, Truck, CheckCircle2, AlertCircle, MapPin, Store, Star, ArrowLeft } from 'lucide-react';

export default function OrderDetailTracker({ order }) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const openReview = (item) => {
    setSelectedProduct(item);
    setIsReviewOpen(true);
  };

  const steps = [
    { title: 'Menunggu Pembayaran', icon: Clock, desc: 'Pesanan dibuat, menunggu konfirmasi seller' },
    { title: 'Diproses', icon: Truck, desc: 'Seller sedang mempacking gear & kirim paket' },
    { title: 'Selesai', icon: CheckCircle2, desc: 'Pesanan diterima dengan baik oleh pembeli' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.title === order.status);
  const isCanceled = order.status === 'Dibatalkan';

  return (
    <div className="space-y-8 py-4">
      
      {/* Back button */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00F0FF] transition-colors font-mono"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Riwayat Pesanan
      </Link>

      {/* Header Detail */}
      <div className="p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#00F0FF]">RINCIAN & PELACAKAN PESANAN</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 font-mono">
            {order.order_number}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Dibuat pada {new Date(order.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-mono">Total Tagihan:</p>
          <p className="text-2xl font-black text-[#00F0FF] font-mono">
            {formatIDR(order.total_amount)}
          </p>
        </div>
      </div>

      {/* Stepper Timeline Pelacakan (Baymard UX Order Tracking) */}
      <div className="p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] space-y-6">
        <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          Timeline Pelacakan Status:
        </h2>

        {isCanceled ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Pesanan ini telah dibatalkan.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPastOrCurrent = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.title}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-lg shadow-[#00F0FF]/10'
                      : isPastOrCurrent
                      ? 'bg-[#151A23] border-emerald-500/40 text-emerald-400'
                      : 'bg-[#0B0E14] border-[#262E3D] opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCurrent
                          ? 'bg-[#00F0FF] text-black font-bold'
                          : isPastOrCurrent
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[#262E3D] text-gray-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold font-mono text-white">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rincian Produk & Tombol Ulasan */}
      <div className="p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] space-y-6">
        <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          Barang yang Dipesan ({order.items.length}):
        </h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.order_item_id}
              className="p-4 rounded-xl bg-[#0B0E14] border border-[#262E3D] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#262E3D] flex-shrink-0"
                />
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                    <Store className="w-3 h-3 text-[#00F0FF]" /> {item.store_name}
                  </p>
                  <Link
                    href={`/produk/${item.product_slug}`}
                    className="font-bold text-sm text-white hover:text-[#00F0FF] transition-colors block"
                  >
                    {item.product_name}
                  </Link>
                  <p className="text-xs text-gray-400 font-mono">
                    {item.quantity} x {formatIDR(item.price)}
                  </p>
                </div>
              </div>

              {/* Subtotal & Status Ulasan */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-mono">Subtotal</p>
                  <p className="text-sm font-extrabold text-[#00F0FF] font-mono">
                    {formatIDR(item.subtotal)}
                  </p>
                </div>

                {/* Tombol Ulasan Sesuai Spesifikasi: HANYA jika status = 'Selesai' */}
                {order.status === 'Selesai' ? (
                  item.review_id ? (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Rating: {item.review_rating}/5 (Sudah Diulas)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => openReview(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#FF5E00] hover:bg-[#FF5E00]/90 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all hover:scale-105"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" /> Beri Ulasan Bintang
                    </button>
                  )
                ) : (
                  <span className="text-[11px] text-gray-500 font-mono italic">
                    Ulasan aktif saat pesanan Selesai
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Pengiriman */}
      <div className="p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] space-y-3">
        <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#00F0FF]" /> Alamat Tujuan Pengiriman:
        </h2>
        <div className="p-4 rounded-xl bg-[#0B0E14] border border-[#262E3D] text-xs text-gray-300 leading-relaxed">
          <p className="font-bold text-white mb-1">{order.buyer_name} ({order.buyer_email})</p>
          <p>{order.shipping_address}</p>
          {order.notes && (
            <p className="mt-2 text-gray-400 italic">Catatan Pembeli: &quot;{order.notes}&quot;</p>
          )}
        </div>
      </div>

      {/* Modal Review */}
      {selectedProduct && (
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          orderId={order.id}
          product={selectedProduct}
          buyerId={user?.id || order.buyer_id}
          onReviewSuccess={() => router.refresh()}
        />
      )}

    </div>
  );
}
