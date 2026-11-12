import Link from 'next/link';
import { Shield, Trophy, Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070A0F] border-t border-[#262E3D] text-gray-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#262E3D]/60 mb-12">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#151A23]/60 border border-[#262E3D]">
            <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Tournament Grade</h4>
              <p className="text-xs text-gray-400">Peralatan standar turnamen pro esports.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#151A23]/60 border border-[#262E3D]">
            <div className="w-10 h-10 rounded-lg bg-[#FF5E00]/10 text-[#FF5E00] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Toko Terverifikasi</h4>
              <p className="text-xs text-gray-400">Seluruh seller disaring ketat oleh admin.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#151A23]/60 border border-[#262E3D]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Live API Internet</h4>
              <p className="text-xs text-gray-400">Katalog dan gambar terintegrasi API online.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-extrabold tracking-wider text-base">
              <Shield className="w-5 h-5 text-[#00F0FF]" />
              APEX ESPORTS
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Platform e-commerce esports Indonesia untuk gear turnamen, jersey pro kit tim besar, dan rig gaming berkualitas tinggi.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-mono">Kategori Produk</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/katalog?kategori=gaming-gear" className="hover:text-[#00F0FF] transition-colors">
                  Gaming Gear & Peripherals
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=esports-apparel" className="hover:text-[#00F0FF] transition-colors">
                  Esports Apparel & Jerseys
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=gaming-hardware" className="hover:text-[#00F0FF] transition-colors">
                  Gaming Hardware & Rig
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=accessories" className="hover:text-[#00F0FF] transition-colors">
                  Accessories & Collectibles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-mono">Area Akun</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cart" className="hover:text-[#00F0FF] transition-colors">
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#00F0FF] transition-colors">
                  Pelacakan & Riwayat Pesanan
                </Link>
              </li>
              <li>
                <Link href="/seller/pending" className="hover:text-[#00F0FF] transition-colors">
                  Daftar Jadi Seller
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#00F0FF] transition-colors">
                  Masuk Akun
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-mono">Informasi Tugas</h5>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              Proyek Final Praktikum Pemrograman Web 2026. Tema 1: E-Commerce (Esports).
            </p>
            <p className="text-xs font-mono text-[#00F0FF]/80">
              Stack: Next.js + PostgreSQL (Raw SQL)
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#262E3D]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 VALIANT Esports Store. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Final Web 2026
          </p>
        </div>

      </div>
    </footer>
  );
}
