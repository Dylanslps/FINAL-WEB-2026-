'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const formatIDR = (num) => {
  const n = Number(num);
  const hasCents = n % 1 !== 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(n);
};

export default function ProductCard({ product }) {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }
    if (user.role !== 'buyer') {
      setErrorMsg('Hanya akun Buyer yang bisa membeli.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setAdding(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: user.id, productId: product.id, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menambahkan ke keranjang');
      setSuccess(true);
      await refreshCart();
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(''), 3500);
    } finally {
      setAdding(false);
    }
  };

  const outOfStock = product.stock < 1;

  return (
    <article className="group flex flex-col">
      <Link
        href={`/produk/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden rounded-xl bg-surface-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url}
          alt={product.name}
          width={600}
          height={600}
          loading="lazy"
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
        />
        {outOfStock && (
          <span className="absolute top-3 left-3 rounded-md bg-ink text-canvas px-2 py-1 text-xs font-semibold">
            Stok habis
          </span>
        )}
      </Link>

      <div className="flex-1 flex flex-col gap-1 pt-3">
        <p className="text-xs text-ink-2 truncate">
          {product.brand || product.category_name}
          {product.store_name ? ` · ${product.store_name}` : ''}
        </p>
        <Link href={`/produk/${product.slug}`} className="hover:underline underline-offset-4">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-ink-2">
          <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
          <span className="font-medium text-ink">{Number(product.rating_avg || 0).toFixed(1)}</span>
          <span>({product.rating_count || 0} ulasan)</span>
        </div>
        <p className="font-semibold tabular-nums mt-1 mb-3">{formatIDR(product.price)}</p>

        {errorMsg && (
          <p role="alert" className="text-xs text-accent mb-2">{errorMsg}</p>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || outOfStock}
          className={`mt-auto min-h-11 rounded-md text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
            success
              ? 'bg-ok text-canvas border-ok'
              : outOfStock
              ? 'border-line text-ink-2 opacity-60'
              : 'border-ink bg-transparent hover:bg-ink hover:text-canvas'
          }`}
        >
          {success ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" /> Masuk keranjang
            </>
          ) : outOfStock ? (
            'Stok habis'
          ) : adding ? (
            'Menambahkan...'
          ) : (
            'Tambah ke keranjang'
          )}
        </button>
      </div>
    </article>
  );
}
