'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check, AlertCircle, Plus, Minus, MapPin, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

function getProductOptions(product) {
  const catSlug = (product.category_slug || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (name.includes('ok-1') || name.includes('liberty walk')) {
    return {
      variants: ['OK-1', 'OK-1 Pro Tournament', 'OK-1 Wireless Edition'],
      colors: [
        { name: 'White Edition', hex: '#FFFFFF', border: '#D1D5DB' },
        { name: 'Stealth Black', hex: '#111827', border: '#374151' },
      ],
    };
  }

  if (catSlug.includes('keyboard') || name.includes('keyboard')) {
    return {
      variants: ['Linear Red Switch', 'Tactile Brown Switch', 'Clicky Blue Switch'],
      colors: [
        { name: 'White Edition', hex: '#FFFFFF', border: '#D1D5DB' },
        { name: 'Stealth Black', hex: '#111827', border: '#374151' },
        { name: 'Cyber Red', hex: '#FF1E27', border: '#FF1E27' },
      ],
    };
  }

  if (catSlug.includes('mouse') || name.includes('mouse')) {
    return {
      variants: ['Wireless 8KHz Ultra', 'Wired 1KHz Pro'],
      colors: [
        { name: 'White Frost', hex: '#FFFFFF', border: '#D1D5DB' },
        { name: 'Matte Black', hex: '#111827', border: '#374151' },
        { name: 'Robot Red', hex: '#FF1E27', border: '#FF1E27' },
      ],
    };
  }

  if (catSlug.includes('apparel') || catSlug.includes('jersey') || name.includes('jersey')) {
    return {
      variants: ['Size M', 'Size L', 'Size XL', 'Size XXL'],
      colors: [
        { name: 'Home Red (BTR)', hex: '#FF1E27', border: '#FF1E27' },
        { name: 'Away Black', hex: '#111827', border: '#374151' },
        { name: 'Hornet Gold', hex: '#FFD000', border: '#FFD000' },
      ],
    };
  }

  if (catSlug.includes('headset') || catSlug.includes('audio') || name.includes('headset') || name.includes('iem')) {
    return {
      variants: ['Wireless 2.4GHz + BT', 'Wired Hi-Res 3.5mm'],
      colors: [
        { name: 'Stealth Black', hex: '#111827', border: '#374151' },
        { name: 'Crimson Red', hex: '#FF1E27', border: '#FF1E27' },
      ],
    };
  }

  return {
    variants: ['Standard Tournament Kit', 'Special Pro Edition'],
    colors: [
      { name: 'Stealth Black', hex: '#111827', border: '#374151' },
      { name: 'Tournament White', hex: '#FFFFFF', border: '#D1D5DB' },
      { name: 'Robot Red', hex: '#FF1E27', border: '#FF1E27' },
    ],
  };
}

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
  const [showFullDesc, setShowFullDesc] = useState(false);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const originalPrice = Math.round(Number(product.price) * 1.25);

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }

    if (user.role !== 'buyer') {
      setErrorMsg('Hanya akun Buyer yang dapat membeli produk. Silakan beralih ke akun Buyer.');
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
          selectedColor: selectedColor.name,
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

  return (
    <div className="space-y-6">
      
      {/* Box Harga Sesuai Referensi Gaming Shop */}
      <div className="p-4 rounded-2xl bg-[#121722] border border-[#20293A] space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-black text-[#FF1E27] tracking-tight font-mono">
            {formatIDR(product.price)}
          </span>
          <span className="text-sm font-mono text-gray-500 line-through">
            {formatIDR(originalPrice)}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#FF1E27]/15 border border-[#FF1E27]/30 text-[10px] font-mono font-bold text-[#FF1E27]">
            HEMAT 20%
          </span>
        </div>
        <p className="text-[10px] text-gray-400 font-mono">
          Official Tournament Price • Pajak & Proteksi Gear Termasuk
        </p>
      </div>

      {/* Deskripsi Ringkas Produk dengan See More Toggle */}
      <div className="space-y-1.5 text-xs text-gray-300 leading-relaxed border-t border-[#20293A] pt-4">
        <p className={showFullDesc ? 'whitespace-pre-line text-gray-300' : 'line-clamp-2 text-gray-400'}>
          {product.description}
        </p>
        {product.description && product.description.length > 120 && (
          <button
            type="button"
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="text-xs text-[#FF1E27] hover:text-[#FFD000] font-bold font-mono inline-flex items-center gap-1 transition-colors"
          >
            {showFullDesc ? (
              <>
                <span>See less</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>See more</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#20293A]" />

      {/* Selected Variant Section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-400 font-mono">Selected Variant :</span>
          <strong className="text-white font-bold">{selectedVariant}</strong>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.variants.map((variant) => {
            const isSelected = selectedVariant === variant;
            return (
              <button
                key={variant}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-[#FF1E27]/15 border-[#FF1E27] text-white font-bold shadow-sm shadow-[#FF1E27]/20 scale-[1.02]'
                    : 'bg-[#0A0D14] border-[#20293A] text-gray-300 hover:border-gray-500 hover:text-white'
                }`}
              >
                {variant}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Color Section */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-400 font-mono">Selected Color :</span>
          <strong className="text-white font-bold">{selectedColor.name}</strong>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.colors.map((color) => {
            const isSelected = selectedColor.name === color.name;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#FF1E27]/15 border-[#FF1E27] text-white font-bold shadow-sm shadow-[#FF1E27]/20 scale-[1.02]'
                    : 'bg-[#0A0D14] border-[#20293A] text-gray-300 hover:border-gray-500 hover:text-white'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border flex-shrink-0"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: color.border || '#4B5563',
                  }}
                />
                <span>{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Information Sesuai Referensi Gaming Shop */}
      <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#20293A] space-y-1.5 text-xs">
        <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold">
          Stock Information
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-gray-300">
            <MapPin className="w-3.5 h-3.5 text-[#FF1E27] flex-shrink-0" />
            <span>Selected Branch : <strong className="text-[#FF1E27]">GOODGAMINGSHOP MANGGA DUA</strong></span>
          </div>
          <span className="text-emerald-400 font-bold">
            {product.stock > 0 ? `Ready Stock: ${product.stock} pcs` : 'Stok Kosong'}
          </span>
        </div>
      </div>

      {/* Quantity Selector & Add to Cart Card */}
      <div className="p-5 rounded-2xl bg-[#121722] border border-[#20293A] space-y-4">
        
        {/* Kuantitas Selector */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-300">Jumlah Beli:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1 || product.stock < 1}
              className="w-8 h-8 rounded-lg bg-[#0A0D14] border border-[#20293A] text-gray-300 hover:text-white hover:border-[#FF1E27] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono font-bold text-white text-sm">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={quantity >= product.stock || product.stock < 1}
              className="w-8 h-8 rounded-lg bg-[#0A0D14] border border-[#20293A] text-gray-300 hover:text-white hover:border-[#FF1E27] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Kalkulasi Subtotal */}
        <div className="flex items-baseline justify-between pt-2 border-t border-[#20293A] text-xs">
          <span className="text-gray-400">Subtotal Belanja:</span>
          <span className="font-black text-[#FF1E27] font-mono text-base">
            {formatIDR(subtotal)}
          </span>
        </div>

        {/* Alert Error */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tombol Aksi Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || product.stock < 1}
          className={`w-full py-3.5 px-4 rounded-xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
            success
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : product.stock < 1
              ? 'bg-[#182030] text-gray-500 cursor-not-allowed shadow-none border border-[#20293A]'
              : 'bg-[#FF1E27] text-white hover:bg-[#FFD000] hover:text-black shadow-[#FF1E27]/25 hover:scale-[1.02]'
          }`}
        >
          {success ? (
            <>
              <Check className="w-4 h-4" /> Berhasil Ditambahkan ke Keranjang
            </>
          ) : product.stock < 1 ? (
            'Stok Produk Habis'
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              {user ? 'Tambah ke Keranjang Belanja' : 'Masuk untuk Membeli'}
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center font-mono">
          {user?.role === 'buyer'
            ? '✓ Varian & Warna tersimpan otomatis ke keranjang belanja.'
            : 'Catatan: Anda sedang dalam mode Public User (Guest).'}
        </p>
      </div>

    </div>
  );
}
