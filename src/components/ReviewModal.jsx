'use client';

import { useEffect, useState } from 'react';
import { Star, X, AlertCircle } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, orderId, product, buyerId, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Tuliskan ulasan singkat mengenai produk yang Anda terima.');
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

      if (onReviewSuccess) onReviewSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60"
    >
      <div className="w-full max-w-md p-6 rounded-xl bg-surface border border-line shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h3 id="review-modal-title" className="font-semibold text-base">Beri Ulasan Produk</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog ulasan"
            className="w-9 h-9 rounded-md flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-2 border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.product_image}
            alt={product.product_name}
            width={48}
            height={48}
            className="w-12 h-12 object-contain rounded-md bg-surface flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-xs truncate">{product.product_name}</p>
            <p className="text-xs text-ink-2">Toko: {product.store_name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-center">
            <span className="text-xs font-medium text-ink-2 block">Pilih jumlah bintang</span>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Beri ${star} bintang`}
                  aria-pressed={rating === star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="w-11 h-11 flex items-center justify-center rounded-md hover:bg-surface-2"
                >
                  <Star
                    aria-hidden="true"
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating) ? 'fill-current text-ink' : 'text-line'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold">
              {rating} dari 5 bintang
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="review-comment" className="text-xs font-medium text-ink block">
              Komentar ulasan
            </label>
            <textarea
              id="review-comment"
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan kecocokan ukuran, kualitas bahan, dan pengemasan..."
              className="w-full p-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
            />
          </div>

          {errorMsg && (
            <div role="alert" className="flex items-center gap-2 p-2.5 rounded-md bg-surface-2 border border-accent text-accent text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-11 rounded-md bg-surface-2 text-ink border border-line font-semibold text-xs hover:bg-line"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 min-h-11 rounded-md bg-ink text-canvas font-semibold text-xs hover:opacity-85 disabled:opacity-50"
            >
              {submitting ? 'Mengirim...' : 'Kirim ulasan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
