# Referensi Desain: STRIDE, Toko Sneaker dan Fashion

Proyek final Praktikum Pemrograman Web 2026, Tema 1 (E-Commerce) dengan tema sneaker dan fashion.
Stack: Next.js (JSX, Tailwind CSS v4) dan PostgreSQL (Raw SQL).
Peran: Admin, Seller, Buyer, Public User (Guest).

Dokumen ini adalah **sumber arah desain** untuk semua pekerjaan UI. Setiap halaman baru atau perubahan tampilan wajib mengikuti token, tipografi, dan pola di bawah. Agen AI: baca file ini dulu, lalu terapkan skill `antislop` sebagai filter.

---

## 0. Referensi Visual Utama

Referensi: video konsep landing page sneaker "Air Max" (BLACKBEX, via Pinterest). Yang diambil adalah **pola**, bukan merek. Nama, logo swoosh, dan aset Nike tidak dipakai. Brand kita fiktif: **STRIDE**.

Pola yang diambil dari video:

| Pola di video | Penerapan di STRIDE |
|---|---|
| Headline raksasa italic condensed, rata kiri, 2 baris (`STRIDE / AIR MAX`) | `font-display italic uppercase` (Anton), 2 baris, ukuran clamp besar |
| Sepatu 3D profil samping melayang pada sudut `-25deg` dengan bayangan lantai elips | Potongan studio 3D Air Max (`public/hero/slide-1..3.webp`) + model 3D WebGL `.glb` (`public/models/shoe.glb`) |
| Watermark teks `AIR MAX` raksasa di belakang sepatu | Watermark `AIR MAX` italic di tengah panggung dengan pergeseran paralaks horizontal |
| Bar produk horizontal 3 kartu di bagian bawah dengan tombol `<` dan `>` serta 3 titik indikator | Bar 3 kartu kaca transparan (`[thumbnail sepatu | garis vertikal | Nama + Harga]`) dengan tombol kiri/kanan |
| Tiga tema panggung mengikuti warna sepatu (Crimson Red, Stealth Black, Studio White) | Atribut `data-hero-theme="red \| dark \| light"` dengan gradien radial studio |
| Transisi *split-curtain wipe* dari kanan ke kiri yang membelah judul menjadi dua warna saat melintas | Layer masuk memakai `clip-path: inset(0 0 0 100% -> 0)` (`820ms`) sementara sepatu lama bergeser ke kiri dan sepatu baru meluncur dari kanan |
| Tombol CTA kotak `SHOP NOW ↗` kontras tinggi | Tombol `bg-[var(--hero-btn-bg)] text-[var(--hero-btn-ink)]` |

Yang **tidak** diambil: logo dan nama Nike, ikon sosial media tanpa akun asli, harga dalam Rupee.

---

## 1. Identitas dan Dial

**Karakter:** studio foto sneaker. Latar abu hangat seperti backdrop kertas, produk jadi satu-satunya warna di layar.

| Dial | Nilai | Alasan |
|---|---|---|
| ENERGY | 3 di hero, 2 di halaman lain | Hero adalah panggung produk; halaman transaksi (cart, dashboard) harus tenang dan mudah dibaca |
| RHYTHM | 2 | Grid produk konsisten, dengan jeda: hero penuh, strip kategori berupa teks besar, grid produk |
| MOTION | 3 di hero, 1 di halaman lain | Animasi hanya untuk memperkenalkan produk (masuk, tilt, wipe tema). Halaman lain cukup hover |

---

## 2. Token Warna

Semua warna lewat CSS variable di `src/app/globals.css`, dipetakan ke utility Tailwind. **Jangan menulis hex langsung di komponen.**

| Token (utility) | Terang | Gelap | Dipakai untuk |
|---|---|---|---|
| `canvas` (`bg-canvas`) | `#ECECE9` | `#121212` | Latar halaman |
| `surface` (`bg-surface`) | `#F7F7F5` | `#1B1B1B` | Kartu, panel, modal |
| `surface-2` (`bg-surface-2`) | `#E2E2DE` | `#262626` | Input, hover, baris tabel |
| `ink` (`text-ink`) | `#111111` | `#F2F2F0` | Teks utama, tombol utama (`bg-ink text-canvas`) |
| `ink-2` (`text-ink-2`) | `#4F4F4F` | `#A9A9A9` | Teks sekunder (kontras di atas 4.5:1 di kedua tema) |
| `line` (`border-line`) | `#D2D2CD` | `#2F2F2F` | Border dan pemisah |
| `accent` (`text-accent`, `bg-accent`) | `#C8102E` | `#FF5A4F` | Hanya: harga diskon/penting, badge jumlah keranjang, status error, fokus aktif |
| `ok` (`text-ok`) | `#17693B` | `#4CC38A` | Status sukses / stok tersedia / Selesai |
| `warn` (`text-warn`) | `#8A5600` | `#F2B84B` | Status menunggu / Pending |

