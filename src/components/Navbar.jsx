'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { href: '/katalog', label: 'Katalog' },
  { href: '/katalog?kategori=custom-shoes', label: 'Custom Shoes' },
  { href: '/katalog?kategori=sepatu-pria', label: 'Sepatu Pria' },
  { href: '/katalog?kategori=sepatu-wanita', label: 'Sepatu Wanita' },
  { href: '/katalog?kategori=pakaian-pria', label: 'Pakaian Pria' },
  { href: '/katalog?kategori=pakaian-wanita', label: 'Pakaian Wanita' },
];

const ROLES = [
  { key: 'guest', label: 'Guest' },
  { key: 'buyer', label: 'Buyer' },
  { key: 'seller', label: 'Seller' },
  { key: 'admin', label: 'Admin' },
];

function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('stride-theme', next); } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      className="w-11 h-11 flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
    </button>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { user, switchAccount, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setDropdownOpen(false); };
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/katalog?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const activeRole = user ? user.role : 'guest';
  const roleLink =
    user?.role === 'buyer' ? { href: '/orders', label: 'Riwayat pesanan' }
    : user?.role === 'seller' ? { href: user.status === 'approved' ? '/seller/dashboard' : '/seller/pending', label: 'Dashboard seller' }
    : user?.role === 'admin' ? { href: '/admin/dashboard', label: 'Panel admin' }
    : null;

  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="font-display text-2xl uppercase tracking-wide" aria-label="STRIDE, ke beranda">
            Stride
          </Link>

          <nav aria-label="Kategori utama" className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="py-2 text-ink-2 hover:text-ink transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Cari produk"
              aria-expanded={searchOpen}
              aria-controls="navbar-search"
              className="hidden md:flex w-11 h-11 items-center justify-center rounded-md hover:bg-surface-2 transition-colors"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            <ThemeToggle />

            <Link
              href="/cart"
              aria-label={`Keranjang, ${cartCount} barang`}
              className="relative w-11 h-11 flex items-center justify-center rounded-md hover:bg-surface-2 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-canvas text-[11px] font-semibold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="Menu akun"
                className="flex items-center gap-2 h-11 px-2 rounded-md hover:bg-surface-2 transition-colors"
              >
                <User className="w-5 h-5" aria-hidden="true" />
                <span className="hidden sm:block text-left leading-tight">
                  <span className="block text-sm font-medium">{user ? user.name.split(' ')[0] : 'Tamu'}</span>
                  <span className="block text-xs text-ink-2 capitalize">{activeRole}</span>
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-line bg-surface shadow-xl py-2 text-sm z-50">
                  <div className="px-4 py-2 border-b border-line">
                    <p className="font-semibold truncate">{user ? user.name : 'Tamu'}</p>
                    <p className="text-xs text-ink-2 truncate">{user ? user.email : 'Belum masuk'}</p>
                  </div>

                  {roleLink && (
                    <Link
                      href={roleLink.href}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 hover:bg-surface-2"
                    >
                      {roleLink.label}
                    </Link>
                  )}

                  <div className="px-4 py-3 border-y border-line">
                    <p className="text-xs text-ink-2 mb-2">Akun uji coba (1 klik)</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ROLES.map((r) => {
                        const isActive = activeRole === r.key;
                        return (
                          <button
                            key={r.key}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => { switchAccount(r.key); setDropdownOpen(false); }}
                            className={`min-h-9 rounded-md border text-xs font-medium transition-colors ${
                              isActive ? 'bg-ink text-canvas border-ink' : 'border-line hover:bg-surface-2'
                            }`}
                          >
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {user ? (
                    <button
                      type="button"
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-surface-2"
                    >
                      Keluar
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 font-medium hover:bg-surface-2"
                    >
                      Masuk atau daftar
                    </Link>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-md hover:bg-surface-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form id="navbar-search" role="search" onSubmit={handleSearch} className="hidden md:block pb-4">
            <label htmlFor="navbar-search-input" className="sr-only">Cari produk</label>
            <input
              id="navbar-search-input"
              ref={searchInputRef}
              type="search"
              placeholder="Cari sneaker, kemeja, tas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); }}
              className="w-full h-12 rounded-md border border-line bg-surface px-4 text-sm placeholder:text-ink-2 focus:border-ink focus:outline-none"
            />
          </form>
        )}

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-line space-y-3">
            <form role="search" onSubmit={handleSearch}>
              <label htmlFor="mobile-search-input" className="sr-only">Cari produk</label>
              <input
                id="mobile-search-input"
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-md border border-line bg-surface px-3 text-sm placeholder:text-ink-2 focus:border-ink focus:outline-none"
              />
            </form>
            <nav aria-label="Kategori (mobile)" className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-3 font-medium rounded-md hover:bg-surface-2"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
