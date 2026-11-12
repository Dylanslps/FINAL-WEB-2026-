-- =============================================================================
-- PROYEK FINAL PRAKTIKUM PEMROGRAMAN WEB 2026
-- TEMA 1: E-COMMERCE (ESPORTS GEAR & MERCHANDISE)
-- DATABASE SCHEMA (POSTGRESQL / PGADMIN 4)
-- =============================================================================

-- 1. Bersihkan tabel jika sudah ada sebelumnya (untuk re-run)
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================================================
-- TABEL: users
-- Mengakomodasi 3 peran terdaftar: admin, seller, buyer.
-- Status seller: pending (menunggu verifikasi admin), approved (disetujui), rejected (ditolak).
-- Status buyer & admin default: approved.
-- =============================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin', 'seller', 'buyer')),
    status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    phone VARCHAR(30),
    address TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABEL: stores
-- Toko resmi milik seller untuk menjual gear atau merchandise esports.
-- 1 seller memiliki 1 store (1-to-1 relationship).
-- =============================================================================
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABEL: categories
-- Kategori produk (Gaming Gear, Apparel & Jersey, Hardware, Accessories).
-- =============================================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABEL: products
-- Menyimpan katalog barang dengan dukungan gambar internet/API e-commerce.
-- =============================================================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT NOT NULL,
    api_source_id INT, -- ID referensi API eksternal (DummyJSON / FakeStore)
    brand VARCHAR(100),
    rating_avg NUMERIC(3, 2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABEL: cart_items
-- Keranjang belanja milik buyer sebelum lanjut ke checkout.
-- =============================================================================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    selected_variant VARCHAR(100),
    selected_color VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_buyer_product UNIQUE (buyer_id, product_id)
);

-- =============================================================================
-- TABEL: orders
-- Data transaksi pemesanan buyer tanpa payment gateway pihak ketiga.
-- Status: Menunggu Pembayaran, Diproses, Selesai, Dibatalkan.
-- =============================================================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Menunggu Pembayaran' 
        CHECK (status IN ('Menunggu Pembayaran', 'Diproses', 'Selesai', 'Dibatalkan')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABEL: order_items
-- Rincian produk dalam sebuah transaksi pesanan (snapshot harga & kuantitas).
-- =============================================================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    store_id INT NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    selected_variant VARCHAR(100),
    selected_color VARCHAR(100)
);

-- =============================================================================
-- TABEL: reviews
-- Ulasan & rating (bintang 1-5) dari buyer khusus untuk pesanan yang Selesai.
-- =============================================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_order_product_buyer UNIQUE (order_id, product_id, buyer_id)
);

-- =============================================================================
-- TABEL: wishlists (Nilai Tambah Opsional)
-- Menyimpan produk favorit yang disimpan oleh buyer.
-- =============================================================================
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_buyer_wishlist UNIQUE (buyer_id, product_id)
);

-- =============================================================================
-- INDEXING UNTUK OPTIMASI PERFORMA QUERY
-- =============================================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_cart_buyer ON cart_items(buyer_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