Aturan:
- Palet inti: netral + 1 aksen merah (diambil dari warna sepatu di hero). Hijau dan kuning hanya untuk status, bukan dekorasi.
- Aksen tidak dipakai di semua tombol. Tombol utama memakai `ink`.
- Tema gelap bukan default; pengguna memilih lewat toggle di navbar (disimpan di `localStorage`, key `stride-theme`).
- Hero memakai tema per slide (atribut `data-theme` lokal), terlepas dari tema situs.

---

## 3. Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Display (`font-display`) | **Anton** | Condensed tebal ala poster sneaker, sama karakternya dengan headline di video |
| Teks (`font-sans`) | **Archivo** | Grotesk sporty yang tetap enak dibaca di ukuran kecil, cocok untuk harga dan tabel |

- Headline hero: `font-display uppercase leading-[0.9]`, `clamp(3rem, 7vw, 6.5rem)`.
- Judul section: `font-display uppercase text-3xl md:text-4xl`.
- Harga: `font-sans font-semibold tabular-nums`.
- Tidak memakai monospace sebagai gaya. Tidak memakai label uppercase dengan letter-spacing ekstrem.

---

## 4. Bentuk, Bayangan, Gerak

- Radius: `rounded-md` (6px) untuk tombol dan input, `rounded-xl` untuk kartu, `rounded-[28px]` hanya untuk bingkai hero.
- Bayangan: hanya bayangan lantai di bawah sepatu hero dan dropdown/modal (elevasi nyata). Kartu datar dengan border.
- Glass/blur: tidak dipakai, kecuali navbar sticky (`bg-canvas/90 backdrop-blur`).
- Gerak hero (lihat `src/components/home/HeroShowcase.jsx` dan `src/components/home/Sneaker3DCanvas.jsx`):
  - `curtain-wipe-left`: lapisan tema baru menyapu dari kanan ke kiri (`820ms cubic-bezier(0.65, 0, 0.25, 1)`), membelah headline menjadi dua warna tepat pada garis potong tirai.
  - `shoe-glide-in` & `shoe-glide-out`: sepatu lama bergeser ke kiri sambil sedikit meredup, sedangkan sepatu baru meluncur dari kanan ke tengah dengan rotasi pegas (`880ms`).
  - Tilt & 3D 360°: sepatu mengikuti posisi kursor dalam perspektif 3D, dan tombol `Aktifkan 3D Model 360°` mengaktifkan renderer WebGL Three.js (`public/models/shoe.glb`) yang dapat diputar 360 derajat dengan mouse/sentuhan.
  - Tidak ada autoplay dan tidak ada loop tanpa henti.
  - Semua gerak dimatikan saat `prefers-reduced-motion: reduce`.

---

## 5. Aset 3D Produk (Studio Render & GLB Model)

Hero menyediakan dua mode visual 3D di `public/hero/` dan `public/models/`:

| File | Produk / Fungsi | Tema slide |
|---|---|---|
| `public/hero/slide-1.webp` | Stride Air Max 270 Crimson (Studio 3D Cutout) | `red` |
| `public/hero/slide-2.webp` | Stride Air Max Alpha Stealth (Studio 3D Cutout) | `dark` |
| `public/hero/slide-3.webp` | Stride Air Max Excee White (Studio 3D Cutout) | `light` |
| `public/models/shoe.glb` | Model 3D GLB interaktif 360° (3 varian tekstur PBR: Red, Dark, Light) | Semua |

Cara mengganti: timpa file dengan nama yang sama (PNG/WebP latar transparan, rasio 1:1, minimal 1000x1000px, sepatu menghadap kiri), atau ubah path di `src/lib/hero-slides.js`.

---

## 6. Sumber Data Produk (API)

Sesuai dokumen "Sumber API Produk untuk Toko Fashion & Sneaker":

