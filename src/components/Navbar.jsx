'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Shield, User, ChevronDown, Menu, X, Store, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const router = useRouter();
  const { user, switchAccount, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#262E3D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#FF5E00]/20 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] group-hover:border-[#00F0FF] transition-all">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1.5">
                VALIANT <span className="text-[#00F0FF] text-xs font-mono px-1.5 py-0.5 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/30">PRO</span>
              </span>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase font-mono">Esports Gear & Merch</p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari mouse, keyboard, jersey turnamen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151A23] border border-[#262E3D] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-colors"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="/katalog" className="hover:text-[#00F0FF] transition-colors">
              Katalog
            </Link>
            <Link href="/katalog?kategori=gaming-gear" className="hover:text-[#00F0FF] transition-colors">
              Gaming Gear
            </Link>
            <Link href="/katalog?kategori=esports-apparel" className="hover:text-[#00F0FF] transition-colors">
              Jersey & Apparel
            </Link>
            <Link href="/katalog?kategori=gaming-hardware" className="hover:text-[#00F0FF] transition-colors">
              Hardware
            </Link>
          </nav>

          {/* Right Action Icons & Account Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-lg bg-[#151A23] border border-[#262E3D] text-gray-200 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF5E00] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#151A23] border border-[#262E3D] hover:border-[#00F0FF]/50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-[#262E3D] flex items-center justify-center text-gray-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-white leading-tight">
                    {user ? user.name.split(' ')[0] : 'Mode Tamu'}
                  </p>
                  <p className="text-[10px] uppercase font-mono font-bold leading-tight tracking-wider text-[#00F0FF]">
                    {user ? user.role : 'GUEST'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#151A23] border border-[#262E3D] rounded-xl shadow-2xl py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-[#262E3D]">
                    <p className="text-xs text-gray-400">Sedang aktif sebagai:</p>
                    <p className="font-semibold text-white truncate">{user ? user.name : 'Tamu (Guest)'}</p>
                    <p className="text-xs font-mono text-gray-400 truncate">{user ? user.email : 'Belum Login'}</p>
                  </div>

                  {/* Contextual links based on role */}
                  <div className="py-1 border-b border-[#262E3D]">
                    {user?.role === 'buyer' && (
                      <Link
                        href="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#262E3D] hover:text-[#00F0FF]"
                      >
                        <Package className="w-4 h-4" /> Riwayat Pesanan
                      </Link>
                    )}

                    {user?.role === 'seller' && user?.status === 'approved' && (
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#00F0FF] hover:bg-[#262E3D]"
                      >
                        <Store className="w-4 h-4" /> Dashboard Seller
                      </Link>
                    )}

                    {user?.role === 'seller' && user?.status !== 'approved' && (
                      <Link
                        href="/seller/pending"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-[#262E3D]"
                      >
                        <Store className="w-4 h-4" /> Status Pengajuan Toko
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#FF5E00] hover:bg-[#262E3D]"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Panel Admin
                      </Link>
                    )}
                  </div>

                  {/* Switcher Cepat Akun Uji Coba (Untuk Aslab / Dosen Penguji) */}
                  <div className="px-4 py-2 bg-[#0B0E14]/40 border-b border-[#262E3D]">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5 font-bold">
                      Ganti Akun Pengujian:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <button
                        onClick={() => { switchAccount('buyer'); setDropdownOpen(false); }}
                        className="px-2 py-1.5 rounded bg-[#262E3D] hover:bg-[#00F0FF]/20 hover:text-[#00F0FF] text-left transition-colors font-medium text-gray-200"
                      >
                        🛒 Buyer
                      </button>
                      <button
                        onClick={() => { switchAccount('seller'); setDropdownOpen(false); }}
                        className="px-2 py-1.5 rounded bg-[#262E3D] hover:bg-[#FF5E00]/20 hover:text-[#FF5E00] text-left transition-colors font-medium text-gray-200"
                      >
                        🏪 Seller (Apex)
                      </button>
                      <button
                        onClick={() => { switchAccount('seller_pending'); setDropdownOpen(false); }}
                        className="px-2 py-1.5 rounded bg-[#262E3D] hover:bg-amber-400/20 hover:text-amber-400 text-left transition-colors font-medium text-gray-200"
                      >
                        ⏳ Seller Pending
                      </button>
                      <button
                        onClick={() => { switchAccount('admin'); setDropdownOpen(false); }}
                        className="px-2 py-1.5 rounded bg-[#262E3D] hover:bg-purple-500/20 hover:text-purple-300 text-left transition-colors font-medium text-gray-200"
                      >
                        🛡️ Admin
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    {user ? (
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-[#262E3D] transition-colors"
                      >
                        Mode Tamu (Logout)
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left px-4 py-2 text-[#00F0FF] hover:bg-[#262E3D] transition-colors"
                      >
                        Halaman Login / Register
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#151A23] border border-[#262E3D] text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#262E3D] space-y-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari gear turnamen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#151A23] border border-[#262E3D] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </form>
            <div className="flex flex-col gap-2 font-medium text-sm text-gray-300">
              <Link
                href="/katalog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#151A23] hover:text-[#00F0FF]"
              >
                Katalog Lengkap
              </Link>
              <Link
                href="/katalog?kategori=gaming-gear"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#151A23] hover:text-[#00F0FF]"
              >
                Gaming Gear
              </Link>
              <Link
                href="/katalog?kategori=esports-apparel"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#151A23] hover:text-[#00F0FF]"
              >
                Jersey & Apparel
              </Link>
              <Link
                href="/katalog?kategori=gaming-hardware"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#151A23] hover:text-[#00F0FF]"
              >
                Hardware & Rig
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
