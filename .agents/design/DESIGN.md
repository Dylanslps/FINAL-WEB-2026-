# Panduan Desain & Sistem UX: E-Commerce Esports

Proyek Final Praktikum Pemrograman Web 2026
Tema: INDIVIDUAL PROJECT 1 - E-COMMERCE (ESPORTS GEAR & MERCHANDISE)
Stack: Next.js (JSX, Tailwind CSS) & PostgreSQL (Raw SQL)
Peran: Public User (Guest), Buyer, Seller (Pending/Approved/Rejected), Admin

---

## 1. Identitas Visual & Arah Gaya (Brand Direction)

* **Tema Visual:** Dark Mode Pro Gaming & Esports Arena. Terinspirasi oleh situs esports global (Fnatic, Team Liquid, Tundra Esports).
* **Palet Warna:**
  * Background Utama: `#0B0E14` (Deep Obsidian / Zinc 950)
  * Background Kartu & Panel: `#151A23` (Dark Slate / Zinc 900)
  * Border / Pembatas: `#262E3D` (Subtle Slate Border)
  * Warna Aksen Utama: `#00F0FF` (Electric Cyan / Neon Blue - status, hover, glow aktif)
  * Warna Aksen Sekunder: `#FF5E00` (Tournament Orange / Amber - tombol aksi, badge drop, diskon)
  * Teks Utama: `#F3F4F6` (Off-white / High contrast)
  * Teks Muted: `#9CA3AF` (Muted grey)
* **Tipografi:** Sans-serif tegas, font heading tebal bernuansa modern esports, hierarki jelas antara judul produk, harga, dan spesifikasi teknis.
* **Prinsip Anti-Slop:**
  * Hindari gradien pelangi mengambang tanpa fungsi.
  * Setiap kartu produk memiliki proporsi gambar yang konsisten, label harga tegas, dan nama toko penjual.
  * Informasi penting (harga, stok, rating) langsung terbaca tanpa dekorasi berlebihan.

---

## 2. Pemetaan Fitur & Referensi UX

| Kebutuhan Spesifikasi | Referensi UX | Penerapan di Aplikasi |
|---|---|---|
| **Homepage Public / Buyer** | Seahawk Media, Tundra Esports, Fnatic | Hero banner produk unggulan (Drop eksklusif), countdown timer interaktif, quick search bar, grid katalog terpopuler |
| **Gaya Toko Tim Besar** | Vitality, Team Liquid, Fnatic | Navigasi menu utama jelas: Gear, Apparel, Hardware, Toko Resmi; tema gelap konsisten; nama toko & brand fiktif (*Apex Pro Gaming*, *Nexus Merch*) |
| **Product List & Details** | Baymard Video Games UX | Kartu produk: preview gambar internet resolusi tinggi, harga IDR, rating bintang, stok real-time, tab deskripsi & spesifikasi gear |
| **Rating & Review Produk** | Baymard Ratings, Smashing Magazine, CXL | Rata-rata bintang di dekat judul produk, grafik distribusi rating (bintang 5 s/d 1), daftar ulasan pembeli, form ulasan hanya aktif jika pesanan berstatus Selesai |
| **Keranjang & Checkout** | Baymard Checkout UX, BelVG Cart UX | Halaman cart transparan: kontrol kuantitas (+/-), hapus item, subtotal per toko, form alamat pengiriman, checkout membuat order tanpa payment gateway |
| **Order History & Tracking** | Baymard Order Tracking | Badge status berwarna (*Menunggu Pembayaran*, *Diproses*, *Selesai*), timeline sederhana, tombol "Beri Ulasan" khusus produk pada pesanan Selesai |
| **Seller Onboarding & Dashboard** | Webkul Multi-Vendor, Nautical Commerce | Form pendaftaran Seller; Halaman peninjauan (*Pending*) dan tombol hapus akun jika ditolak (*Rejected*); Dashboard toko (manajemen produk & pesanan masuk) |
| **Admin Panel** | Magento Approval, Webkul | Verifikasi seller (Approve / Reject), manajemen akun user, CRUD kategori produk, penghapusan produk melanggar |
| **Fitur Nilai Tambah** | G2 Esports FanBase | Pencarian cepat (`ILIKE`), filter kategori, pengurutan harga/rating |

---

## 3. Detail Pola Halaman (Page Patterns)

### A. Homepage (Public / Buyer)
* **Header Navigasi:** Logo platform esports, menu kategori produk, form pencarian, ikon keranjang belanja (dengan counter jumlah item), tombol Login/Register atau Avatar profil.
* **Hero Section:** Banner rilis gear/jersey terbaru dengan tombol call-to-action (CTA) langsung ke katalog.
* **Featured Drop Section:** Sorotan produk unggulan pilihan kurasi turnamen.
* **Product Grid:** Tampilan kartu katalog responsif (grid 1 kolom di mobile, 3-4 kolom di desktop) dengan filter kategori cepat.

### B. Halaman Detail Produk (`/produk/[slug]`)
* **Galeri Gambar:** Gambar produk utama yang ditarik dari API internet (DummyJSON / CDN).
* **Blok Informasi:** Nama produk, badge kategori, nama toko penjual, harga dalam format Rupiah, status stok ketersediaan.
* **Tombol Add to Cart:**
  * Untuk Buyer: Tombol aktif dengan pemilih kuantitas.
  * Untuk Guest: Tombol yang mengarahkan pengguna ke halaman Login.
* **Review & Rating Section:**
  * Skor rata-rata bintang.
  * Bar distribusi persentase bintang (5, 4, 3, 2, 1) sesuai riset Baymard.
  * Daftar komentar ulasan dari pembeli terverifikasi.

### C. Keranjang & Checkout
* Rincian item dengan thumbnail gambar, harga satuan, tombol tambah/kurang qty, dan subtotal.
* Ringkasan belanja dan form alamat pengiriman.
* Konfirmasi pesanan seketika yang mengarahkan pembeli ke halaman Riwayat Pesanan (*Order History*).

### D. Dashboard Seller
* Tiga area navigasi:
  1. **Profil Toko:** Nama toko, deskripsi, dan logo.
  2. **Kelola Produk:** Tabel produk milik seller, tombol tambah produk baru, edit harga/stok, dan hapus.
  3. **Pesanan Masuk:** Daftar order pembeli untuk produk toko ini beserta tombol pembaruan status pesanan (*Diproses*, *Selesai*).

### E. Dashboard Admin
* **Tab Verifikasi Seller:** Menampilkan seller dengan status `pending` dengan tombol tindakan cepat **Approve** (menyetujui dan mengaktifkan toko) atau **Reject** (menolak).
* **Tab Pengguna:** Daftar akun (Admin, Seller, Buyer) dengan filter peran.
* **Tab Kategori:** Tambah kategori baru, edit nama/slug, dan hapus kategori yang kosong.

---

## 4. Batasan & Catatan Proyek
* Seluruh data produk dan gambar ditarik dari API e-commerce internet (DummyJSON) atau URL CDN internet agar tidak membebani penyimpanan lokal.
* Tidak menggunakan payment gateway pihak ketiga (alur transaksi diselesaikan via status pesanan di database).
* Semua query data menggunakan **Raw SQL Parameterized** via `pg` Pool untuk memenuhi kriteria evaluasi praktikum.
