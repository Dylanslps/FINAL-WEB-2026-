// Konfigurasi slide hero homepage. Gambar masih DUMMY (render 3D DummyJSON).
// Ganti gambar: timpa file di public/hero/ dengan nama sama (PNG/WebP transparan, 1:1),
// atau ubah `image` di bawah. `slug` harus cocok dengan produk di database (lihat seed).
// `flip: true` jika ujung sepatu di gambar menghadap ke kiri.
export const HERO_SLIDES = [
  {
    slug: 'sports-sneakers-off-white-red',
    image: '/hero/slide-1.webp',
    theme: 'light',
    flip: true,
    headline: ['Off White', 'Court Low'],
    watermark: 'COURT',
    tagline: 'Kulit putih, panah merah. Siap dipakai dari kelas sampai nongkrong.',
    fallbackName: 'Sports Sneakers Off White & Red',
  },
  {
    slug: 'nike-air-jordan-1-red-and-black',
    image: '/hero/slide-2.webp',
    theme: 'dark',
    flip: true,
    headline: ['Air Jordan', 'One Mid'],
    watermark: 'JORDAN',
    tagline: 'Siluet basket 1985 dengan warna merah hitam yang paling dicari.',
    fallbackName: 'Nike Air Jordan 1 Red And Black',
  },
  {
    slug: 'puma-future-rider-trainers',
    image: '/hero/slide-3.webp',
    theme: 'light',
    flip: true,
    headline: ['Future', 'Rider'],
    watermark: 'RIDER',
    tagline: 'Sol empuk dan panel warna cerah untuk jalan seharian.',
    fallbackName: 'Puma Future Rider Trainers',
  },
];
