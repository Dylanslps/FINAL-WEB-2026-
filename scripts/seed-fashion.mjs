import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('[SEED ERROR] DATABASE_URL tidak ditemukan. Pastikan ada di .env.local.');
  process.exit(1);
}

async function ensureDatabaseExists(connectionString) {
  const url = new URL(connectionString);
  const dbName = decodeURIComponent(url.pathname.replace(/^\//, ''));
  const adminUrl = new URL(connectionString);
  adminUrl.pathname = '/postgres';

  const adminClient = new pg.Client({ connectionString: adminUrl.toString() });
  await adminClient.connect();
  try {
    const check = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (check.rowCount === 0) {
      const safeIdent = `"${dbName.replace(/"/g, '""')}"`;
      console.log(`[SEED] Membuat database ${safeIdent}...`);
      await adminClient.query(`CREATE DATABASE ${safeIdent}`);
    }
  } finally {
    await adminClient.end();
  }
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

const USD_TO_IDR = 16000;

const DUMMYJSON_CATEGORY_MAP = {
  'mens-shoes': 'sepatu-pria',
  'womens-shoes': 'sepatu-wanita',
  'mens-shirts': 'pakaian-pria',
  'tops': 'pakaian-wanita',
  'womens-dresses': 'pakaian-wanita',
  'womens-bags': 'tas',
  'mens-watches': 'jam-tangan',
  'womens-watches': 'jam-tangan',
  'sunglasses': 'kacamata',
  'womens-jewellery': 'perhiasan',
};

const FAKESTORE_CATEGORY_MAP = {
  "men's clothing": 'pakaian-pria',
  "women's clothing": 'pakaian-wanita',
  'jewelery': 'perhiasan',
};

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'STRIDE-Seed/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} untuk ${url}`);
  return res.json();
}

async function runSeed() {
  console.log('[SEED] Memulai inisialisasi database STRIDE & penarikan API (DummyJSON + Fake Store)...');
  await ensureDatabaseExists(process.env.DATABASE_URL);
  await client.connect();

  try {
    console.log('[SEED] Menerapkan skema database/schema.sql...');
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'database', 'schema.sql'), 'utf8');
    await client.query(schemaSql);

    // 1. Insert Users (Admin, Approved Sellers, Pending Seller, Rejected Seller, Buyer)
    console.log('[SEED] Membuat akun pengguna...');
    const userRes = await client.query(`
      INSERT INTO users (name, email, password, role, status, phone, address)
      VALUES 
        ('Admin Stride', 'admin@stride.id', 'admin123', 'admin', 'approved', '081234567890', 'Jl. Jend. Sudirman No. 12, Jakarta Pusat'),
        ('Raka Pratama', 'seller1@stride.id', 'seller123', 'seller', 'approved', '081234567891', 'Jl. Senopati No. 10, Jakarta Selatan'),
        ('Nadia Kusuma', 'seller2@stride.id', 'seller123', 'seller', 'approved', '081234567892', 'Jl. Braga No. 24, Bandung'),
        ('Budi Santoso', 'seller3@pending.com', 'seller123', 'seller', 'pending', '081234567893', 'Jl. Pengayoman No. 5, Makassar'),
        ('Andi Wijaya', 'seller4@rejected.com', 'seller123', 'seller', 'rejected', '081234567894', 'Jl. Pemuda No. 9, Surabaya'),
        ('Dylan Buyer', 'buyer@gmail.com', 'buyer123', 'buyer', 'approved', '081234567895', 'Jl. Perintis Kemerdekaan KM 10, Makassar')
      RETURNING id, name, email, role, status;
    `);
    const users = userRes.rows;
    const seller1 = users.find((u) => u.email === 'seller1@stride.id');
    const seller2 = users.find((u) => u.email === 'seller2@stride.id');
    const seller3 = users.find((u) => u.email === 'seller3@pending.com');
    const buyer1 = users.find((u) => u.email === 'buyer@gmail.com');

    // 2. Insert Stores
    console.log('[SEED] Membuat toko seller...');
    const storeRes = await client.query(
      `INSERT INTO stores (seller_id, name, slug, description, logo_url, banner_url)
       VALUES 
         ($1, 'Sole Vault Jakarta', 'sole-vault-jakarta',
          'Kurator sneaker pria, sepatu lari, dan jam tangan pilihan di Jakarta Selatan.',
          'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp',
          'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/2.webp'),
         ($2, 'Atelier Studio Bandung', 'atelier-studio-bandung',
          'Koleksi kemeja harian, dress, tas kulit, kacamata, dan perhiasan dari Bandung.',
          'https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/1.webp',
          'https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/2.webp'),
         ($3, 'Makassar Kicks', 'makassar-kicks',
          'Toko sepatu kasual dan kaus harian berbasis di Makassar.',
          null, null)
       RETURNING id, name, seller_id;`,
      [seller1.id, seller2.id, seller3.id]
    );
    const store1Id = storeRes.rows.find((s) => s.seller_id === seller1.id).id;
    const store2Id = storeRes.rows.find((s) => s.seller_id === seller2.id).id;

    // 3. Insert Categories (8 kategori sesuai DESIGN.md & PDF API)
    console.log('[SEED] Membuat 8 kategori fashion & sneaker...');
    const catRes = await client.query(`
      INSERT INTO categories (name, slug, description)
      VALUES 
        ('Sepatu Pria', 'sepatu-pria', 'Sneaker basket, sepatu lari, dan sepatu olahraga pria.'),
        ('Sepatu Wanita', 'sepatu-wanita', 'Sepatu kasual, heels, dan alas kaki harian wanita.'),
        ('Custom Shoes', 'custom-shoes', 'Koleksi sneaker custom eksklusif, edisi kolaborasi desainer, dan seni artwork terbatas.'),
        ('Pakaian Pria', 'pakaian-pria', 'Kemeja lengan pendek, flanel, kaus, dan jaket pria.'),
        ('Pakaian Wanita', 'pakaian-wanita', 'Atasan harian, dress, dan jaket kasual wanita.'),
        ('Tas', 'tas', 'Tas tangan, ransel, dan tas bahu untuk aktivitas harian.'),
        ('Jam Tangan', 'jam-tangan', 'Jam tangan analog, chronograph, dan strap kulit.'),
        ('Kacamata', 'kacamata', 'Kacamata hitam dan bingkai pelindung UV.'),
        ('Perhiasan', 'perhiasan', 'Anting, gelang, dan cincin perak serta emas.')
      RETURNING id, slug, name;
    `);
    const catMap = {};
    for (const cat of catRes.rows) {
      catMap[cat.slug] = cat.id;
    }

    // 4. Tarik Produk dari DummyJSON API (10 kategori)
    console.log('[SEED] Menarik produk dari DummyJSON API...');
    const rawItems = [];
    for (const [apiCat, localCatSlug] of Object.entries(DUMMYJSON_CATEGORY_MAP)) {
      try {
        const data = await fetchJson(`https://dummyjson.com/products/category/${apiCat}`);
        for (const item of data.products || []) {
          const isShoeOrWatch = ['sepatu-pria', 'jam-tangan', 'pakaian-pria'].includes(localCatSlug);
          rawItems.push({
            storeId: isShoeOrWatch ? store1Id : store2Id,
            catSlug: localCatSlug,
            name: item.title,
            baseSlug: toSlug(item.title),
            desc: item.description,
            price: Math.round(Number(item.price) * USD_TO_IDR),
            stock: item.stock ?? 20,
            imageUrl: (item.images && item.images[0]) || item.thumbnail,
            apiSourceId: item.id,
            brand: item.brand || 'Stride Studio',
            ratingAvg: Number(item.rating || 4.5).toFixed(2),
            ratingCount: Array.isArray(item.reviews) ? item.reviews.length : 3,
            isFeatured: ['mens-shoes'].includes(apiCat),
          });
        }
      } catch (err) {
        console.warn(`[SEED WARN] Gagal mengambil DummyJSON kategori ${apiCat}:`, err.message);
      }
    }

    // 5. Tarik Produk tambahan dari Fake Store API
    console.log('[SEED] Menarik variasi produk dari Fake Store API...');
    try {
      const fakeItems = await fetchJson('https://fakestoreapi.com/products');
      for (const item of fakeItems || []) {
        const localCatSlug = FAKESTORE_CATEGORY_MAP[item.category];
        if (!localCatSlug) continue; // lewati electronics
        const isMen = localCatSlug === 'pakaian-pria';
        rawItems.push({
          storeId: isMen ? store1Id : store2Id,
          catSlug: localCatSlug,
          name: item.title,
          baseSlug: toSlug(item.title),
          desc: item.description,
          price: Math.round(Number(item.price) * USD_TO_IDR),
          stock: item.rating?.count ? Math.min(item.rating.count, 50) : 18,
          imageUrl: item.image,
          apiSourceId: 1000 + Number(item.id),
          brand: 'Stride Archive',
          ratingAvg: Number(item.rating?.rate || 4.4).toFixed(2),
          ratingCount: item.rating?.count || 5,
          isFeatured: false,
        });
      }
    } catch (err) {
      console.warn('[SEED WARN] Gagal mengambil Fake Store API:', err.message);
    }

    // Pastikan 3 produk hero memiliki slug yang persis cocok dengan HERO_SLIDES
    const usedSlugs = new Set();
    const insertedProducts = [];

    for (const p of rawItems) {
      let slug = p.baseSlug;
      if (p.apiSourceId === 88) {
        slug = 'nike-air-jordan-1-red-and-black';
        p.catSlug = 'custom-shoes';
        p.name = 'Royal Gray LV Air Force 1';
        p.brand = 'Nike';
        p.price = 6850000.00;
        p.imageUrl = '/hero/lv-af1.png';
        p.desc = 'Custom Royal Gray Louis Vuitton x Off-White Nike Air Force 1 Low featuring grey and white LV Monogram leather overlays, contrast black leather Swoosh with gold LV chain charm, "LACET" printed laces, and signature "AIR" cupsole midsole.';
      } else if (p.apiSourceId === 90) {
        slug = 'puma-future-rider-trainers';
        p.catSlug = 'custom-shoes';
        p.name = 'Blue Chrome Hearts Air Force 1';
        p.brand = 'Nike';
        p.price = 4346916.99;
        p.imageUrl = '/hero/chromehearts.png';
        p.desc = 'Custom Blue Chrome Hearts Nike Air Force 1 Low featuring ice-blue airbrushed leather, black leather Gothic cross patches, splatter midsole detailing, and signature God Bless heel artwork.';
      } else if (p.apiSourceId === 91) {
        slug = 'sports-sneakers-off-white-red';
        p.name = "Nike Air Force 1 '07";
        p.brand = 'Nike';
        p.imageUrl = '/hero/af1-pair-front.png';
        p.desc = "The radiance lives on in the Nike Air Force 1 '07, the basketball icon that puts a fresh spin on what you know best: crisp leather, clean style, and legendary Air cushioning.";
      } else if (p.apiSourceId === 92 && usedSlugs.has('sports-sneakers-off-white-red')) {
        slug = 'sports-sneakers-off-white-red-v2';
      }
      if (usedSlugs.has(slug)) {
        slug = `${slug}-${p.apiSourceId}`;
      }
      usedSlugs.add(slug);

      const isHero = [
        'sports-sneakers-off-white-red',
        'nike-air-jordan-1-red-and-black',
        'puma-future-rider-trainers',
      ].includes(slug);

      const catId = catMap[p.catSlug];
      const res = await client.query(
        `INSERT INTO products 
          (store_id, category_id, name, slug, description, price, stock, image_url, api_source_id, brand, rating_avg, rating_count, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id, name, slug, price, store_id;`,
        [
          p.storeId,
          catId,
          p.name,
          slug,
          p.desc,
          p.price,
          p.stock,
          p.imageUrl,
          p.apiSourceId,
          p.brand,
          p.ratingAvg,
          p.ratingCount,
          isHero || p.isFeatured,
        ]
      );
      insertedProducts.push(res.rows[0]);
    }

    console.log(`[SEED] Berhasil menyimpan ${insertedProducts.length} produk ke tabel products.`);

    // 6. Buat contoh pesanan & ulasan asli agar halaman detail dan riwayat pesanan terisi
    const jordan = insertedProducts.find((p) => p.slug === 'nike-air-jordan-1-red-and-black') || insertedProducts[0];
    const offWhite = insertedProducts.find((p) => p.slug === 'sports-sneakers-off-white-red') || insertedProducts[1];

    if (jordan && offWhite) {
      console.log('[SEED] Membuat contoh pesanan dan ulasan...');
      const order1Res = await client.query(
        `INSERT INTO orders (order_number, buyer_id, total_amount, shipping_address, notes, status)
         VALUES ('ORD-2026-STR001', $1, $2, 'Jl. Perintis Kemerdekaan KM 10, Makassar', 'Kirim pakai double box agar kotak sepatu tidak penyok.', 'Selesai')
         RETURNING id;`,
        [buyer1.id, Number(jordan.price) + Number(offWhite.price)]
      );
      const order1Id = order1Res.rows[0].id;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, store_id, quantity, price, subtotal, selected_variant, selected_color)
         VALUES 
           ($1, $2, $3, 1, $4, $4, 'EU 42', 'Red / Black'),
           ($1, $5, $6, 1, $7, $7, 'EU 42', 'Off White / Red');`,
        [order1Id, jordan.id, jordan.store_id, jordan.price, offWhite.id, offWhite.store_id, offWhite.price]
      );

      await client.query(
        `INSERT INTO reviews (order_id, product_id, buyer_id, rating, comment)
         VALUES 
           ($1, $2, $3, 5, 'Ukuran EU 42 pas di kaki. Kotak sepatu sampai dengan aman karena double box, jahitan dan kulitnya rapi.'),
           ($1, $4, $3, 5, 'Solnya nyaman dipakai jalan seharian di kampus dan warnanya mudah dipadukan dengan celana hitam atau jeans.');`,
        [order1Id, jordan.id, buyer1.id, offWhite.id]
      );

      // Sinkronkan rating_avg dan rating_count produk yang diberi ulasan
      for (const prodId of [jordan.id, offWhite.id]) {
        await client.query(
          `UPDATE products
           SET rating_avg = (SELECT COALESCE(AVG(rating), 0)::numeric(3,2) FROM reviews WHERE product_id = $1),
               rating_count = (SELECT COUNT(*)::int FROM reviews WHERE product_id = $1)
           WHERE id = $1;`,
          [prodId]
        );
      }
    }

    console.log('[SEED] Selesai! Database STRIDE siap digunakan.');
  } catch (err) {
    console.error('[SEED FATAL ERROR]', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

runSeed();
