import Link from 'next/link';
import { Shield, Trophy, Zap, Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070A0F] border-t border-[#20293A] text-gray-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#20293A] mb-12">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121722] border border-[#20293A]">
            <div className="w-10 h-10 rounded-xl bg-[#FF1E27]/10 text-[#FF1E27] flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Red Aliens Championship</h4>
              <p className="text-[11px] text-gray-400">Peralatan standar juara dunia Bigetron Esports.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121722] border border-[#20293A]">
            <div className="w-10 h-10 rounded-xl bg-[#FFD000]/10 text-[#FFD000] flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Vitality Paris Hive Tech</h4>
              <p className="text-[11px] text-gray-400">Kolaborasi resmi Team Vitality Eropa 2025/2026.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121722] border border-[#20293A]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Live API E-Commerce</h4>
              <p className="text-[11px] text-gray-400">Katalog dan gambar disinkronkan langsung via API publik.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-black tracking-wider text-sm font-mono">
              <span className="w-6 h-6 rounded-lg bg-[#FF1E27] flex items-center justify-center text-white text-[11px] font-black">
                B
              </span>
              <span>BTR <strong className="text-[#FFD000]">VITALITY</strong></span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Toko resmi merchandise & pro kit Bigetron by Vitality. Didesain untuk Trooper BTR dan komunitas esports Indonesia dengan standar kompetisi tertinggi.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-mono">Kategori Produk</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/katalog?kategori=gaming-gear" className="hover:text-[#FF1E27] transition-colors">
                  Gaming Gear & Peripherals
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=esports-apparel" className="hover:text-[#FFD000] transition-colors">
                  Jersey & Pro Kit Robot Merah
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=gaming-hardware" className="hover:text-[#FF1E27] transition-colors">
                  Gaming Hardware & Rig
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=accessories" className="hover:text-[#FFD000] transition-colors">
                  Accessories & Collectibles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-mono">Area Akun</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cart" className="hover:text-[#FF1E27] transition-colors">
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#FF1E27] transition-colors">
                  Pelacakan & Riwayat Pesanan
                </Link>
              </li>
              <li>
                <Link href="/seller/pending" className="hover:text-[#FFD000] transition-colors">
                  Daftar Jadi Merchant BTR
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#FFD000] transition-colors">
                  Masuk Akun Pengujian
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-mono">Informasi Praktikum</h5>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              Tugas Akhir Praktikum Pemrograman Web 2026.
            </p>
            <p className="text-xs font-mono text-[#FFD000]">
              Tema: E-Commerce Esports (BTR x Vitality)
            </p>
            <p className="text-[11px] font-mono text-gray-500 mt-1">
              Stack: Next.js + PostgreSQL (Raw SQL)
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#20293A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Bigetron by Vitality Store. All rights reserved.</p>
          <p className="flex items-center gap-1 font-mono text-[11px]">
            <span>#BTRWIN</span> • <span>#VFORVICTORY</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