- **Utama: DummyJSON** (https://dummyjson.com/docs/products). Kategori yang dipakai: `mens-shoes`, `womens-shoes`, `mens-shirts`, `tops`, `womens-dresses`, `womens-bags`, `mens-watches`, `womens-watches`, `sunglasses`, `womens-jewellery`.
- **Tambahan: Fake Store API** (https://fakestoreapi.com/products) untuk variasi pakaian dan perhiasan.
- Data ditarik **sekali** lewat `scripts/seed-fashion.mjs` ke PostgreSQL, tidak dipanggil tiap halaman dibuka. Seller tetap bisa CRUD produk dan aplikasi tidak bergantung pada API saat presentasi.
- Harga USD dikonversi ke IDR (kurs tetap di skrip seed).

Pemetaan kategori toko:

| Slug kategori | Nama | Sumber |
|---|---|---|
| `sepatu-pria` | Sepatu Pria | DummyJSON `mens-shoes` |
| `sepatu-wanita` | Sepatu Wanita | DummyJSON `womens-shoes` |
| `pakaian-pria` | Pakaian Pria | DummyJSON `mens-shirts`, FakeStore `men's clothing` |
| `pakaian-wanita` | Pakaian Wanita | DummyJSON `tops`, `womens-dresses`, FakeStore `women's clothing` |
| `tas` | Tas | DummyJSON `womens-bags` |
| `jam-tangan` | Jam Tangan | DummyJSON `mens-watches`, `womens-watches` |
| `kacamata` | Kacamata | DummyJSON `sunglasses` |
| `perhiasan` | Perhiasan | DummyJSON `womens-jewellery`, FakeStore `jewelery` |

---

## 7. Pola Halaman

**Homepage**
1. Hero showcase (bagian 0 dan 4).
2. Strip kategori: nama kategori sebagai teks besar dengan jumlah produk asli dari database. Bukan kartu ikon.
3. Pilihan unggulan (`is_featured`), grid 4 kolom.
4. Baru masuk, grid 4 kolom, tautan ke katalog lengkap.

Tidak ada: statistik palsu, testimoni karangan, badge "100% original", countdown palsu.

**Kartu produk**: gambar di atas latar `surface-2` (produk transparan terlihat melayang), merek kecil, nama, harga, rating. Tombol tambah ke keranjang memakai `ink`.

**Product List dan Detail** (Baymard Apparel & Footwear UX): galeri besar di kiri, info di kanan, pilihan ukuran berupa tombol grid, rating di dekat judul.

**Cart dan Checkout** (Baymard Checkout UX, BelVG): halaman penuh, gambar, nama, harga satuan, qty, subtotal, total, tombol checkout jelas. Tanpa biaya tersembunyi.

**Order History dan Tracking** (Baymard): badge status konsisten di Buyer dan Seller, timeline sederhana, tombol "Beri Ulasan" hanya saat Selesai.

**Seller dan Admin**: tenang (ENERGY 2, MOTION 1). Layout dibangun dari tugas layar: daftar seller pending adalah fokus admin; pesanan masuk adalah fokus seller.

Sumber:
- https://baymard.com/research/apparel-and-accessories
- https://baymard.com/blog/current-state-of-checkout-ux
- https://belvg.com/blog/best-practices-for-ecommerce-shopping-carts.html
- https://baymard.com/ecommerce-design-examples/63-order-tracking-page
- https://baymard.com/blog/user-ratings-distribution-summary

---

## 8. Alur Multi-Peran (tetap dari spesifikasi)

- **Rating dan Review**: rata-rata bintang dekat judul, distribusi 1 sampai 5, form aktif hanya untuk order Selesai (validasi backend).
- **Register Seller dan Pending**: seller baru berstatus Pending, halaman "Akun Anda sedang ditinjau", tombol Hapus Akun jika ditolak (Webkul, Nautical Commerce).
- **Admin**: tabel user dengan filter peran, daftar seller pending dengan Approve/Reject, CRUD kategori, admin tidak bisa menghapus dirinya sendiri (Magento 2 Multi Vendor).

Sumber:
- https://webkul.com/blog/erpnext-multivendor-marketplace-documentation/
- https://nauticalcommerce.com/blog/effective-vendor-onboarding-process

---

## 9. Checklist Sebelum Menyerahkan UI

- [ ] Tidak ada hex warna langsung di komponen; semua lewat token.
- [ ] Kedua tema (terang dan gelap) dicek, kontras teks minimal 4.5:1.
- [ ] Semua tombol dan link punya tujuan nyata; ikon-saja punya `aria-label`.
- [ ] Ada state kosong, loading, dan error yang menyebut penyebab dan langkah berikutnya.
- [ ] Mobile: tidak ada overflow horizontal, target sentuh minimal 44px.
- [ ] Tidak ada em dash, emoji dekoratif, angka atau klaim tanpa sumber.
- [ ] Gambar punya `width`/`height`; gambar hero `fetchpriority="high"` dan tidak lazy.
