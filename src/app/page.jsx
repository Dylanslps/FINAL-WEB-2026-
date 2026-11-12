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
      
      {/* 1. Hero Section: VALIANT PRO with BTR Red & Vitality Yellow Aesthetic */}
      <section className="relative rounded-2xl overflow-hidden border border-[#20293A] bg-[#0E131F] p-8 md:p-12 text-center md:text-left">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-[#FF1E27] text-xs font-mono font-bold tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              VALIANT ARENA // OFFICIAL ESPORTS 2026
            </div>
            <DropCountdown />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight font-sans">
            Dominasi Turnamen. <br />
            <span className="text-[#FF1E27]">
              Gear Standar Juara.
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Marketplace resmi perlengkapan esports: mouse gaming ultralight 8KHz, keyboard optical switch, jersey pro kit, headset turnamen, dan rig kompetisi. Gambar dan spesifikasi ditarik langsung via live API internet.
          </p>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-2">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF1E27] text-white font-black text-xs uppercase tracking-wider hover:bg-[#FFD000] hover:text-black transition-all shadow-md shadow-[#FF1E27]/25"
            >
              Belanja Gear Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/katalog?kategori=esports-apparel"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#121722] hover:bg-[#1A2232] text-white border border-[#20293A] hover:border-[#FFD000]/60 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Lihat Pro Kit Jersey
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Kategori Cepat (Quick Navigation Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-[#FFD000]" /> Kategori Perlengkapan
          </h2>
          <Link href="/katalog" className="text-xs text-[#FFD000] hover:underline font-mono">
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
                className="group p-4 rounded-2xl bg-[#121722] border border-[#20293A] hover:border-[#FF1E27]/60 hover:bg-[#182030] transition-all flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0A0D14] border border-[#20293A] group-hover:border-[#FF1E27]/40 text-[#FF1E27] flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#FF1E27] transition-colors truncate">
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
          <div className="flex items-end justify-between border-b border-[#20293A] pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#FFD000] font-mono font-bold tracking-wider uppercase mb-1">
                <Trophy className="w-4 h-4" /> TOURNAMENT DROP HIGHLIGHT
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                Featured Drop Koleksi Terkini
              </h2>
            </div>
            <Link
              href="/katalog"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-[#FFD000] hover:underline font-mono"
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
        <div className="flex items-end justify-between border-b border-[#20293A] pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
              Eksplorasi Katalog Perlengkapan
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Data spesifikasi dan visual langsung ditarik dari API e-commerce internet publik
            </p>
          </div>
          <Link
            href="/katalog"
            className="text-xs text-[#FFD000] hover:underline font-mono"
          >
            Buka Katalog Lengkap ({catalogData.total}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {catalogData.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Tournament Trust Badges */}
      <section className="rounded-2xl border border-[#20293A] bg-[#121722] p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FF1E27]/10 text-[#FF1E27] flex items-center justify-center mx-auto md:mx-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase font-mono">Ultralight 8KHz Sensor</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Respon optik 0.125ms untuk akurasi aim tertinggi di panggung turnamen kompetitif.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFD000]/10 text-[#FFD000] flex items-center justify-center mx-auto md:mx-0">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase font-mono">Pro Kit Tournament Standard</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Jersey atlet esports berstandar Dry-Fit pro player dengan material breathable anti-keringat.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase font-mono">Toko Resmi Terverifikasi</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Verifikasi merchant multi-tahap oleh Super Admin memastikan gear turnamen 100% original.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
