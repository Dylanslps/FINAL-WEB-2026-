'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Store, ShoppingBag, Check, AlertCircle, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const SHOE_SIZES = [
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
      isShoe: true,
      variantLabel: 'Pilihan Ukuran',
      variants: SHOE_SIZES.map((s) => s.label),
      shoeSizes: SHOE_SIZES,
      colors: ['Sesuai Foto'],
      colorImages: {
        'Sesuai Foto': '/hero/lv-af1.png?v=lv1',
      },
      colorNames: {
        'Sesuai Foto': 'Royal Gray LV Air Force 1',
      },
    };
  }

  // Khusus Chrome Hearts Air Force 1: pilihan warna Blue dan Pink
  if (prodSlug.includes('puma-future-rider-trainers') || prodName.includes('chrome hearts')) {
    return {
      isShoe: true,
      variantLabel: 'Pilihan Ukuran',
      variants: SHOE_SIZES.map((s) => s.label),
      shoeSizes: SHOE_SIZES,
      colors: ['Blue', 'Pink'],
      colorImages: {
        'Blue': '/hero/chromehearts.png?v=ch1',
        'Pink': '/hero/chromehearts-pink.png?v=pink1',
      },
      colorNames: {
        'Blue': 'Blue Chrome Hearts Air Force 1',
        'Pink': 'Pink Chrome Hearts Air Force 1',
      },
    };
  }

  // Khusus Nike Air Force 1 '07: pilihan warna Putih dan Hitam saja
  if (prodSlug.includes('sports-sneakers-off-white-red') || prodName.includes('air force 1')) {
    return {
      isShoe: true,
      variantLabel: 'Pilihan Ukuran',
      variants: SHOE_SIZES.map((s) => s.label),
      shoeSizes: SHOE_SIZES,
      colors: ['Putih', 'Hitam'],
      colorImages: {
        'Putih': '/hero/airforcewhite.png?v=af1w1',
        'Hitam': '/hero/airforceblack.png?v=af1b1',
      },
      colorNames: {
        'Putih': "Nike Air Force 1 '07",
        'Hitam': "Nike Air Force 1 '07 Black",
      },
    };
  }

  if (catSlug.includes('sepatu') || catSlug.includes('custom')) {
    return {
      isShoe: true,
      variantLabel: 'Pilihan Ukuran',
      variants: SHOE_SIZES.map((s) => s.label),
      shoeSizes: SHOE_SIZES,
      colors: ['Sesuai Foto'],
      colorImages: {},
    };
  }

  if (catSlug.includes('pakaian')) {
    return {
      variantLabel: 'Ukuran Pakaian',
      variants: ['S', 'M', 'L', 'XL'],
      colors: ['Sesuai Foto'],
      colorImages: {},
    };
  }

  return {
    variantLabel: 'Ukuran / Varian',
    variants: ['All Size / Standar'],
    colors: ['Sesuai Foto'],
    colorImages: {},
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

export default function ProductHeroSection({ product, ratingSummary }) {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  const options = getProductOptions(product);
  const [sizeStandard, setSizeStandard] = useState('EU'); // 'EU' | 'ASIA'
  const [selectedVariant, setSelectedVariant] = useState(options.variants[0]);
  const [selectedColor, setSelectedColor] = useState(options.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imgFading, setImgFading] = useState(false);

  // Nama produk dinamis berdasarkan varian warna yang dipilih
  const currentTitle =
    (options.colorNames && options.colorNames[selectedColor]) ||
    product.name;

  // Gambar aktif berdasarkan varian warna yang dipilih
  const activeImage =
    (options.colorImages && options.colorImages[selectedColor]) ||
    product.image_url;

  const handleColorChange = (color) => {
    if (color === selectedColor) return;
    setImgFading(true);
    setTimeout(() => {
      setSelectedColor(color);
      setImgFading(false);
    }, 120);
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Kolom Kiri: Galeri Gambar Interaktif */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative aspect-square w-full rounded-xl bg-surface-2 border border-line overflow-hidden flex items-center justify-center p-8 transition-colors">
          {/* Badge Varian Warna Aktif */}
          {options.colors.length > 1 && (
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 border border-line text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
              <span
                className={`w-2.5 h-2.5 rounded-full border border-line/60 ${
                  selectedColor.toLowerCase() === 'hitam'
                    ? 'bg-black'
                    : selectedColor.toLowerCase() === 'blue'
                    ? 'bg-[#89a2b8]'
                    : selectedColor.toLowerCase() === 'pink'
                    ? 'bg-[#f4a7bb]'
                    : 'bg-white'
                }`}
                aria-hidden="true"
              />
              <span>Warna: {selectedColor}</span>
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={`${currentTitle} - ${selectedColor}`}
            width={800}
            height={800}
            fetchPriority="high"
            className={`w-full h-full object-contain select-none transition-all duration-200 ease-out ${
              imgFading ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
            }`}
          />
        </div>

        {/* Thumbnail switcher jika ada varian warna spesifik dengan gambar berbeda */}
        {options.colorImages && Object.keys(options.colorImages).length > 1 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-2 font-medium">Varian:</span>
            {options.colors.map((color) => {
              const isSelected = selectedColor === color;
              const thumbImg = options.colorImages[color] || product.image_url;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  aria-pressed={isSelected}
                  className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-surface border-ink shadow-sm ring-1 ring-ink'
                      : 'bg-surface-2 border-line hover:border-ink-2 text-ink-2 hover:text-ink'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbImg}
                    alt={color}
                    width={40}
                    height={40}
                    className="w-7 h-7 object-contain"
                  />
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Kolom Kanan: Detail & Form Pembelian */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-2">
            {product.brand || product.category_name} · {product.category_name}
          </p>

          <h1 className="font-display uppercase text-3xl sm:text-4xl leading-tight">
            {currentTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="inline-flex items-center gap-1 text-ink">
              <Star className="w-4 h-4 fill-current" aria-hidden="true" />
              <span className="font-semibold">{ratingSummary.averageRating.toFixed(1)}</span>
              <span className="text-ink-2">({ratingSummary.totalReviews} ulasan)</span>
            </div>
            <span className="text-ink-2">·</span>
            <span className={`font-semibold ${product.stock > 0 ? 'text-ok' : 'text-accent'}`}>
              {product.stock > 0 ? `Stok tersedia: ${product.stock} unit` : 'Stok habis'}
            </span>
          </div>
        </div>

        {/* Info Toko Seller */}
        <div className="p-4 rounded-xl bg-surface border border-line flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-surface-2 border border-line flex items-center justify-center">
              <Store className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-ink-2">Dijual oleh</p>
              <p className="font-semibold text-sm">{product.store_name}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-surface-2 text-ink text-xs font-medium border border-line">
            Seller Terverifikasi
          </span>
        </div>

        {/* Harga & Deskripsi */}
        <div className="space-y-2 border-y border-line py-4">
          <p className="text-3xl font-bold tabular-nums">{formatIDR(product.price)}</p>
          {product.description && (
            <p className="text-sm text-ink-2 leading-relaxed">{product.description}</p>
          )}
        </div>

        {/* Pilihan Ukuran (Eropa & Asia) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-ink-2">Ukuran:</span>
              <strong className="text-ink font-semibold">{selectedVariant}</strong>
            </div>

            {/* Switcher Standar Ukuran Eropa (EU) vs Asia (CM) */}
            {options.isShoe && (
              <div
                role="group"
                aria-label="Pilih standar ukuran sepatu"
                className="inline-flex items-center rounded-lg border border-line bg-surface-2 p-0.5 text-[11px]"
              >
                <button
                  type="button"
                  onClick={() => setSizeStandard('EU')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    sizeStandard === 'EU'
                      ? 'bg-ink text-canvas font-semibold shadow-sm'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  Eropa (EU)
                </button>
                <button
                  type="button"
                  onClick={() => setSizeStandard('ASIA')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    sizeStandard === 'ASIA'
                      ? 'bg-ink text-canvas font-semibold shadow-sm'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  Asia (CM)
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {options.isShoe
              ? options.shoeSizes.map((size) => {
                  const isSelected = selectedVariant.includes(size.eu);
                  return (
                    <button
                      key={size.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedVariant(size.label)}
                      className={`min-h-12 px-2.5 py-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-ink text-canvas border-ink shadow-sm'
                          : 'bg-surface text-ink border-line hover:bg-surface-2'
                      }`}
                    >
                      <span className="font-bold text-xs leading-tight">
                        {sizeStandard === 'ASIA' ? size.asia : size.eu}
                      </span>
                      <span
                        className={`text-[10px] leading-tight ${
                          isSelected ? 'text-canvas/75' : 'text-ink-2'
                        }`}
                      >
                        {sizeStandard === 'ASIA' ? size.eu : size.asia}
                      </span>
                    </button>
                  );
                })
              : options.variants.map((variant) => {
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
              <span className="text-ink-2">Pilihan Warna</span>
              <strong className="text-ink">{selectedColor}</strong>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {options.colors.map((color) => {
                const isSelected = selectedColor === color;
                const isBlack = color.toLowerCase() === 'hitam';
                const isWhite = color.toLowerCase() === 'putih';
                const isBlue = color.toLowerCase() === 'blue';
                const isPink = color.toLowerCase() === 'pink';

                return (
                  <button
                    key={color}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleColorChange(color)}
                    className={`min-h-11 px-5 rounded-md text-xs font-semibold border inline-flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-ink text-canvas border-ink shadow-sm'
                        : 'bg-surface text-ink border-line hover:bg-surface-2'
                    }`}
                  >
                    {(isBlack || isWhite || isBlue || isPink) && (
                      <span
                        className={`w-3.5 h-3.5 rounded-full border ${
                          isBlack
                            ? 'bg-black border-line/60'
                            : isWhite
                            ? 'bg-white border-line/60'
                            : isBlue
                            ? 'bg-[#89a2b8] border-line/60'
                            : 'bg-[#f4a7bb] border-line/60'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <span>{color}</span>
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
    </div>
  );
}
