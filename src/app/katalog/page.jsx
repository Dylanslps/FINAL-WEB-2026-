import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import ProductCard from '@/components/ProductCard';
import { Filter, Search, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
      limit: 50,
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="space-y-8 py-4">
      
      {/* Header & Judul */}
      <div className="space-y-2 border-b border-[#20293A] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#FFD000]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KATALOG RESMI BTR VITALITY 2026</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              {activeCategory ? activeCategory.name : 'Semua Perlengkapan BTR x Vitality'}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {activeCategory
                ? activeCategory.description
                : 'Temukan gear gaming nirkabel, jersey Robot Merah Pro Kit, dan hardware standar turnamen.'}
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-[#121722] px-3 py-1.5 rounded-xl border border-[#20293A]">
            Total: <strong className="text-white">{total}</strong> Produk
          </span>
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="space-y-4">
        
        {/* Kategori Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href={`/katalog?sort=${currentSort}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              !currentCategory
                ? 'bg-[#FF1E27] text-white border-[#FF1E27] shadow-lg shadow-[#FF1E27]/25'
                : 'bg-[#121722] text-gray-300 border-[#20293A] hover:border-gray-500 hover:text-white'
            }`}
          >
            Semua ({categories.reduce((acc, c) => acc + Number(c.product_count), 0)})
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/katalog?kategori=${cat.slug}&sort=${currentSort}${
                searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''
              }`}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                currentCategory === cat.slug
                  ? 'bg-[#FF1E27] text-white border-[#FF1E27] shadow-lg shadow-[#FF1E27]/25'
                  : 'bg-[#121722] text-gray-300 border-[#20293A] hover:border-gray-500 hover:text-white'
              }`}
            >
              {cat.name} ({cat.product_count})
            </Link>
          ))}
        </div>

        {/* Pencarian & Pengurutan Bar */}
        <div className="p-4 rounded-2xl bg-[#121722] border border-[#20293A] flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Form Pencarian */}
          <form method="GET" action="/katalog" className="w-full md:w-80 relative">
            {currentCategory && <input type="hidden" name="kategori" value={currentCategory} />}
            {currentSort && <input type="hidden" name="sort" value={currentSort} />}
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Cari pro kit, mouse, jersey..."
              className="w-full bg-[#0A0D14] border border-[#20293A] rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          </form>

          {/* Opsi Pengurutan (Sorting) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan:
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { label: 'Terbaru', val: 'newest' },
                { label: 'Termurah', val: 'price_asc' },
                { label: 'Termahal', val: 'price_desc' },
                { label: 'Rating', val: 'rating' },
              ].map((s) => (
                <Link
                  key={s.val}
                  href={`/katalog?${currentCategory ? `kategori=${currentCategory}&` : ''}${
                    searchQuery ? `q=${encodeURIComponent(searchQuery)}&` : ''
                  }sort=${s.val}`}
                  className={`px-2.5 py-1.5 rounded-xl font-medium transition-colors ${
                    currentSort === s.val
                      ? 'bg-[#FF1E27]/20 text-[#FF1E27] border border-[#FF1E27]/40 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-[#182030]'
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Filter Aktif Pill */}
        {(currentCategory || searchQuery) && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Filter Aktif:</span>
            {currentCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#262E3D] text-gray-200">
                Kategori: {activeCategory?.name}
                <Link href={`/katalog?sort=${currentSort}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}>
                  <X className="w-3 h-3 hover:text-rose-400" />
                </Link>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#262E3D] text-gray-200">
                Pencarian: &quot;{searchQuery}&quot;
                <Link href={`/katalog?${currentCategory ? `kategori=${currentCategory}&` : ''}sort=${currentSort}`}>
                  <X className="w-3 h-3 hover:text-rose-400" />
                </Link>
              </span>
            )}
            <Link
              href="/katalog"
              className="text-[#00F0FF] hover:underline ml-2"
            >
              Reset Semua
            </Link>
          </div>
        )}

      </div>

      {/* Grid Produk */}
      {products.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-2xl bg-[#151A23] border border-[#262E3D] p-8">
          <div className="w-12 h-12 rounded-full bg-[#262E3D] flex items-center justify-center mx-auto text-gray-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Tidak ada produk yang sesuai</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Coba ganti kata kunci pencarian atau pilih kategori lain untuk menemukan gear yang Anda cari.
          </p>
          <Link
            href="/katalog"
            className="inline-block px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-bold text-xs hover:bg-[#00F0FF]/90 transition-colors"
          >
            Tampilkan Semua Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
