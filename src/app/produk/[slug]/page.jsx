import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import { getProductReviews, getProductRatingSummary } from '@/lib/reviews';
import AddToCartSection from '@/components/AddToCartSection';
import { Star, Store, ArrowLeft, Truck, Package, RotateCcw } from 'lucide-react';

export const dynamic = 'force-dynamic';

function getProductSpecifications(product) {
  const catSlug = (product.category_slug || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (catSlug.includes('keyboard') || name.includes('keyboard') || name.includes('ok-1')) {
    return [
      { feature: 'Layout', detail: name.includes('68') ? '68% Ultra Compact' : '75% Tournament Compact' },
      { feature: 'Connection', detail: 'Tri-Mode (2.4GHz Wireless, Bluetooth 5.3, Type-C Wired)' },
      { feature: 'Knob', detail: 'CNC Aluminum Rotary Volume / Media Knob' },
      { feature: 'Screen', detail: name.includes('pro') ? '1.14" TFT OLED Smart Display' : 'None' },
      { feature: 'PCB', detail: '1.2mm Flex-Cut Hot-Swappable (3-Pin & 5-Pin Compatible)' },
      { feature: 'Switch Direction', detail: 'South Facing RGB LED (Cherry Profile Friendly)' },
      { feature: 'Hotswappable', detail: 'Yes (Universal Kailh Hot-Swap Sockets)' },
      { feature: 'Switch', detail: 'Akko Prism Magnetic / Factory Pre-Lubed Optical Linear' },
      { feature: 'Assembly', detail: 'Pre-Built Gasket Mounted with Poron Foam & IXPE Pad' },
      { feature: 'Polling Rate', detail: '1,000Hz Ultra-Low Latency (1ms Response)' },
      { feature: 'Battery', detail: '4,000mAh High Capacity Li-ion (Up to 200 Hrs)' },
    ];
  }

  if (catSlug.includes('mouse') || name.includes('mouse')) {
    return [
      { feature: 'Sensor', detail: 'PixArt PAW3395 High-Precision Optical Sensor' },
      { feature: 'DPI Range', detail: '50 – 26,000 DPI (Configurable in 50 DPI steps)' },
      { feature: 'Polling Rate', detail: '8,000Hz (8K Ultra Polling Rate / 0.125ms Delay)' },
      { feature: 'Connection', detail: 'Dual-Mode 2.4GHz Wireless & Paracord USB-C' },
      { feature: 'Switches', detail: 'Optical Micro Switches (Rated for 90 Million Clicks)' },
      { feature: 'Weight', detail: '49g Superlight Solid Chassis' },
      { feature: 'Skates / Feet', detail: '100% Virgin Grade PTFE Curved Glide Skates' },
      { feature: 'Battery Life', detail: 'Up to 80 Hours (1KHz) / 24 Hours (8KHz)' },
      { feature: 'Software', detail: 'VALIANT Cloud Web Driver with On-Board Memory' },
    ];
  }

  if (catSlug.includes('apparel') || catSlug.includes('jersey') || name.includes('jersey')) {
    return [
      { feature: 'Material', detail: 'Dry-Fit Aerocool Microfiber Polyester 100%' },
      { feature: 'Print Technology', detail: 'Full High-Definition Sublimation (Anti-Fade)' },
      { feature: 'Sleeve Construction', detail: 'Ergonomic Raglan Sleeve for Unrestricted Aim' },
      { feature: 'Ventilation', detail: 'Underarm Breathable Hex-Mesh Airflow Panels' },
      { feature: 'Fit Profile', detail: 'Athletic Tournament Pro Cut' },
      { feature: 'Collar Style', detail: 'Reinforced Ribbed V-Neck Esports Collar' },
      { feature: 'Authenticity Tag', detail: 'Official BTR x Vitality Tournament Tag with Hologram' },
      { feature: 'Care Instructions', detail: 'Machine Wash Cold, Hang Dry, Do Not Iron on Print' },
    ];
  }

  if (catSlug.includes('headset') || catSlug.includes('audio') || name.includes('headset') || name.includes('iem')) {
    return [
      { feature: 'Acoustic Driver', detail: '50mm Neodymium Dual-Chamber Hi-Res Drivers' },
      { feature: 'Frequency Range', detail: '12Hz – 28,000Hz (Hi-Res Audio Certified)' },
      { feature: 'Connection', detail: '2.4GHz Ultra-Low Latency + Bluetooth 5.3 + 3.5mm' },
      { feature: 'Microphone', detail: 'Detachable Broadcast-Grade 9.7mm Cardioid Mic' },
      { feature: 'Spatial Audio', detail: '7.1 Virtual Surround Sound Gaming Engine' },
      { feature: 'Ear Cushion', detail: 'Memory Foam with Cooling-Gel Layer & Protein Leather' },
      { feature: 'Battery Life', detail: 'Up to 60 Hours Playback Time' },
    ];
  }

  return [
    { feature: 'Material', detail: 'Esports Tournament Grade High-Density Compound' },
    { feature: 'Surface', detail: 'Precision Micro-Woven Texture for Speed & Control' },
    { feature: 'Base', detail: '4mm Anti-Slip Natural Rubber / Silicone Grip' },
    { feature: 'Stitching', detail: 'Ultra-Dense Flat Anti-Fray Edge Stitching' },
    { feature: 'Compatibility', detail: 'Optimized for All Low & High DPI Optical Sensors' },
    { feature: 'Certification', detail: 'Esports Arena Tournament Approved' },
  ];
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [ratingSummary, reviews, relatedProducts] = await Promise.all([
    getProductRatingSummary(product.id),
    getProductReviews(product.id),
    getRelatedProducts(product.id, product.category_id, 4),
  ]);

  const specs = getProductSpecifications(product);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-12 py-4">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 font-mono">
        <Link href="/" className="hover:text-[#FF1E27] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Beranda
        </Link>
        <span>/</span>
        <Link href="/katalog" className="hover:text-[#FF1E27] transition-colors">
          Katalog
        </Link>
        <span>/</span>
        <Link href={`/katalog?kategori=${product.category_slug}`} className="hover:text-[#FFD000] transition-colors">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-gray-200 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Gambar Produk & Info Pembelian */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Kiri: Gambar Produk (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-[#0A0D14] border border-[#20293A] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.is_featured && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-[#FF1E27] text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                TOURNAMENT DROP
              </span>
            )}
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#0A0D14]/90 backdrop-blur-md text-[10px] font-mono text-[#FFD000] border border-[#20293A]">
              Live API Internet
            </span>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
            <div className="p-3 rounded-xl bg-[#121722] border border-[#20293A]">
              <Truck className="w-4 h-4 mx-auto mb-1 text-[#FF1E27]" />
              <p className="text-[11px] font-mono">Kirim Cepat</p>
            </div>
            <div className="p-3 rounded-xl bg-[#121722] border border-[#20293A]">
              <Package className="w-4 h-4 mx-auto mb-1 text-[#FFD000]" />
              <p className="text-[11px] font-mono">Official Box</p>
            </div>
            <div className="p-3 rounded-xl bg-[#121722] border border-[#20293A]">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <p className="text-[11px] font-mono">Garansi Resmi</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Produk & Add to Cart (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF1E27]/15 border border-[#FF1E27]/40 text-[#FF1E27] text-xs font-mono font-bold">
                {product.category_name}
              </span>
              {product.brand && (
                <span className="text-xs text-gray-400 font-mono">
                  Brand: <strong className="text-gray-200">{product.brand}</strong>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight uppercase font-sans">
              {product.name}
            </h1>

            {/* Rating & Sold Counter Sesuai Good Gaming Shop (10 pcsSold • Brand) */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-extrabold text-white">
                  {ratingSummary.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400 font-mono">
                • {ratingSummary.totalReviews > 0 ? `${ratingSummary.totalReviews * 12 + 8} pcsSold` : '24 pcsSold'}
              </span>
              <span className="text-[#FFD000] font-mono font-bold">
                • {product.brand || 'VALIANT PRO'} ↗
              </span>
              <span className="text-emerald-400 font-mono ml-auto">
                {product.stock > 0 ? `Ready ${product.stock} Unit` : 'Stok Habis'}
              </span>
            </div>
          </div>

          {/* Kartu Profil Toko Penjual */}
          <div className="p-3.5 rounded-2xl bg-[#121722] border border-[#20293A] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0A0D14] border border-[#20293A] text-[#FFD000] flex items-center justify-center">
                <Store className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-mono">Official Merchant Partner:</p>
                <h4 className="font-bold text-white text-xs">{product.store_name}</h4>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#FFD000]/15 text-[#FFD000] border border-[#FFD000]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              Verified Seller
            </span>
          </div>

          {/* Komponen Add to Cart Interaktif (Harga, Varian, Warna, Stok & Action) */}
          <AddToCartSection product={product} />

        </div>
      </div>

      {/* Product Specification Section (Matching Good Gaming Shop Reference) */}
      <section className="space-y-4 pt-8 border-t border-[#20293A]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Product Specification
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Rincian teknis dan spesifikasi perangkat keras standar kompetisi.
          </p>
        </div>

        <div className="rounded-2xl bg-[#121722] border border-[#20293A] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#20293A] bg-[#0A0D14]/70 text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold w-1/3">Features</th>
                <th className="py-3 px-5 font-semibold w-2/3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20293A]/60">
              {specs.map((item, idx) => (
                <tr
                  key={item.feature}
                  className={`hover:bg-[#182030]/60 transition-colors ${
                    idx % 2 === 1 ? 'bg-[#0E131C]/40' : ''
                  }`}
                >
                  <td className="py-3 px-5 font-semibold text-gray-300">
                    {item.feature}
                  </td>
                  <td className="py-3 px-5 font-mono text-gray-200">
                    {item.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bagian Ulasan Pembeli (Penerapan Riset UX Baymard & Smashing Magazine) */}
      <section className="space-y-8 pt-8 border-t border-[#20293A]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Ulasan & Penilaian Pembeli
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Ulasan terverifikasi hanya dapat diberikan setelah pesanan berstatus Selesai.
          </p>
        </div>

        {/* Ringkasan Skor & Grafik Distribusi Rating 1-5 Bintang */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#121722] border border-[#20293A] items-center">
          
          {/* Skor Rata-Rata */}
          <div className="text-center md:border-r border-[#20293A] md:pr-6 space-y-2">
            <p className="text-5xl font-black text-white">
              {ratingSummary.averageRating.toFixed(1)}
            </p>
            <div className="flex justify-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(ratingSummary.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Berdasarkan {ratingSummary.totalReviews} ulasan
            </p>
          </div>

          {/* Grafik Batang Distribusi Bintang */}
          <div className="md:col-span-2 space-y-2">
            {ratingSummary.distribution.map((item) => (
              <div key={item.star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-gray-300 font-mono flex items-center gap-1 justify-end">
                  {item.star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
                
                {/* Bar Progres */}
                <div className="flex-1 h-2 rounded-full bg-[#0A0D14] overflow-hidden border border-[#20293A]">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="w-16 text-right font-mono text-gray-400 text-[11px]">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Daftar Komentar Review Pembeli */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm">
            Daftar Ulasan ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#121722]/60 border border-[#20293A] text-center text-gray-400 text-sm">
              Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan setelah pesanan Anda selesai!
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#121722] border border-[#20293A] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rev.buyer_name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                        Pembeli Terverifikasi
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {new Date(rev.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* OTHER RECOMMENDED Section (Matching Good Gaming Shop Reference) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-[#20293A]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase tracking-wider text-white font-sans">
              OTHER <span className="text-[#FF1E27]">RECOMMENDED</span>
            </h2>
            <Link
              href="/katalog"
              className="text-xs text-[#FFD000] hover:text-[#FF1E27] font-mono font-bold transition-colors"
            >
              Lihat Semua Gear →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => {
              const relOriginalPrice = Math.round(Number(rel.price) * 1.25);
              return (
                <Link
                  key={rel.id}
                  href={`/produk/${rel.slug}`}
                  className="group flex flex-col bg-[#121722] border border-[#20293A] hover:border-[#FF1E27]/60 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF1E27]/10"
                >
                  <div className="relative aspect-square w-full bg-[#0A0D14] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.image_url}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {rel.is_featured && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#FF1E27] text-white text-[9px] font-black uppercase tracking-wider shadow">
                        HOT
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    {/* Color Dots Indicator Sesuai Good Gaming Shop */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-black border border-gray-600" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] border border-[#FF1E27]" />
                      <span className="text-[10px] text-gray-500 font-mono ml-1">+1</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-xs line-clamp-1 group-hover:text-[#FF1E27] transition-colors">
                        {rel.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Brand: {rel.brand || 'VALIANT PRO'}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1 border-t border-[#20293A]/60">
                      <span className="font-black text-[#FF1E27] font-mono text-sm">
                        {formatIDR(rel.price)}
                      </span>
                      <span className="text-[11px] text-gray-500 font-mono line-through">
                        {formatIDR(relOriginalPrice)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
