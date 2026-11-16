import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import ProductCard from '@/components/ProductCard';
import { Search, X } from 'lucide-react';

export const dynamic = 'force-dynamic';

const SORT_OPTIONS = [
  { label: 'Terbaru', val: 'newest' },
  { label: 'Harga terendah', val: 'price_asc' },
  { label: 'Harga tertinggi', val: 'price_desc' },
  { label: 'Rating tertinggi', val: 'rating' },
];

export default async function CatalogPage({ searchParams }) {
  const params = await searchParams;
  const currentCategory = params?.kategori || '';
  const searchQuery = params?.q || '';
  const currentSort = params?.sort || 'newest';

  const [categories, { products, total }] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: currentCategory || undefined,
      search: searchQuery || undefined,
      sortBy: currentSort,
      limit: 60,
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === currentCategory);
  const totalAll = categories.reduce((acc, c) => acc + Number(c.product_count), 0);

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="font-display uppercase text-4xl sm:text-5xl leading-none">
            {activeCategory ? activeCategory.name : 'Semua produk'}
          </h1>
          <p className="text-sm text-ink-2 mt-2 max-w-xl">
            {activeCategory
              ? activeCategory.description
              : 'Sneaker, pakaian harian, tas, jam tangan, kacamata, dan perhiasan dari seller terverifikasi.'}
          </p>
        </div>
        <p className="text-sm text-ink-2 tabular-nums">
          Menampilkan <strong className="text-ink">{total}</strong> produk
        </p>
      </div>

      {/* Filter kategori */}
      <nav aria-label="Filter kategori" className="flex items-center gap-2 overflow-x-auto pb-2">
        <Link
          href={`/katalog?sort=${currentSort}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
          className={`min-h-11 px-4 inline-flex items-center rounded-md text-xs font-semibold whitespace-nowrap border transition-colors ${
            !currentCategory
              ? 'bg-ink text-canvas border-ink'
              : 'bg-surface text-ink border-line hover:bg-surface-2'
          }`}
        >
          Semua ({totalAll})
        </Link>

        {categories.map((cat) => {
          const isActive = currentCategory === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/katalog?kategori=${cat.slug}&sort=${currentSort}${
                searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''
              }`}
              className={`min-h-11 px-4 inline-flex items-center rounded-md text-xs font-semibold whitespace-nowrap border transition-colors ${
                isActive
                  ? 'bg-ink text-canvas border-ink'
                  : 'bg-surface text-ink border-line hover:bg-surface-2'
              }`}
            >
              {cat.name} ({cat.product_count})
            </Link>
          );
        })}
      </nav>

      {/* Bar pencarian dan urutan */}
      <div className="p-4 rounded-xl bg-surface border border-line flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form method="GET" action="/katalog" role="search" className="w-full md:w-80 relative">
          {currentCategory && <input type="hidden" name="kategori" value={currentCategory} />}
          {currentSort && <input type="hidden" name="sort" value={currentSort} />}
          <label htmlFor="catalog-search-input" className="sr-only">Cari di katalog</label>
          <input
            id="catalog-search-input"
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder="Cari nama produk atau merek..."
            className="w-full h-11 bg-canvas border border-line rounded-md pl-10 pr-4 text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
          />
          <Search className="w-4 h-4 text-ink-2 absolute left-3.5 top-3.5" aria-hidden="true" />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-2 mr-1">Urutkan:</span>
          {SORT_OPTIONS.map((s) => {
            const isSelected = currentSort === s.val;
            return (
              <Link
                key={s.val}
                href={`/katalog?${currentCategory ? `kategori=${currentCategory}&` : ''}${
                  searchQuery ? `q=${encodeURIComponent(searchQuery)}&` : ''
                }sort=${s.val}`}
                className={`min-h-9 px-3 inline-flex items-center rounded-md text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-ink text-canvas border-ink'
                    : 'border-line text-ink-2 hover:text-ink hover:bg-surface-2'
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>

      {(currentCategory || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-2">
          <span>Filter aktif:</span>
          {currentCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-line text-ink">
              Kategori: {activeCategory?.name || currentCategory}
              <Link
                href={`/katalog?sort=${currentSort}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                aria-label="Hapus filter kategori"
                className="p-0.5 hover:text-accent"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-line text-ink">
              Kata kunci: &quot;{searchQuery}&quot;
              <Link
                href={`/katalog?${currentCategory ? `kategori=${currentCategory}&` : ''}sort=${currentSort}`}
                aria-label="Hapus kata kunci pencarian"
                className="p-0.5 hover:text-accent"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </span>
          )}
          <Link href="/katalog" className="underline underline-offset-4 text-ink hover:text-ink-2 ml-2">
            Hapus semua filter
          </Link>
        </div>
      )}

      {products.length === 0 ? (
        <div className="py-16 px-6 text-center space-y-3 rounded-xl bg-surface border border-line">
          <h2 className="font-semibold text-base">Tidak ada produk yang cocok</h2>
          <p className="text-sm text-ink-2 max-w-md mx-auto">
            {searchQuery || currentCategory
              ? 'Pencarian atau filter kategori yang dipilih belum memiliki produk. Hapus filter untuk melihat seluruh koleksi.'
              : 'Belum ada produk di database. Jalankan npm run db:seed untuk menarik produk dari API.'}
          </p>
          {(searchQuery || currentCategory) && (
            <div className="pt-2">
              <Link
                href="/katalog"
                className="inline-flex items-center min-h-11 px-5 rounded-md bg-ink text-canvas text-sm font-semibold hover:opacity-85"
              >
                Tampilkan semua produk
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
