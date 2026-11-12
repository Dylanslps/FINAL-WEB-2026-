# Referensi Desain: E-Commerce Esports

Proyek final Praktikum Pemrograman Web 2026, Tema 1 (E-Commerce) dengan tema esports.
Stack: Next.js (JSX, Tailwind CSS) dan PostgreSQL (Raw SQL).
Peran: Admin, Seller, Buyer, Public User (Guest).

Dokumen ini memetakan referensi web ke kebutuhan di spesifikasi tugas. Setiap bagian memuat apa yang dipelajari dari referensi dan bagaimana penerapannya di proyek ini.

---

## Ringkasan Pemetaan

| Kebutuhan di spesifikasi | Referensi utama |
|---|---|
| Homepage Public/Buyer bertema esports | Seahawk Media, Tundra Esports, Muffin Group |
| Gaya visual dan toko tim besar (Vitality, Team Liquid, Fnatic, BTR) | Bagian 1B |
| Product List dan Product Details | Baymard Video Games UX |
| Rating dan Review pada produk | Baymard (ratings distribution), Smashing Magazine, CXL |
| Keranjang dan Checkout (Buyer) | Baymard Checkout UX, BelVG Cart UX |
| Order History dan Order Tracking | Baymard Order Tracking |
| Register Seller, Pending Seller Page, Seller Dashboard | Webkul (ERPNext), Nautical Commerce, Magento approval |
| Admin: verifikasi Seller, user, kategori | Magento approval, Webkul |
| Opsional: wishlist, filter, loyalitas | G2 Esports (FanBase) |

---

## 1. Homepage dan Identitas Visual Esports

**Kebutuhan:** Homepage Public User (produk + pencarian) dan Homepage Buyer (rekomendasi acak, Add to Cart, search bar).

- **Fnatic** (via Seahawk Media): menyeimbangkan merchandise, konten tim, dan update komunitas tanpa membuat pengguna kewalahan. Alurnya bergerak dari product drop ke konten pemain.
- **100 Thieves** (via Seahawk Media): homepage berfokus pada video, layout minimalis modern, dengan warna dan tipografi khas brand.
- **Tundra Esports Store** (eCorn): toko merch esports yang menekankan conversion rate dan desain yang rapi di semua breakpoint.
- **Muffin Group**: kumpulan contoh homepage brand gaming, dengan catatan bahwa navigasi yang disembunyikan hanya aman jika audiens tahu ke mana harus klik.

**Penerapan:**
- Hero banner dengan produk unggulan, lalu grid produk.
- Search bar yang jelas di header.
- Navigasi sederhana.
- Tema gelap dengan warna aksen khas esports.
- Gaya visual konsisten di semua halaman.

Sumber:
- https://seahawkmedia.com/design/esports-website-design-examples/
- https://ecorn.agency/cases/tundra
- https://muffingroup.com/blog/gaming-website-design/

---

## 1B. Studi Situs Tim Esports Besar

Tim-tim ini dipakai sebagai acuan gaya dan pola toko. Nama, logo, dan aset visual mereka tidak dipakai di aplikasi. Gunakan nama brand fiktif sendiri.

| Tim | Yang bisa dipelajari | Penerapan di proyek |
|---|---|---|
| **Team Vitality** | Toko Shopify Plus mereka dibangun Avex dengan fitur countdown untuk meningkatkan konversi. Markas mereka di Paris (V.Hive) menggabungkan kantor, toko, dan game café, dengan motif lebah yang konsisten di seluruh identitas brand. Pada 2025, Bigetron resmi menjadi "Bigetron by Vitality". | Banner "drop produk" dengan hitung mundur di homepage. Satu motif visual yang dipakai konsisten di logo, kartu, dan ikon. |
| **Team Liquid** | Situsnya dinilai terstruktur: jadwal match live, profil pemain, dan berita dalam antarmuka bersih dengan hierarki menu yang jelas. Toko resminya sudah mengalami pembaruan visual dan fungsional, dan punya toko terpisah per wilayah dengan desain yang diseragamkan. | Header dengan hierarki menu jelas. Halaman koleksi dan kategori yang bersih. Kartu produk sederhana. |
| **Fnatic** | Halaman toko Fnatic mengikuti identitas brand yang kuat. Katalog desain web mencatat Fnatic.com dibangun dengan Next.js, memakai font Druk Wide dan Helvetica Now, dengan palet gelap dan oranye. Mereka juga memakai model 3D jersey (Sketchfab) di e-commerce, menyediakan nama kustom pada jersey Pro Kit, dan mengadakan kontes desain dari fans ("Design Your Drip"). | Tema gelap dengan satu warna aksen dan judul tebal lebar. Ide opsional: pratinjau produk interaktif atau field personalisasi. |
| **BTR (Bigetron)** | Tidak ditemukan analisis desain situs resminya yang bisa dikutip. Yang terverifikasi: Bigetron berbasis Indonesia dan kini berada di bawah Vitality. | Buka situs resminya, lalu screenshot sendiri bagian homepage dan toko untuk dilampirkan sebagai referensi tambahan. |

