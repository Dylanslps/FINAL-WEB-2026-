'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check, AlertCircle, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const SHOE_SIZES = [
  { id: '39', eu: 'EU 39', asia: 'Asia 24.5 cm', label: 'EU 39 · Asia 24.5 cm' },
  { id: '40', eu: 'EU 40', asia: 'Asia 25.0 cm', label: 'EU 40 · Asia 25.0 cm' },
  { id: '41', eu: 'EU 41', asia: 'Asia 26.0 cm', label: 'EU 41 · Asia 26.0 cm' },
  { id: '42', eu: 'EU 42', asia: 'Asia 26.5 cm', label: 'EU 42 · Asia 26.5 cm' },
  { id: '43', eu: 'EU 43', asia: 'Asia 27.5 cm', label: 'EU 43 · Asia 27.5 cm' },
  { id: '44', eu: 'EU 44', asia: 'Asia 28.0 cm', label: 'EU 44 · Asia 28.0 cm' },
];

function getProductOptions(product) {
  const catSlug = (product.category_slug || '').toLowerCase();
  const prodSlug = (product.slug || '').toLowerCase();
  const prodName = (product.name || '').toLowerCase();

  // Khusus Royal Gray LV Air Force 1: satu warna sesuai foto
  if (prodSlug.includes('nike-air-jordan-1-red-and-black') || prodName.includes('lv air force 1')) {
    return {
      variantLabel: 'Pilihan Ukuran (Eropa & Asia)',
      variants: SHOE_SIZES.map((s) => s.label),
      colors: ['Sesuai Foto'],
    };
  }

  // Khusus Chrome Hearts Air Force 1: pilihan warna Blue dan Pink
  if (prodSlug.includes('puma-future-rider-trainers') || prodName.includes('chrome hearts')) {
    return {
      variantLabel: 'Pilihan Ukuran (Eropa & Asia)',
      variants: SHOE_SIZES.map((s) => s.label),
      colors: ['Blue', 'Pink'],
    };
  }

  // Khusus Nike Air Force 1 '07: pilihan warna Putih dan Hitam saja
  if (prodSlug.includes('sports-sneakers-off-white-red') || prodName.includes('air force 1')) {
    return {
      variantLabel: 'Pilihan Ukuran (Eropa & Asia)',
      variants: SHOE_SIZES.map((s) => s.label),
      colors: ['Putih', 'Hitam'],
    };
  }

  if (catSlug.includes('sepatu') || catSlug.includes('custom')) {
    return {
      variantLabel: 'Pilihan Ukuran (Eropa & Asia)',
      variants: SHOE_SIZES.map((s) => s.label),
      colors: ['Sesuai Foto'],
    };
  }

  if (catSlug.includes('pakaian')) {
    return {
      variantLabel: 'Ukuran Pakaian',
      variants: ['S', 'M', 'L', 'XL'],
      colors: ['Sesuai Foto'],
    };
  }

  return {
    variantLabel: 'Ukuran / Varian',
    variants: ['All Size / Standar'],
    colors: ['Sesuai Foto'],
  };
}

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

export default function AddToCartSection({ product }) {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  const options = getProductOptions(product);
  const [selectedVariant, setSelectedVariant] = useState(options.variants[0]);
  const [selectedColor, setSelectedColor] = useState(options.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const increment = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }

    if (user.role !== 'buyer') {
      setErrorMsg('Hanya akun Buyer yang dapat membeli produk. Silakan beralih ke akun Buyer di menu atas.');
      setTimeout(() => setErrorMsg(''), 4000);
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
          quantity,
          selectedVariant,
          selectedColor,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan ke keranjang');
      }

      setSuccess(true);
      await refreshCart();
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setAdding(false);
    }
  };

  const subtotal = product.price * quantity;
  const outOfStock = product.stock < 1;

  return (
    <div className="space-y-6">
      <div className="space-y-2 border-y border-line py-4">
        <p className="text-3xl font-bold tabular-nums">{formatIDR(product.price)}</p>
        {product.description && (
          <p className="text-sm text-ink-2 leading-relaxed">{product.description}</p>
        )}
      </div>

      {/* Pilihan Ukuran / Varian */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-2">{options.variantLabel}</span>
          <strong className="text-ink">{selectedVariant}</strong>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.variants.map((variant) => {
            const isSelected = selectedVariant === variant;
            return (
              <button
                key={variant}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedVariant(variant)}
                className={`min-h-11 px-4 rounded-md text-xs font-semibold border transition-colors ${
                  isSelected
                    ? 'bg-ink text-canvas border-ink'
                    : 'bg-surface text-ink border-line hover:bg-surface-2'
                }`}
              >
                {variant}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pilihan Warna */}
      {options.colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-2">Warna</span>
            <strong className="text-ink">{selectedColor}</strong>
          </div>
          <div className="flex flex-wrap gap-2">
            {options.colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedColor(color)}
                  className={`min-h-11 px-4 rounded-md text-xs font-semibold border transition-colors ${
                    isSelected
                      ? 'bg-ink text-canvas border-ink'
                      : 'bg-surface text-ink border-line hover:bg-surface-2'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Kuantitas & Tombol Tambah ke Keranjang */}
      <div className="p-5 rounded-xl bg-surface border border-line space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Jumlah</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1 || outOfStock}
              aria-label="Kurangi jumlah"
              className="w-11 h-11 rounded-md bg-canvas border border-line flex items-center justify-center hover:bg-surface-2 disabled:opacity-40"
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="w-10 text-center font-semibold text-sm tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={increment}
              disabled={quantity >= product.stock || outOfStock}
              aria-label="Tambah jumlah"
              className="w-11 h-11 rounded-md bg-canvas border border-line flex items-center justify-center hover:bg-surface-2 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-3 border-t border-line text-sm">
          <span className="text-ink-2">Subtotal</span>
          <span className="font-bold text-lg tabular-nums">{formatIDR(subtotal)}</span>
        </div>

        {errorMsg && (
          <div role="alert" className="flex items-center gap-2 p-3 rounded-md bg-surface-2 border border-accent text-accent text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || outOfStock}
          className={`w-full min-h-12 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
            success
              ? 'bg-ok text-canvas'
              : outOfStock
              ? 'bg-surface-2 text-ink-2 border border-line'
              : 'bg-ink text-canvas hover:opacity-85'
          }`}
        >
          {success ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" /> Ditambahkan ke keranjang
            </>
          ) : outOfStock ? (
            'Stok produk habis'
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {user ? 'Tambah ke keranjang' : 'Masuk untuk membeli'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
