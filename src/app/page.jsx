import Link from 'next/link';
import { getProducts, getFeaturedProducts, getProductsBySlugs } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { HERO_SLIDES } from '@/lib/hero-slides';
import ProductCard from '@/components/ProductCard';
import HeroShowcase from '@/components/home/HeroShowcase';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, latest, categories, heroProducts] = await Promise.all([
    getFeaturedProducts(4),
    getProducts({ limit: 8 }),
    getCategories(),
    getProductsBySlugs(HERO_SLIDES.map((s) => s.slug)),
  ]);

  const bySlug = new Map(heroProducts.map((p) => [p.slug, p]));
  const slides = HERO_SLIDES.map((s) => ({ ...s, product: bySlug.get(s.slug) || null }));
  const visibleCategories = categories.filter((c) => c.product_count > 0);

  return (
    <div className="space-y-20 pb-4">
      <HeroShowcase slides={slides} />

      {/* Strip kategori: teks besar, jumlah produk asli dari database */}
      {visibleCategories.length > 0 && (
        <section aria-labelledby="kategori-heading" className="space-y-5">
          <h2 id="kategori-heading" className="font-display uppercase text-3xl md:text-4xl">
            Belanja per kategori
          </h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {visibleCategories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/katalog?kategori=${cat.slug}`}
                  className="group inline-flex items-baseline gap-2 min-h-11 py-1"
                >
                  <span className="font-display uppercase text-2xl md:text-3xl text-ink-2 group-hover:text-ink transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-sm text-ink-2 tabular-nums">{cat.product_count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {featured.length > 0 && (
        <section aria-labelledby="unggulan-heading" className="space-y-6">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
            <h2 id="unggulan-heading" className="font-display uppercase text-3xl md:text-4xl">
              Pilihan minggu ini
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="baru-heading" className="space-y-6">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
          <h2 id="baru-heading" className="font-display uppercase text-3xl md:text-4xl">
            Baru masuk
          </h2>
          {latest.total > 0 && (
            <Link href="/katalog" className="text-sm font-medium underline underline-offset-4 hover:text-ink-2">
              Lihat semua {latest.total} produk
            </Link>
          )}
        </div>
        {latest.products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {latest.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line p-10 text-center space-y-2">
            <p className="font-semibold">Katalog masih kosong.</p>
            <p className="text-sm text-ink-2">
              Jalankan <code className="px-1 rounded bg-surface-2">npm run db:seed</code> untuk mengisi produk dari DummyJSON dan Fake Store API.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
