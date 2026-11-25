# STRIDE — Premium Sneaker & Fashion Marketplace

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19_JSX-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-black?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4_Tokens-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Raw_SQL_Pool-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Role Auth](https://img.shields.io/badge/Multi--Role-4_User_Roles-4CAF50?style=for-the-badge)

**Tugas Akhir Praktikum Pemrograman Web 2026**  
*Platform E-Commerce Marketplace Sneaker, Custom Shoes, dan Fashion Modern dengan Showcase Model 3D Interaktif 360° & Arsitektur Database Multi-Role.*

</div>

---

## 📑 Daftar Isi

- [Gambaran Umum Proyek](#-gambaran-umum-proyek)
- [Fitur Unggulan & Inovasi Utama](#-fitur-unggulan--inovasi-utama)
- [Arsitektur Multi-Role & Hak Akses](#-arsitektur-multi-role--hak-akses)
- [Akun Uji Coba Cepat (1-Click Switcher)](#-akun-uji-coba-cepat-1-click-switcher)
- [Katalog Produk & Sneaker Ikonik](#-katalog-produk--sneaker-ikonik)
- [Tech Stack](#-tech-stack)
- [Struktur Direktori Proyek](#-struktur-direktori-proyek)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Dokumentasi Endpoint API](#-dokumentasi-endpoint-api)

---

## 🌟 Gambaran Umum Proyek

**STRIDE** adalah aplikasi e-commerce modern yang dirancang untuk menghadirkan pengalaman belanja sneaker dan fashion premium sekelas ritel global. Dibangun di atas **Next.js 15 (App Router)** dan **React 19**, didukung oleh **PostgreSQL** dengan *parameterized queries* bebas ORM untuk performa maksimal dan transaksi atomik ACID.

Aplikasi ini mengintegrasikan **model 3D Three.js WebGL** interaktif di panggung hero dan halaman detail produk, sistem toko mitra multi-seller (*Sole Vault Jakarta*, *Atelier Studio Bandung*, *Makassar Kicks*), panel admin yang komprehensif untuk moderasi produk dan manajemen pengguna, serta sistem ukuran ganda internasional (Eropa EU & Asia CM).

---

## ✨ Fitur Unggulan & Inovasi Utama

### 1. 🧊 3D Sneaker Showcase 360° (Three.js WebGL)
- Panggung visual interaktif berbasis Three.js dengan pencahayaan studio dinamis, *shadow plane*, dan *pointer tilt parallax*.
- Mode **3D Model 360°** yang memungkinkan pembeli memutar, melihat detail material, sol, dan artwork sepatu dari segala sudut secara langsung di browser tanpa plugin eksternal.
- Mendukung transisi tema adaptif (*Dark, Light, Gray*) dan animasi tirai *split-color wipe* dengan tipografi kondensasi bold.

### 2. 👟 Standar Ukuran Ganda (Eropa EU & Asia CM)
- Dilengkapi **switcher standar ukuran interaktif**:
  - **Eropa (EU)**: Rentang `EU 39` hingga `EU 44`.
  - **Asia (CM)**: Panjang kaki presisi Asia `24.5 cm` hingga `28.0 cm`.
- Setiap tombol menampilkan hierarki ukuran utama dan konversi sekundernya secara otomatis.
- Ukuran yang masuk ke keranjang belanja dan faktur tercatat lengkap: `EU 40 · Asia 25.0 cm`.

### 3. 🎨 Multi-Variant Color Switcher Real-Time
- Transisi foto seketika saat pembeli memilih warna (misal: *Blue Chrome Hearts AF1* beralih ke edisi *Pink Chrome Hearts AF1*, atau *Nike AF1 '07 Putih* ke *Hitam*).
- Judul produk, badge status, dan thumbnail galeri berubah secara otomatis tanpa *reload* halaman.
- Produk dengan satu varian warna konsisten menampilkan opsi tunggal terverifikasi: **`[ Sesuai Foto ]`**.

### 4. 🛡️ Panel Admin Lengkap (Moderasi & Kontrol Katalog Penuh)
- **Tambah Produk Baru**: Admin dapat menambahkan produk langsung ke toko seller mana pun dengan memilih toko mitra, kategori, nama, merek, harga, stok, URL gambar (dengan *live thumbnail preview*), dan deskripsi.
- **Edit & Pengaturan Toko Penjual**: Mengubah toko tempat produk bernaung, memindahkan kategori produk, mengubah harga jual, dan memperbarui jumlah stok.
- **Verifikasi Seller Pending**: Menyetujui (*Approve*) atau menolak (*Reject*) pendaftaran akun penjual baru.
- **Manajemen Pengguna & Kategori**: Mengatur peran akun (*Buyer, Seller, Admin*), proteksi anti-*self-delete*, serta CRUD kategori produk.

### 5. 🛒 Transaksi Atomik & Keranjang Belanja Cerdas
- Penambahan produk ke keranjang belanja dengan *upsert* kuantitas, ukuran, dan varian warna terpilih.
- Proses Checkout menggunakan **transaksi atomik PostgreSQL** (`BEGIN` ... `COMMIT` / `ROLLBACK`) untuk memastikan pengurangan stok barang dan pembuatan pesanan tervalidasi secara konsisten.
- Pelacak status pesanan (*Menunggu Pembayaran* $\rightarrow$ *Diproses* $\rightarrow$ *Selesai*).
- Sistem ulasan & rating bintang 1–5 eksklusif untuk pembeli terverifikasi setelah pesanan berstatus *Selesai*.

---

## 👥 Arsitektur Multi-Role & Hak Akses

| Peran Pengguna | Status Akun | Hak Akses & Fitur Utama |
| :--- | :--- | :--- |
| **Public / Guest** | N/A | Eksplorasi katalog, pencarian produk, filter kategori, melihat showcase 3D interaktif, ulasan pembeli. |
| **Buyer (Pembeli)** | `approved` | Mengelola keranjang belanja, checkout transaksi atomik, melihat riwayat pesanan, memberikan ulasan & rating. |
| **Seller (Pending)** | `pending` / `rejected` | Menunggu persetujuan Admin. Jika ditolak, tersedia opsi hapus akun mandiri (*Delete Account*). |
| **Seller (Approved)** | `approved` | Dashboard toko khusus: mengelola profil toko, CRUD produk dagangan, memproses pesanan masuk dari pembeli. |
| **Admin** | `approved` | Dashboard admin komprehensif: verifikasi seller, CRUD kategori, moderasi & mutasi produk antar toko, manajemen pengguna. |

---

## 🔑 Akun Uji Coba Cepat (1-Click Switcher)

Tersedia tombol **Pengalih Akun 1-Klik** di menu profil Navbar dan halaman `/login` untuk memudahkan pengujian seluruh peran:

| Peran | Email | Password | Kegunaan Pengujian |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@stride.id` | `admin123` | Tambah & edit produk katalog, atur toko/harga/stok, approve seller, kelola user & kategori |
| **Seller (Approved)** | `seller1@stride.id` | `seller123` | Dashboard toko *Sole Vault Jakarta* (CRUD produk toko & update status pesanan) |
| **Seller (Approved)** | `seller2@stride.id` | `seller123` | Dashboard toko *Atelier Studio Bandung* |
| **Seller (Pending)** | `seller3@pending.com` | `seller123` | Uji tampilan peninjauan toko menunggu verifikasi admin |
| **Buyer** | `buyer@gmail.com` | `buyer123` | Keranjang belanja, checkout atomik, riwayat pesanan, rating & ulasan bintang |

---

## 👟 Katalog Produk & Sneaker Ikonik

Katalog produk STRIDE mencakup sneaker edisi koleksi terbatas (*Custom Shoes*), lini performa basket, dan fashion harian:

1. **Royal Gray LV Air Force 1** (`/produk/nike-air-jordan-1-red-and-black`):
   - Kategori: *Custom Shoes*
   - Harga: Rp 6.850.000 | Toko: Sole Vault Jakarta
   - Fitur: Material kulit motif monogram Louis Vuitton x Off-White, rantai gantungan emas LV, tali cetak "LACET", model 3D `lv-af1.glb`.
2. **Blue Chrome Hearts Air Force 1** (`/produk/puma-future-rider-trainers`):
   - Kategori: *Custom Shoes*
   - Harga: Rp 4.346.916,99 | Toko: Sole Vault Jakarta
   - Fitur: Varian warna ganda (*Blue Ice* dan *Pastel Pink*), patch salib Gothic kulit timbul, seni heel "God Bless", model 3D `chrome-hearts-af1.glb`.
3. **Nike Air Force 1 '07** (`/produk/sports-sneakers-off-white-red`):
   - Kategori: *Sepatu Pria*
   - Harga: Rp 1.919.840 | Toko: Sole Vault Jakarta
   - Fitur: Warna klasik *All-White* & *Triple Black*, siluet ikonik 1982, deubré perak AF1, standar ukuran EU 39–44 & Asia 24.5–28 cm, model 3D `shoe.glb`.
4. **Nike Dunk Low Retro Panda** (`/produk/nike-dunk-low-retro-panda`):
   - Kategori: *Sepatu Pria*
   - Harga: Rp 2.199.000 | Toko: Sole Vault Jakarta
   - Fitur: Siluet legendaris hitam-putih (*two-tone monochrome*), bantalan empuk harian.
5. **Nike Baseball Cleats** (`/produk/nike-baseball-cleats`):
   - Kategori: *Sepatu Pria*
   - Harga: Rp 1.279.840 | Toko: Sole Vault Jakarta
   - Fitur: Traksi lapangan maksimal (*cleat studs*), kombinasi warna hijau pinus dan putih.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React Server Components & Client Components)
- **UI Library**: [React 19](https://react.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) (WebGL Canvas, OrbitControls, GLTFLoader, MeshoptDecoder)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan CSS Variables Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (koneksi via pooling `pg` / `pg.Pool`)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) & OpenCV Python

---

## 📁 Struktur Direktori Proyek

```text
FINAL WEB 2026/
├── database/
│   └── schema.sql              # Skema DDL tabel PostgreSQL, relasi, & indeks
├── public/
│   ├── hero/                   # Aset gambar sneaker studio (PNG transparan)
│   │   ├── lv-af1.png
│   │   ├── chromehearts.png
│   │   ├── chromehearts-pink.png
│   │   ├── af1-pair-front.png  # Sepasang tampak depan Nike AF1 '07
│   │   ├── dunk-panda-pair.png # Sepasang tampak depan Dunk Panda
│   │   └── nike-baseball-cleats.png
│   └── models/                 # Model 3D biner GLB teroptimasi
│       ├── lv-af1.glb
│       ├── chrome-hearts-af1.glb
│       └── shoe.glb
├── scripts/
│   ├── seed-fashion.mjs        # Skrip seeder database (API DummyJSON & Fake Store)
│   └── update-hero-db.mjs      # Migrasi data katalog sneaker unggulan
├── src/
│   ├── app/                    # Next.js App Router (Halaman & API Routes)
│   │   ├── admin/dashboard/    # Panel Admin (Moderasi produk, seller, user, kategori)
│   │   ├── api/                # API Endpoints (admin, auth, cart, orders, products, reviews, seller)
│   │   ├── seller/dashboard/   # Dashboard Penjual (Profil toko, produk, pesanan)
│   │   ├── katalog/            # Katalog produk publik dengan filter kategori
│   │   ├── produk/[slug]/      # Halaman detail produk (Showcase 3D, varian, ukuran, ulasan)
│   │   ├── keranjang/          # Keranjang belanja pembeli
│   │   ├── checkout/           # Checkout transaksi atomik
│   │   └── pesanan/            # Pelacak status pesanan pembeli
│   ├── components/
│   │   ├── admin/              # Komponen tabel, modal tambah/edit produk, dan statistik admin
│   │   ├── home/               # HeroShowcase, Sneaker3DCanvas, Carousel banner
│   │   ├── product/            # ProductHeroSection, ProductSpecsTable, RecommendedProducts
│   │   ├── Navbar.jsx          # Navigasi utama dengan 1-click account switcher & dark mode
│   │   ├── Footer.jsx          # Informasi toko dan navigasi bawah
│   │   └── ProductCard.jsx     # Kartu produk katalog
│   ├── context/
│   │   ├── AuthContext.jsx     # State manajemen autentikasi & peran pengguna
│   │   └── CartContext.jsx     # State manajemen keranjang belanja & sinkronisasi
│   └── lib/
│       ├── db.js               # Konfigurasi koneksi PostgreSQL Pool
│       ├── admin.js            # Query modul admin (tambah/edit produk, approve seller, user, kategori)
│       ├── products.js         # Query katalog produk & filter pencarian
│       ├── cart.js             # Query manipulasi keranjang belanja
│       ├── orders.js           # Transaksi checkout atomik (BEGIN-COMMIT-ROLLBACK)
│       └── hero-slides.js      # Konfigurasi metadata slide panggung hero
├── .env.example              # Template konfigurasi environment (DATABASE_URL, Port)
├── .env.local                # Konfigurasi environment variabel lokal (diabaikan Git)
├── .gitignore                  # Berkas pengecualian Git
├── package.json
└── README.md
```

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat Sistem
- **Node.js**: Versi 18.18.0 atau lebih baru (direkomendasikan Node.js v20+)
- **PostgreSQL**: Server PostgreSQL aktif di mesin lokal atau cloud (port default `5432`)
- **Git**

### 2. Kloning Repositori & Instal Dependensi
```bash
git clone https://github.com/Dylanslps/FINAL-WEB-2026-.git
cd "FINAL WEB 2026"
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas template `.env.example` menjadi `.env.local`:
```bash
# Pengguna Linux / macOS / Git Bash:
cp .env.example .env.local

# Pengguna Windows (PowerShell):
Copy-Item .env.example .env.local
```
Buka berkas `.env.local` dan sesuaikan password PostgreSQL Anda:
```env
DATABASE_URL=postgresql://postgres:password_anda@localhost:5432/STRIDE
```
*(Ganti `password_anda` dengan password user `postgres` pada PostgreSQL lokal Anda. Jika port atau username berbeda, sesuaikan juga).*

### 4. Inisialisasi Database Otomatis & Seeder
Cukup jalankan satu perintah seeder berikut:
```bash
npm run db:seed
```
> [!NOTE]
> Skrip seeder (`scripts/seed-fashion.mjs`) secara otomatis:
> 1. Mendeteksi dan membuat database `STRIDE` di server PostgreSQL Anda jika belum ada.
> 2. Menerapkan seluruh DDL skema relasional dari `database/schema.sql` (tabel, relasi, constraint, indeks, dan 4 akun demo default).
> 3. Menarik serta memetakan katalog fashion dari API DummyJSON dan Fake Store ke kategori lokal.
> 4. Mengonfigurasi produk sneaker unggulan dan model 3D interaktif.

*(Opsional: Jika ingin mengeksekusi manual via GUI pgAdmin 4 / psql CLI, buat database `STRIDE` lalu jalankan berkas `database/schema.sql`).*

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Akses aplikasi melalui browser di: **`http://localhost:3000`**.

---

## 🔌 Dokumentasi Endpoint API

| Method | Endpoint | Fungsi | Peran Minimum |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth` | Login akun & pendaftaran pembeli/penjual | Publik |
| `GET` | `/api/products` | Mengambil katalog produk dengan filter kategori & pencarian | Publik |
| `GET` | `/api/cart` | Mengambil isi keranjang belanja pembeli aktif | Buyer |
| `POST` | `/api/cart` | Menambah produk atau varian ukuran/warna ke keranjang | Buyer |
| `PATCH` | `/api/cart` | Mengubah kuantitas item dalam keranjang | Buyer |
| `DELETE` | `/api/cart` | Menghapus item tertentu dari keranjang | Buyer |
| `POST` | `/api/orders` | Checkout transaksi atomik pembuatan pesanan baru | Buyer |
| `GET` | `/api/orders` | Mengambil riwayat transaksi pesanan pembeli | Buyer |
| `POST` | `/api/reviews` | Mengirim rating dan ulasan bintang pesanan selesai | Buyer |
| `GET` | `/api/seller` | Mengambil data toko, produk, dan pesanan masuk seller | Seller |
| `POST` | `/api/seller` | Update status pesanan atau CRUD produk seller | Seller |
| `GET` | `/api/admin` | Mengambil data statistik, seller pending, user, kategori, dan seluruh produk toko | Admin |
| `POST` | `/api/admin` | Tambah produk baru, edit toko/harga/stok/kategori, approve/reject seller, kelola user & kategori | Admin |

---

<div align="center">

**Dikembangkan oleh Dylan — Tugas Akhir Praktikum Pemrograman Web 2026**  
*STRIDE Marketplace © 2026. Seluruh hak cipta dilindungi.*

</div>
