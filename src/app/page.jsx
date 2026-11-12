import Link from 'next/link';
import { ArrowRight, Trophy, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="py-12 text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono font-semibold">
        <Zap className="w-3.5 h-3.5" />
        OFFICIAL ESPORTS PLATFORM 2026
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
        EQUIP FOR VICTORY. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#FF5E00]">
          TOURNAMENT GRADE GEAR.
        </span>
      </h1>

      <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
        Katalog gear gaming turnamen, jersey pro kit tim besar, dan rig performa tinggi dengan integrasi API online.
      </p>

      <div className="flex items-center justify-center gap-4 pt-4">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00F0FF] text-black font-bold text-sm hover:bg-[#00F0FF]/90 transition-colors shadow-lg shadow-[#00F0FF]/20"
        >
          Jelajahi Katalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
