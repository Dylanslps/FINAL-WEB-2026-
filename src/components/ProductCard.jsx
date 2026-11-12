'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Store, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }

    if (user.role !== 'buyer') {
      setErrorMsg('Hanya akun Buyer yang dapat membeli barang.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setAdding(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user.id,
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan ke keranjang');
      }

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

  return (
    <div className="group flex flex-col bg-[#151A23] border border-[#262E3D] hover:border-[#00F0FF]/50 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00F0FF]/5">
      
      {/* Gambar Produk */}
      <Link href={`/produk/${product.slug}`} className="relative aspect-square w-full bg-[#0B0E14] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Featured Badge */}
        {product.is_featured && (
          <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-[#FF5E00] text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
            Featured Drop
          </span>
        )}

        {/* Kategori Badge */}
        {product.category_name && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0B0E14]/80 backdrop-blur-sm text-gray-300 text-[10px] font-mono border border-[#262E3D]">
            {product.category_name}
          </span>
        )}
      </Link>

      {/* Konten Card */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Info Toko */}
          {product.store_name && (
            <p className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono truncate mb-1">
              <Store className="w-3 h-3 text-[#00F0FF]" />
              <span className="truncate">{product.store_name}</span>
            </p>
          )}

          {/* Judul Produk */}
          <Link href={`/produk/${product.slug}`}>
            <h3 className="font-bold text-sm text-white group-hover:text-[#00F0FF] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating Bintang */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-gray-200">
              {Number(product.rating_avg || 0).toFixed(1)}
            </span>
            <span className="text-[11px] text-gray-400">
              ({product.rating_count || 0})
            </span>
          </div>
        </div>

        {/* Harga, Stok, dan Tombol Beli */}
        <div className="pt-2 border-t border-[#262E3D]/70 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-mono">Harga</p>
              <p className="font-extrabold text-base text-[#00F0FF] tracking-tight">
                {formatIDR(product.price)}
              </p>
            </div>
            <span className={`text-[10px] font-mono ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
            </span>
          </div>

          {/* Alert Error jika ada */}
          {errorMsg && (
            <div className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{errorMsg}</span>
            </div>
          )}

          {/* Tombol Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock < 1}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              success
                ? 'bg-emerald-500 text-white'
                : product.stock < 1
                ? 'bg-[#262E3D] text-gray-500 cursor-not-allowed'
                : 'bg-[#00F0FF]/10 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black border border-[#00F0FF]/30 hover:border-[#00F0FF]'
            }`}
          >
            {success ? (
              <>
                <Check className="w-3.5 h-3.5" /> Masuk Keranjang
              </>
            ) : product.stock < 1 ? (
              'Stok Habis'
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                {user?.role === 'buyer' ? 'Beli Sekarang' : 'Tambah ke Keranjang'}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
