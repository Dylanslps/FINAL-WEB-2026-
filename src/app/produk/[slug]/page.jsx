import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import { getProductReviews, getProductRatingSummary } from '@/lib/reviews';
import AddToCartSection from '@/components/AddToCartSection';
import ProductSpecsTable from '@/components/product/ProductSpecsTable';
import RecommendedProducts from '@/components/product/RecommendedProducts';
import { Star, Store, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

function getProductSpecifications(product) {
  const catSlug = (product.category_slug || '').toLowerCase();

  if (catSlug.includes('sepatu')) {
    return [
      { feature: 'Kategori', detail: product.category_name },
      { feature: 'Merek', detail: product.brand || 'Stride Studio' },
      { feature: 'Material Atas', detail: 'Kulit sintetis & mesh berpori' },
      { feature: 'Outsole', detail: 'Karet anti-selip (Rubber Cupsole)' },
      { feature: 'Rentang Ukuran', detail: 'EU 39, EU 40, EU 41, EU 42, EU 43, EU 44' },
      { feature: 'Toko Penjual', detail: product.store_name },
    ];
  }

  if (catSlug.includes('pakaian')) {
    return [
      { feature: 'Kategori', detail: product.category_name },
      { feature: 'Merek', detail: product.brand || 'Stride Studio' },
      { feature: 'Material Kain', detail: 'Katun tenun nyaman dipakai harian' },
      { feature: 'Potongan', detail: 'Regular Fit' },
      { feature: 'Pilihan Ukuran', detail: 'S, M, L, XL' },
      { feature: 'Perawatan', detail: 'Cuci suhu ruang, jangan gunakan pemutih' },
    ];
  }

  return [
    { feature: 'Kategori', detail: product.category_name },
    { feature: 'Merek', detail: product.brand || 'Stride Studio' },
    { feature: 'Toko Penjual', detail: product.store_name },
    { feature: 'Stok Tersedia', detail: `${product.stock} unit` },
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

  return (
    <div className="space-y-14 py-4">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink-2">
        <Link href="/" className="hover:text-ink inline-flex items-center gap-1 py-1">
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Beranda
        </Link>
        <span>/</span>
        <Link href="/katalog" className="hover:text-ink py-1">
          Katalog
        </Link>
        <span>/</span>
        <Link href={`/katalog?kategori=${product.category_slug}`} className="hover:text-ink py-1">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Galeri gambar produk */}
        <div className="lg:col-span-6">
          <div className="relative aspect-square w-full rounded-xl bg-surface-2 border border-line overflow-hidden flex items-center justify-center p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              width={800}
              height={800}
              fetchPriority="high"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Informasi produk & pembelian */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-2">
              {product.brand || product.category_name} · {product.category_name}
            </p>

            <h1 className="font-display uppercase text-3xl sm:text-4xl leading-tight">
              {product.name}
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

          <AddToCartSection product={product} />
        </div>
      </div>

      <ProductSpecsTable specs={specs} />

      {/* Ulasan & Distribusi Rating */}
      <section aria-labelledby="reviews-heading" className="space-y-6 pt-10 border-t border-line">
        <div>
          <h2 id="reviews-heading" className="font-display uppercase text-2xl sm:text-3xl">
            Ulasan Pembeli
          </h2>
          <p className="text-sm text-ink-2 mt-1">
            Ulasan hanya dapat dikirim oleh pembeli yang pesanannya telah berstatus Selesai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-surface border border-line">
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-line pb-6 md:pb-0 md:pr-6 text-center">
            <span className="font-display text-5xl tabular-nums">
              {ratingSummary.averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 my-2 text-ink" aria-label={`Rata-rata ${ratingSummary.averageRating.toFixed(1)} dari 5 bintang`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className={`w-4 h-4 ${
                    i < Math.round(ratingSummary.averageRating) ? 'fill-current text-ink' : 'text-line'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-ink-2">
              Dari {ratingSummary.totalReviews} ulasan
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            {ratingSummary.distribution.map((item) => (
              <div key={item.star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-ink font-medium flex items-center gap-1 justify-end tabular-nums">
                  {item.star} <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full bg-ink rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-16 text-right text-ink-2 tabular-nums">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">
            Daftar ulasan ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="p-8 rounded-xl bg-surface border border-line text-center space-y-1">
              <p className="text-sm font-medium">Belum ada ulasan untuk produk ini.</p>
              <p className="text-xs text-ink-2">
                Beli produk ini dan berikan ulasan dari halaman Riwayat Pesanan setelah pesanan berstatus Selesai.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <article key={rev.id} className="p-4 rounded-xl bg-surface border border-line space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{rev.buyer_name}</span>
                      <span className="px-2 py-0.5 rounded bg-surface-2 text-ink-2 text-xs border border-line">
                        Pembelian Terverifikasi
                      </span>
                    </div>
                    <time className="text-xs text-ink-2">
                      {new Date(rev.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>

                  <div className="flex items-center gap-0.5 text-ink" aria-label={`Rating ${rev.rating} dari 5`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current text-ink' : 'text-line'}`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-ink leading-relaxed">{rev.comment}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <RecommendedProducts products={relatedProducts} />
    </div>
  );
}
