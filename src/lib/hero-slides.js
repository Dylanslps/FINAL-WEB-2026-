// Konfigurasi 3 slide hero sneaker ikonik (Nike Air Max 90, Nike Air Max 270, Nike Air Force 1).
// Gambar studio di public/hero/ dan model 3D GLB di public/models/shoe.glb.
export const HERO_SLIDES = [
  {
    slug: 'nike-air-jordan-1-red-and-black',
    image: '/hero/slide-1.webp',
    theme: 'red',
    headline: ['NIKE', 'AIR MAX 90'],
    watermark: 'AIR MAX',
    tagline: ['Feel the future.', 'Move with Air.'],
    cardTitle: 'Nike Air Max 90',
    fallbackName: 'Nike Air Max 90 Triple Red',
    fallbackPrice: 2399840,
  },
  {
    slug: 'puma-future-rider-trainers',
    image: '/hero/slide-2.webp',
    theme: 'dark',
    headline: ['NIKE', 'AIR MAX 270'],
    watermark: 'AIR MAX',
    tagline: ['Stealth comfort.', 'Built for the street.'],
    cardTitle: 'Nike Air Max 270',
    fallbackName: 'Nike Air Max 270 Triple Black',
    fallbackPrice: 1439840,
  },
  {
    slug: 'sports-sneakers-off-white-red',
    image: '/hero/airforcewhite.png',
    thumbnail: '/hero/airforce.png',
    theme: 'light',
    default3D: true,
    headline: ['NIKE AIR', 'FORCE 1'],
    watermark: 'AIR FORCE',
    tagline: ['Iconic since 1982.', 'Pure Triple White.'],
    cardTitle: 'Nike Air Force 1',
    fallbackName: 'Nike Air Force 1 Low White',
    fallbackPrice: 1919840,
  },
];
