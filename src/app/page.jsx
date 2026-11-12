import Link from 'next/link';
import { getProducts, getFeaturedProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import ProductCard from '@/components/ProductCard';
import DropCountdown from '@/components/DropCountdown';
import { ArrowRight, Trophy, Zap, ShieldCheck, Sparkles, Gamepad2, Shirt, Cpu, Disc } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, catalogData, categories] = await Promise.all([
    getFeaturedProducts(4),
    getProducts({ limit: 8 }),
    getCategories(),
  ]);

  const categoryIcons = {
    'gaming-gear': Gamepad2,
    'esports-apparel': Shirt,
    'gaming-hardware': Cpu,
    'accessories': Disc,
  };

  return (
    <div className="space-y-16 py-4">
      
      {/* 1. Hero Section (Inspirasi Team Vitality & Fnatic) */}
      <section className="relative rounded-2xl overflow-hidden border border-[#262E3D] bg-gradient-to-b from-[#151A23] via-[#0B0E14] to-[#0B0E14] p-8 md:p-14 text-center md:text-left">
        {/* Background Accent Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF5E00]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono font-bold tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              OFFICIAL ESPORTS ARENA 2026
            </div>
            <DropCountdown />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight font-sans">
            Dominasi Turnamen. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-white to-[#FF5E00]">
              Gear Standar Juara.
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Toko resmi perlengkapan esports: mouse ultralight 8KHz, keyboard switch optik, jersey dry-fit pro kit, dan rig kompetisi. Gambar dan spesifikasi ditarik langsung via live API internet.
          </p>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-2">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00F0FF] text-black font-extrabold text-sm hover:bg-[#00F0FF]/90 transition-all shadow-lg shadow-[#00F0FF]/25 hover:scale-105"
            >
              Belanja Gear Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/katalog?kategori=esports-apparel"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#151A23] hover:bg-[#262E3D] text-white border border-[#262E3D] hover:border-gray-500 font-bold text-sm transition-all"
            >
              Lihat Pro Kit Jersey
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Kategori Cepat (Quick Navigation Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F0FF]" /> Kategori Produk
          </h2>
          <Link href="/katalog" className="text-xs text-[#00F0FF] hover:underline font-mono">
            Semua Kategori →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Gamepad2;
            return (
              <Link
                key={cat.id}
                href={`/katalog?kategori=${cat.slug}`}
                className="group p-4 rounded-xl bg-[#151A23] border border-[#262E3D] hover:border-[#00F0FF]/60 hover:bg-[#1D2432] transition-all flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0B0E14] border border-[#262E3D] group-hover:border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-mono">
                    {cat.product_count} Produk
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Drops Section (Produk Unggulan) */}
      {featured.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#262E3D] pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#FF5E00] font-mono font-bold tracking-wider uppercase mb-1">
                <Trophy className="w-4 h-4" /> TOURNAMENT HIGHLIGHT
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Featured Drop Koleksi Terkini
              </h2>
            </div>
            <Link
              href="/katalog"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-[#00F0FF] hover:underline font-mono"
            >
              Lihat Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Katalog Terbaru (Main Products Grid) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#262E3D] pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Eksplorasi Katalog Perlengkapan
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Data terintegrasi live API DummyJSON & PostgreSQL server.
            </p>
          </div>
          <Link
            href="/katalog"
            className="text-xs text-[#00F0FF] hover:underline font-mono"
          >
            Lihat Semua Produk ({catalogData.total}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {catalogData.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-6">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#151A23] hover:bg-[#262E3D] text-white border border-[#262E3D] hover:border-[#00F0FF]/50 text-sm font-bold transition-all"
          >
            Buka Katalog Lengkap dengan Filter Harga & Rating <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Trust & Quality Banner (Inspirasi Team Liquid & Fnatic Store) */}
      <section className="rounded-2xl bg-[#151A23]/50 border border-[#262E3D] p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Verifikasi Toko Ketat</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Setiap seller yang mendaftar diverifikasi langsung oleh Admin sebelum diizinkan menjual barang.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#FF5E00]/10 text-[#FF5E00] flex items-center justify-center mx-auto md:mx-0">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Ulasan Pembeli Nyata</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sistem review Baymard terverifikasi: ulasan bintang hanya bisa diberikan setelah pesanan berstatus Selesai.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto md:mx-0">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Automasi API Tanpa Repot</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Gambar dan katalog barang ditarik otomatis lewat API e-commerce internet sesuai arahan aslab.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
