import Link from 'next/link';

const SHOP_LINKS = [
  { href: '/katalog?kategori=custom-shoes', label: 'Custom Shoes' },
  { href: '/katalog?kategori=sepatu-pria', label: 'Sepatu Pria' },
  { href: '/katalog?kategori=sepatu-wanita', label: 'Sepatu Wanita' },
  { href: '/katalog?kategori=pakaian-pria', label: 'Pakaian Pria' },
  { href: '/katalog?kategori=pakaian-wanita', label: 'Pakaian Wanita' },
  { href: '/katalog?kategori=tas', label: 'Tas' },
  { href: '/katalog?kategori=jam-tangan', label: 'Jam Tangan' },
];

const ACCOUNT_LINKS = [
  { href: '/cart', label: 'Keranjang' },
  { href: '/orders', label: 'Riwayat pesanan' },
  { href: '/login', label: 'Masuk' },
  { href: '/register', label: 'Daftar sebagai buyer atau seller' },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6 space-y-3">
            <p className="font-display uppercase text-[clamp(3rem,9vw,7rem)] leading-[0.85]">Stride</p>
            <p className="text-sm text-ink-2 max-w-sm">
              Marketplace sneaker dan fashion untuk tugas akhir Praktikum Pemrograman Web 2026.
              Data produk diambil dari DummyJSON dan Fake Store API.
            </p>
          </div>

          <nav aria-label="Belanja" className="md:col-span-3">
            <h2 className="text-sm font-semibold mb-3">Belanja</h2>
            <ul className="space-y-1">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-sm text-ink-2 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Akun" className="md:col-span-3">
            <h2 className="text-sm font-semibold mb-3">Akun</h2>
            <ul className="space-y-1">
              {ACCOUNT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-sm text-ink-2 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-2">
          <p>© 2026 STRIDE. Proyek akademik, bukan toko komersial.</p>
          <p>
            Sumber data:{' '}
            <a href="https://dummyjson.com/docs/products" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">DummyJSON</a>
            {' dan '}
            <a href="https://fakestoreapi.com/docs" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">Fake Store API</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
