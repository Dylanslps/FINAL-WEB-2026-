# STRIDE | Toko Sneaker dan Fashion

> **Tugas Akhir Praktikum Pemrograman Web 2026**  
> Aplikasi E-Commerce Multi-Role berbasis Next.js App Router, PostgreSQL (Raw SQL), dan Tailwind CSS v4.

---

## Gambaran Umum Proyek

**STRIDE** adalah platform marketplace sneaker, pakaian, tas, jam tangan, kacamata, dan perhiasan dengan arsitektur empat peran pengguna (*Public/Guest, Buyer, Seller, Admin*). Seluruh arah desain, token warna, tipografi, dan koreografi animasi hero terdokumentasi di `.agents/design/DESIGN.md`.

Katalog produk ditarik sekali lewat skrip seed Node.js (`scripts/seed-fashion.mjs`) dari **DummyJSON Products API** (10 kategori fashion & sepatu) dan **Fake Store API** ke PostgreSQL agar Seller tetap dapat melakukan CRUD produk dan aplikasi tidak bergantung pada koneksi API eksternal saat presentasi.

---

## Fitur Utama & Arsitektur Multi-Role

| Peran | Status Akun | Hak Akses & Fitur |
| :--- | :--- | :--- |
| **Public / Guest** | N/A | Eksplorasi hero showcase 3D interaktif, filter 8 kategori, pencarian `ILIKE`, detail produk, distribusi rating dan ulasan. |
| **Buyer (Pembeli)** | `approved` | Keranjang belanja (*upsert* kuantitas & ukuran), checkout transaksi atomik PostgreSQL (`BEGIN`...`COMMIT`/`ROLLBACK`), pelacak status pesanan, dan ulasan bintang 1 sampai 5 khusus pesanan berstatus *Selesai*. |
| **Seller (Penjual)** | `pending` / `rejected` | Mengajukan toko saat pendaftaran. Akun diarahkan ke halaman peninjauan (*Pending Approval*) hingga disetujui Admin. Jika ditolak, tersedia tombol hapus akun mandiri (*Delete Account*). |
| **Seller (Penjual)** | `approved` | Mengelola profil toko, CRUD katalog produk, dan memproses pesanan masuk (*Menunggu Pembayaran* -> *Diproses* -> *Selesai*). |
| **Admin** | `approved` | Verifikasi pengajuan seller (*Approve* / *Reject*), manajemen pengguna (dengan proteksi *self-delete*), CRUD kategori, dan moderasi produk lintas toko. |

---

## Tech Stack

- **Frontend & Routing:** Next.js 15 (App Router, React 19 JSX)
- **Styling & Tema:** Tailwind CSS v4 dengan sistem token CSS Variables (tema terang & gelap serta hero showcase adaptif)
- **Tipografi:** Anton (Display) & Archivo (Sans)
- **Database:** PostgreSQL dengan `pg` (`pg.Pool`) dan Parameterized Queries (`$1, $2, ...`)
- **Sumber Data Seed:** DummyJSON API & Fake Store API

---

## Akun Uji Coba Cepat (1-Click Switcher)

Tersedia pengalih peran 1 klik di menu akun pada Navbar dan halaman `/login`:

| Peran | Email | Password | Kegunaan Uji Coba |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@stride.id` | `admin123` | Verifikasi seller pending, moderasi produk, kategori & user |
| **Seller (Approved)** | `seller1@stride.id` | `seller123` | Toko Sole Vault Jakarta (CRUD produk & proses pesanan masuk) |
| **Seller (Pending)** | `seller3@pending.com` | `seller123` | Uji halaman menunggu verifikasi admin |
| **Buyer** | `buyer@gmail.com` | `buyer123` | Keranjang belanja, checkout transaksi, dan ulasan bintang |

---

## Panduan Instalasi & Menjalankan Proyek

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Database PostgreSQL
1. Buat database di PostgreSQL (misalnya `final_esports_db`) dan sesuaikan `.env.local`.
2. Jalankan skema DDL dari file `database/schema.sql`.
3. Jalankan seeder untuk menarik produk dari DummyJSON & Fake Store API:
   ```bash
   npm run db:seed
   ```

### 3. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka **`http://localhost:3000`** di browser.

---

## Mengganti Gambar 3D Hero

Saat ini hero memakai tiga gambar render 3D sepatu berlatar transparan di `public/hero/`:
- `public/hero/slide-1.webp`
- `public/hero/slide-2.webp`
- `public/hero/slide-3.webp`

Untuk menggantinya dengan foto 3D baru, cukup timpa file di `public/hero/` dengan nama yang sama (format PNG/WebP latar transparan, rasio 1:1) atau ubah konfigurasi di `src/lib/hero-slides.js`.
