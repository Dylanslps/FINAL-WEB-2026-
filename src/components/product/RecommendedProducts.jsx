import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function RecommendedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section aria-labelledby="recommended-heading" className="space-y-6 pt-10 border-t border-line">
      <div className="flex items-end justify-between gap-4">
        <h2 id="recommended-heading" className="font-display uppercase text-2xl sm:text-3xl">
          Produk serupa
        </h2>
        <Link href="/katalog" className="text-sm font-medium underline underline-offset-4 hover:text-ink-2">
          Lihat katalog lengkap
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((rel) => (
          <ProductCard key={rel.id} product={rel} />
        ))}
      </div>
    </section>
  );
}
