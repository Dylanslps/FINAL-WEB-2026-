# APEX ESPORTS // Official Tournament Gear Marketplace
> **Tugas Akhir Praktikum Pemrograman Web 2026**  
> Aplikasi E-Commerce Multi-Role Berbasis Next.js App Router, PostgreSQL (Raw SQL), dan Tailwind CSS.

---

## 🎯 Gambaran Umum Proyek

**APEX ESPORTS** adalah platform e-commerce perlengkapan turnamen esports (*apparel, mechanical keyboards, gaming mice, audio gear*). Proyek ini dibangun dari nol (*from scratch*) tanpa ORM guna memenuhi kriteria praktikum: performa query tinggi menggunakan PostgreSQL raw parameterized SQL, penanganan transaksi stok atomik, serta alur otentikasi multi-peran (*Multi-Role Lifecycle*).

Katalog produk secara otomatis ditarik dan diselaraskan dari internet public API (**DummyJSON Products API**) dengan visual gambar riil berkualitas tinggi.

---

## ⚡ Fitur Utama & Arsitektur Multi-Role

Sistem mendukung 4 tingkat akses peran dengan batas wewenang yang ketat:

| Peran | Status Akun | Hak Akses & Fitur |
| :--- | :--- | :--- |
| **Public / Guest** | N/A | Eksplorasi katalog, filter kategori, pencarian ILIKE, melihat ulasan dan rating produk Baymard. |
| **Buyer (Pembeli)** | `approved` | Keranjang belanja (*upsert* stok otomatis), checkout transaksi atomik PostgreSQL (`BEGIN`...`COMMIT`/`ROLLBACK`), riwayat pesanan dengan pelacak status, dan pemberian ulasan bintang 1-5 (hanya untuk pesanan berstatus *Selesai*). |
| **Seller (Penjual)** | `pending` | Mengisi form toko saat pendaftaran. Akun dibatasi di halaman status menunggu verifikasi (*Pending Review*) hingga disetujui Admin. Jika ditolak, tersedia opsi hapus akun mandiri. |
| **Seller (Penjual)** | `approved` | Mengelola toko, manajemen katalog produk (CRUD lengkap dengan gambar internet), dan memproses pesanan masuk (*Menunggu Pembayaran* ➔ *Diproses* ➔ *Selesai*). |
| **Super Admin** | `approved` | Pusat kendali utama (*Command Center*): Verifikasi/Tolak pendaftaran seller, moderasi katalog lintas toko, manajemen akun seluruh platform (dengan proteksi *self-delete*), dan CRUD kategori turnamen. |

---

## 🛠️ Tech Stack & Konfigurasi

- **Frontend & Routing:** Next.js 15 (App Router, React JSX)
- **Styling & UI:** Tailwind CSS v4 (Tema Esports Dark Palette `#0A0D14`, Neon Accents `#00F0FF`, `#FF5E00`, `#7928CA`)
- **Database:** PostgreSQL 15+ (Local via pgAdmin 4)
- **Database Driver:** `pg` (node-postgres) dengan `pg.Pool` & Parameterized Queries (`$1, $2, ...`)
- **Data Source & Assets:** DummyJSON API & Unsplash Remote CDN
- **Icons:** Lucide React

---

## 📋 Akun Uji Coba Cepat (Demo Testing Accounts)

Tersedia fitur **1-Click Test Account Switcher** di bagian navigasi atas (Navbar) dan halaman `/login` untuk memudahkan penguji/dosen mengecek seluruh alur peran secara instan:

| Role | Email | Password | Kegunaan Uji Coba |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@esports.com` | `admin123` | Uji coba verifikasi seller, moderasi produk & user |
| **Seller Approved** | `seller1@apexgear.com` | `seller123` | Toko Apex Gear (Kelola produk & order masuk) |
| **Seller Pending** | `seller3@pending.com` | `seller123` | Toko Budi Esports (Melihat status menunggu admin) |
| **Buyer** | `buyer@gmail.com` | `buyer123` | Keranjang belanja, checkout, beri ulasan bintang |

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat Sistem
- Node.js versi 18.18+ atau 20+
- PostgreSQL server (aktif di `localhost:5432`)
- pgAdmin 4 (opsional untuk GUI database)

### 2. Kloning Repositori
```bash
git clone https://github.com/Dylanslps/FINAL-WEB-2026-.git
cd FINAL-WEB-2026-
npm install
```

### 3. Konfigurasi Database (pgAdmin 4)
1. Buka **pgAdmin 4**, buat database baru bernama:
   ```sql
   final_esports_db
   ```
2. Buka **Query Tool** di database tersebut, lalu buka dan jalankan seluruh query DDL dari file:
   ```text
   database/schema.sql
   ```
   *Seluruh tabel (`users`, `stores`, `categories`, `products`, `cart_items`, `orders`, `order_items`, `reviews`, `wishlists`) dan index performa akan dibuat secara otomatis.*

### 4. Konfigurasi Variabel Lingkungan (`.env.local`)
Buat atau sesuaikan file `.env.local` pada direktori root proyek:
```env
DATABASE_URL=postgresql://postgres:dylan2007@localhost:5432/final_esports_db
PGHOST=localhost
PGPORT=5432
PGDATABASE=final_esports_db
PGUSER=postgres
PGPASSWORD=your_password
```

### 5. Seeding Data Awal dari Internet API
Jalankan script seeder otomatis untuk mengisi kategori, akun pengujian, toko resmi, serta produk esports dari DummyJSON API:
```bash
npm run db:seed
```

### 6. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses: **`http://localhost:3000`**

---

## 🗄️ Struktur Direktori Proyek

```text
├── database/
│   └── schema.sql             # Skema DDL relasional & index PostgreSQL
├── scripts/
│   └── seed-esports.mjs       # Seeder otomatis via DummyJSON API
├── src/
│   ├── app/
│   │   ├── admin/dashboard/   # Dashboard Super Admin
│   │   ├── api/               # API Routes (auth, cart, orders, reviews, seller, admin)
│   │   ├── cart/              # Keranjang belanja & formulir pengiriman
│   │   ├── katalog/           # Eksplorasi katalog, pencarian, dan filter
│   │   ├── login/             # Login multi-role dengan 1-click test bar
│   │   ├── orders/            # Riwayat pesanan pembeli
│   │   │   └── [id]/          # Pelacak pesanan (stepper) & form review bintang
│   │   ├── produk/[slug]/     # Halaman detail produk & ringkasan rating Baymard
│   │   ├── register/          # Registrasi multi-role (Buyer vs Seller)
│   │   ├── seller/
│   │   │   ├── dashboard/     # Dashboard Seller (CRUD produk & pesanan)
│   │   │   └── pending/       # Halaman peninjauan & opsi hapus akun ditolak
│   │   ├── layout.jsx         # Root layout, Navbar, Footer, Context Providers
│   │   └── page.jsx           # Landing page / Homepage turnamen
│   ├── components/            # Komponen UI modular (Navbar, Footer, Card, Modal, etc.)
│   ├── context/               # AuthContext & CartContext untuk sinkronisasi state
│   └── lib/                   # Database pool helper & Raw SQL service modules
├── package.json
└── README.md
```

---

## 🛡️ Keamanan & Kualitas Implementasi

1. **Anti SQL-Injection:** 100% interaksi database menggunakan parameter query (`$1, $2, ...`), tanpa konkatenasi string SQL mentah.
2. **Integritas Stok & Transaksi:** Transaksi checkout dijalankan di dalam blok transaksi atomik (`BEGIN` ➔ verifikasi stok ➔ insert pesanan & rincian ➔ potong stok ➔ bersihkan keranjang ➔ `COMMIT`). Jika stok tidak mencukupi, operasi dibatalkan seketika (`ROLLBACK`).
3. **Pemberian Ulasan Bersyarat:** Ulasan produk hanya dapat dibuat jika pembeli telah menyelesaikan pesanan (`status = 'Selesai'`).
4. **Proteksi Akun Administrator:** Logika server melarang keras akun admin menghapus akunnya sendiri demi mencegah kegagalan akses sistem.

---

## 👨‍💻 Pengembang
- **Nama:** Dylan
- **Mata Kuliah:** Praktikum Pemrograman Web 2026
- **Tahun:** 2026
