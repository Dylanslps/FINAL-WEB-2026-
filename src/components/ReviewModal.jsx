'use client';

import { useState } from 'react';
import { Star, X, Check, AlertCircle } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, orderId, product, buyerId, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Tuliskan beberapa patah kata ulasan Anda mengenai produk ini.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          productId: product.product_id,
          buyerId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim ulasan');
      }

      onReviewSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-[#262E3D] pb-3">
          <h3 className="font-bold text-white text-base">Beri Ulasan Produk</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Produk Singkat */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0E14] border border-[#262E3D]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.product_image}
            alt={product.product_name}
            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-white truncate">{product.product_name}</h4>
            <p className="text-[10px] text-gray-400 font-mono">Toko: {product.store_name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Rating Bintang Selector */}
          <div className="space-y-2 text-center">
            <label className="text-xs font-semibold text-gray-300">Pilih Jumlah Bintang:</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-mono font-bold text-amber-400">
              {rating === 5 && 'Luar Biasa (5/5)'}
              {rating === 4 && 'Sangat Bagus (4/5)'}
              {rating === 3 && 'Cukup Baik (3/5)'}
              {rating === 2 && 'Kurang Memuaskan (2/5)'}
              {rating === 1 && 'Mengecewakan (1/5)'}
            </p>
          </div>

          {/* Input Komentar */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Komentar & Pengalaman Penggunaan:</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan performa gear ini saat turnamen atau bermain game..."
              className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#0B0E14] text-gray-300 border border-[#262E3D] font-bold text-xs hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs hover:bg-[#00F0FF]/90 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
