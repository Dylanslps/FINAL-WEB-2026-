import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/products';
import { getProductReviews, getProductRatingSummary } from '@/lib/reviews';
import AddToCartSection from '@/components/AddToCartSection';
import { Star, Store, ShieldCheck, ArrowLeft, Truck, Package, RotateCcw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [ratingSummary, reviews] = await Promise.all([
    getProductRatingSummary(product.id),
    getProductReviews(product.id),
  ]);

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
        <Link href="/" className="hover:text-[#00F0FF] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Beranda
        </Link>
        <span>/</span>
        <Link href="/katalog" className="hover:text-[#00F0FF] transition-colors">
          Katalog
        </Link>
        <span>/</span>
        <Link href={`/katalog?kategori=${product.category_slug}`} className="hover:text-[#00F0FF] transition-colors">
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
                BTR OFFICIAL DROP
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
              <p className="text-[11px] font-mono">Garansi BTR</p>
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

            {/* Rating Ringkas (Rekomendasi Baymard: di dekat judul produk) */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-extrabold text-white">
                  {ratingSummary.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                • {ratingSummary.totalReviews} Ulasan Pembeli
              </span>
              <span className="text-xs text-emerald-400 font-mono">
                • {product.stock > 0 ? `Tersedia ${product.stock} Unit` : 'Stok Habis'}
              </span>
            </div>
          </div>

          {/* Harga Utama */}
          <div className="p-4 rounded-2xl bg-[#121722] border border-[#20293A] flex items-baseline justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-mono">Harga Resmi Official Store</p>
              <p className="text-3xl font-black text-[#FF1E27] tracking-tight mt-0.5 font-mono">
                {formatIDR(product.price)}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Produk Original
              </span>
            </div>
          </div>

          {/* Deskripsi Produk */}
          <div className="space-y-2 text-xs text-gray-300 leading-relaxed border-t border-[#20293A] pt-4">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Deskripsi & Spesifikasi Turnamen:</h3>
            <p className="whitespace-pre-line text-gray-400">{product.description}</p>
          </div>

          {/* Kartu Profil Toko Penjual */}
          <div className="p-4 rounded-2xl bg-[#121722] border border-[#20293A] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A0D14] border border-[#20293A] text-[#FFD000] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-mono">Official Merchant Partner:</p>
                <h4 className="font-bold text-white text-sm">{product.store_name}</h4>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#FFD000]/15 text-[#FFD000] border border-[#FFD000]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              Verified Seller
            </span>
          </div>

          {/* Komponen Add to Cart Interaktif */}
          <AddToCartSection product={product} />

        </div>
      </div>

      {/* Bagian Ulasan Pembeli (Penerapan Riset UX Baymard & Smashing Magazine) */}
      <section className="space-y-8 pt-8 border-t border-[#262E3D]">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] items-center">
          
          {/* Skor Rata-Rata */}
          <div className="text-center md:border-r border-[#262E3D] md:pr-6 space-y-2">
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

          {/* Grafik Batang Distribusi Bintang (Baymard & Smashing Magazine Pattern) */}
          <div className="md:col-span-2 space-y-2">
            {ratingSummary.distribution.map((item) => (
              <div key={item.star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-gray-300 font-mono flex items-center gap-1 justify-end">
                  {item.star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
                
                {/* Bar Progres */}
                <div className="flex-1 h-2 rounded-full bg-[#0B0E14] overflow-hidden border border-[#262E3D]">
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
            <div className="p-8 rounded-xl bg-[#151A23]/50 border border-[#262E3D] text-center text-gray-400 text-sm">
              Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan setelah pesanan Anda selesai!
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#151A23] border border-[#262E3D] space-y-2">
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

    </div>
  );
}