Pola umum dari situs tim esports (Muffin Group): urutan navigasi yang lazim adalah roster, jadwal atau hasil, berita, toko, lalu tentang. Toko yang terkubur tiga klik dalam menu dianggap masalah bagi tim yang ingin menjual merch.

**Penerapan:** letakkan menu Toko/Produk di posisi utama navigasi. Untuk Public User, homepage bisa memadukan banner produk, grid produk, dan satu section konten bertema esports.

Sumber:
- https://seahawkmedia.com/design/esports-website-design-examples/
- https://avexdesigns.com/work/vitality
- https://madegooddesigns.com/?p=108348
- https://esports-news.co.uk/?p=86257
- https://store.teamliquid.com/blogs/news/welcome-to-our-new-store
- https://licensemag.com/entertainment/team-liquid-announces-launch-of-brazil-store-and-global-fortnite-collab
- https://fnatic.com/apparel/pro-kit-2023
- https://fnatic.com/news/design-your-drip-fnatic-x-alwaysfnatic
- https://sketchfab.com/blogs/enterprise/3d-configurators/fashion-fnatic
- https://maxibestof.one/websites/43484-fnatic
- https://muffingroup.com/blog/esports-website-design/

---

## 2. Product List dan Product Details

**Kebutuhan:** Product List (preview, nama, harga). Product Details (nama, harga, deskripsi, kategori, toko, tombol Add to Cart khusus Buyer, rating dan review).

- **Baymard Video Games UX**: riset dan contoh implementasi e-commerce video game, mencakup navigasi, pencarian, filter, halaman produk, checkout, dan akun.
- Baymard juga punya studi kasus per situs (Epic Games, GameStop) sebagai pembanding layout. Isi lengkapnya berbayar, jadi cukup gunakan bagian yang gratis.

**Penerapan:**
- Kartu produk: gambar, nama, harga, nama toko.
- Detail produk memuat semua field wajib dari spesifikasi.
- Guest hanya melihat detail, tombol Add to Cart diarahkan ke login.

Sumber:
- https://baymard.com/research/video-games
- https://baymard.com/industries/video-games-ux

---

## 3. Rating dan Review

**Kebutuhan:** Buyer memberi rating dan review setelah pesanan selesai, lalu ditampilkan di halaman produk.

- **Baymard**: 95% pengguna mengandalkan review untuk mengenal produk. Tanpa ringkasan distribusi rating di bagian atas, pengguna cenderung menilai produk dari beberapa review pertama saja.
- **Smashing Magazine**: pola yang berhasil adalah banyak review positif disertai sejumlah review negatif. Distribusi rating juga disarankan ditampilkan sebagai chart.
- **CXL**: tampilkan beberapa review yang mencakup berbagai sisi produk, sediakan sorting, dan taruh di area yang mudah ditemukan.
- **Contentsquare**: letakkan bintang rating di dekat bagian atas halaman produk.

**Penerapan:**
- Rata-rata bintang di dekat judul produk.
- Ringkasan distribusi 1 sampai 5 bintang.
- Daftar review dengan sorting.
- Form review hanya aktif jika order berstatus Selesai (validasi di backend).

Sumber:
- https://baymard.com/blog/user-ratings-distribution-summary
- https://shop.smashingmagazine.com/2023/01/product-reviews-ratings-ux/
- https://conversionxl.com/ecommerce-best-practices/guidelines-186-189/
- https://contentsquare.com/guides/ecommerce-ux/product-review-section/

---

## 4. Keranjang dan Checkout

**Kebutuhan:** Add to Cart, View Cart (jumlah dan total harga, ubah qty, hapus), Checkout membuat Order lalu cart dikosongkan. Tanpa payment gateway.

- **Baymard Checkout UX**: rata-rata cart abandonment sekitar 70%, dan desain checkout sering menjadi penyebab utama. Baymard merekomendasikan guest checkout yang menonjol. Di proyek ini, spesifikasi mewajibkan login untuk berinteraksi, jadi poin itu tidak diterapkan.
- **BelVG Cart UX**: membandingkan tipe cart (halaman penuh, mini cart, side panel). Halaman cart sebaiknya menampilkan gambar, nama, harga, total, dan jalur jelas ke checkout. Biaya yang tersembunyi dan pengiriman yang tidak jelas disebut sebagai pemicu abandonment.

**Penerapan:**
- Halaman cart penuh: gambar, nama, harga satuan, kontrol qty, subtotal, total, tombol Checkout yang jelas.
- Setelah checkout, tampilkan konfirmasi order dan kosongkan cart.

