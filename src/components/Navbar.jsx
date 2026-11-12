'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Shield, User, ChevronDown, Menu, X, Store, LayoutDashboard, Package, Zap } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-[#0A0D14]/95 backdrop-blur-md border-b border-[#20293A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo: VALIANT PRO with BTR Red & Vitality Gold Theme */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1E27]/25 via-[#FFD000]/15 to-transparent border border-[#FF1E27]/60 flex items-center justify-center text-[#FF1E27] group-hover:border-[#FFD000] group-hover:text-[#FFD000] transition-all">
              <Shield className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider text-white font-mono">
                  VALIANT <span className="text-[#FF1E27]">PRO</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFD000]/15 text-[#FFD000] border border-[#FFD000]/30 font-bold uppercase tracking-wider">
                  ESPORTS
                </span>
              </div>
              <p className="text-[9px] text-gray-400 tracking-widest uppercase font-mono">
                Esports Gear & Gaming Store
              </p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari mouse, keyboard, headset, jersey turnamen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121722] border border-[#20293A] rounded-xl pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#FF1E27] focus:ring-1 focus:ring-[#FF1E27] transition-colors"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-2.5" />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-300">
            <Link href="/katalog" className="hover:text-[#FF1E27] transition-colors">
              Katalog
            </Link>
            <Link href="/katalog?kategori=gaming-gear" className="hover:text-[#FFD000] transition-colors">
              Gaming Gear
            </Link>
            <Link href="/katalog?kategori=esports-apparel" className="hover:text-[#FF1E27] transition-colors flex items-center gap-1">
              <span>Jersey & Pro Kit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] animate-ping" />
            </Link>
            <Link href="/katalog?kategori=gaming-hardware" className="hover:text-[#FFD000] transition-colors">
              Hardware
            </Link>
          </nav>

          {/* Right Action Icons & Account Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-[#121722] border border-[#20293A] text-gray-200 hover:text-[#FF1E27] hover:border-[#FF1E27]/50 transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF1E27] text-white text-[10px] font-mono font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg shadow-[#FF1E27]/50">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#121722] border border-[#20293A] hover:border-[#FF1E27]/50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1A2232] flex items-center justify-center text-gray-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-white leading-tight">
                    {user ? user.name.split(' ')[0] : 'Mode Tamu'}
                  </p>
                  <p className="text-[10px] uppercase font-mono font-bold leading-tight tracking-wider text-[#FFD000]">
                    {user ? user.role : 'GUEST'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#121722] border border-[#20293A] rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-[#20293A]">
                    <p className="text-[10px] text-gray-400">Sedang aktif sebagai:</p>
                    <p className="font-semibold text-white truncate text-sm">{user ? user.name : 'Tamu (Guest)'}</p>
                    <p className="text-[10px] font-mono text-gray-400 truncate">{user ? user.email : 'Belum Login'}</p>
                  </div>

                  {/* Contextual links based on role */}
                  <div className="py-1 border-b border-[#20293A]">
                    {user?.role === 'buyer' && (
                      <Link
                        href="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#1A2232] hover:text-[#FF1E27]"
                      >
                        <Package className="w-4 h-4" /> Riwayat Pesanan
                      </Link>
                    )}

                    {user?.role === 'seller' && (
                      <Link
                        href={user?.status === 'approved' ? '/seller/dashboard' : '/seller/pending'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#FFD000] hover:bg-[#1A2232]"
                      >
                        <Store className="w-4 h-4" /> Dashboard Seller Toko
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#FF1E27] hover:bg-[#1A2232] font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Panel Admin (Root)
                      </Link>
                    )}
                  </div>

                  {/* Switcher Cepat 4 Peran Kanonikal (Sesuai Spesifikasi PDF) */}
                  <div className="px-3.5 py-2.5 bg-[#0A0D14]/80 border-b border-[#20293A]">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2 font-bold flex items-center justify-between">
                      <span>4 Peran Kanonikal (PDF):</span>
                      <span className="text-[#FFD000]">1-Click</span>
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                      <button
                        onClick={() => { switchAccount('guest'); setDropdownOpen(false); }}
                        className={`px-2.5 py-2 rounded-xl text-left transition-colors font-semibold border flex items-center justify-between ${
                          !user
                            ? 'bg-[#FF1E27]/15 border-[#FF1E27] text-white shadow-sm'
                            : 'bg-[#182030] border-[#20293A] text-gray-300 hover:text-white hover:border-[#FF1E27]/50'
                        }`}
                      >
                        <span>🌐 Guest</span>
                        {!user && <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] animate-pulse" />}
                      </button>
                      <button
                        onClick={() => { switchAccount('buyer'); setDropdownOpen(false); }}
                        className={`px-2.5 py-2 rounded-xl text-left transition-colors font-semibold border flex items-center justify-between ${
                          user?.role === 'buyer'
                            ? 'bg-[#FF1E27]/15 border-[#FF1E27] text-white shadow-sm'
                            : 'bg-[#182030] border-[#20293A] text-gray-300 hover:text-white hover:border-[#FF1E27]/50'
                        }`}
                      >
                        <span>🛒 Buyer</span>
                        {user?.role === 'buyer' && <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E27] animate-pulse" />}
                      </button>
                      <button
                        onClick={() => { switchAccount('seller'); setDropdownOpen(false); }}
                        className={`px-2.5 py-2 rounded-xl text-left transition-colors font-semibold border flex items-center justify-between ${
                          user?.role === 'seller'
                            ? 'bg-[#FFD000]/15 border-[#FFD000] text-[#FFD000] shadow-sm'
                            : 'bg-[#182030] border-[#20293A] text-gray-300 hover:text-[#FFD000] hover:border-[#FFD000]/50'
                        }`}
                      >
                        <span>🏪 Seller</span>
                        {user?.role === 'seller' && <span className="w-1.5 h-1.5 rounded-full bg-[#FFD000] animate-pulse" />}
                      </button>
                      <button
                        onClick={() => { switchAccount('admin'); setDropdownOpen(false); }}
                        className={`px-2.5 py-2 rounded-xl text-left transition-colors font-semibold border flex items-center justify-between ${
                          user?.role === 'admin'
                            ? 'bg-purple-500/15 border-purple-500 text-purple-300 shadow-sm'
                            : 'bg-[#182030] border-[#20293A] text-gray-300 hover:text-purple-300 hover:border-purple-500/50'
                        }`}
                      >
                        <span>🛡️ Admin</span>
                        {user?.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    {user ? (
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-[#1A2232] transition-colors"
                      >
                        Mode Tamu (Logout)
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left px-4 py-2 text-[#FFD000] hover:bg-[#1A2232] transition-colors font-semibold"
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
              className="lg:hidden p-2 rounded-xl bg-[#121722] border border-[#20293A] text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#20293A] space-y-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari gear turnamen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121722] border border-[#20293A] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </form>
            <div className="flex flex-col gap-2 font-medium text-xs text-gray-300 uppercase tracking-wider">
              <Link
                href="/katalog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#121722] hover:text-[#FF1E27]"
              >
                Katalog Lengkap
              </Link>
              <Link
                href="/katalog?kategori=gaming-gear"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#121722] hover:text-[#FFD000]"
              >
                Gaming Gear
              </Link>
              <Link
                href="/katalog?kategori=esports-apparel"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#121722] hover:text-[#FF1E27]"
              >
                Jersey & Apparel
              </Link>
              <Link
                href="/katalog?kategori=gaming-hardware"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#121722] hover:text-[#FFD000]"
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