Sumber:
- https://baymard.com/blog/current-state-of-checkout-ux
- https://baymard.com/learn/checkout-flow-ux-optimization
- https://belvg.com/blog/best-practices-for-ecommerce-shopping-carts.html

---

## 5. Order History dan Order Tracking

**Kebutuhan:** Buyer melihat riwayat pesanan dan statusnya (Menunggu Pembayaran, Diproses, Selesai). Seller melihat pesanan masuk dan mengubah status.

- **Baymard Order Tracking**: fitur terkait order adalah alasan utama pengguna membuka area akun, termasuk tracking, riwayat, dan pembatalan. Masalah yang sering muncul: detail tracking sulit ditemukan, informasi kurang, dan istilah tidak jelas.

**Penerapan:**
- Halaman riwayat order dengan badge status berwarna.
- Istilah status konsisten di sisi Buyer dan Seller.
- Timeline status sederhana di detail order.
- Tombol "Beri Ulasan" muncul hanya saat status Selesai.

Sumber:
- https://baymard.com/ecommerce-design-examples/63-order-tracking-page

---

## 6. Register Seller, Pending Page, dan Seller Dashboard

**Kebutuhan:** Seller mendaftar dengan status Pending. Halaman Pending Seller berisi "Akun Anda sedang ditinjau", dan jika ditolak muncul tombol Delete Account. Setelah Approved, Seller mengelola toko, produk (CRUD), dan pesanan masuk.

- **Webkul (ERPNext Multivendor)**: seller baru berstatus Pending, dan selama menunggu ia hanya bisa mengubah profil dan toko. Daftar produk seller menampilkan stok dan status persetujuan.
- **Nautical Commerce**: alur onboarding terdiri dari lima tahap: registrasi, verifikasi, perjanjian, persetujuan, dan instruksi. Seller sebaiknya diberi tahu saat disetujui beserta langkah berikutnya.
- **Magento 2 Multi Vendor**: admin dapat menyetujui seller secara manual lewat daftar Manage Sellers.
- **Odoo Multi Vendor**: tiap seller punya halaman toko dan profil sendiri.
- **Shipturtle**: dashboard khusus vendor untuk produk, pesanan, dan inventori dianggap kunci pengalaman seller.

**Penerapan:**
- Register dengan pilihan peran Buyer atau Seller.
- Middleware yang mengarahkan Seller berstatus Pending atau Rejected ke halaman khusus (tanpa akses dashboard).
- Dashboard Seller dengan tiga area: Toko, Produk, Pesanan Masuk.

Sumber:
- https://webkul.com/blog/erpnext-multivendor-marketplace-documentation/
- https://nauticalcommerce.com/blog/effective-vendor-onboarding-process
- https://www.purpletreesoftware.com/knowledgebase/manual-automatic-product-and-vendor-approval-in-magento-2-multi-vendor-marketplace
- https://webkul.com/blog/odoo-multi-vendor-marketplace/
- https://www.shipturtle.com/blog/the-power-of-great-ux-in-building-a-successful-multi-vendor-marketplace

---

## 7. Admin Dashboard

**Kebutuhan:** Manajemen user (Buyer dan Seller), verifikasi Seller (Approve atau Reject), CRUD kategori, hapus produk yang melanggar.

- **Magento 2**: alur admin memilih seller dari daftar lalu menyetujuinya.
- **Webkul**: seller baru tampil dengan status Pending di panel admin.

**Penerapan:**
- Tabel user dengan filter peran.
- Daftar Seller Pending dengan tombol Approve dan Reject.
- Halaman CRUD kategori.
- Admin tidak dapat menghapus dirinya sendiri.

---

## 8. Fitur Opsional (Nilai Tambah)

- **Filter dan sorting produk** (kategori, harga): sesuai bagian Advanced Requirements di spesifikasi.
- **Wishlist** dan **alamat pengiriman**: sesuai spesifikasi, tampil di detail order.
- **Poin loyalitas** (ide tambahan, bukan syarat): G2 Esports menghubungkan pembelian di toko dengan poin di aplikasi fans, sehingga belanja merch meningkatkan engagement.

Sumber:
- https://fanbase.gg/unifying-fan-experiences-and-loyalty-through-shopify

---

## Catatan

- Referensi di atas dipakai sebagai inspirasi pola UX, bukan untuk disalin.
- Spesifikasi menyebut gambar dan data produk dapat diambil dari API e-commerce, jadi pilih API yang menyediakan gambar dan kategori untuk mengisi katalog bertema esports.
- Tidak semua kasus berasal dari esports. Beberapa (Baymard, Webkul, Nautical) berasal dari e-commerce umum dan marketplace, dipilih karena sesuai dengan alur Buyer, Seller, dan Admin di spesifikasi.
