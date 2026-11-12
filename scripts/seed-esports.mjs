import pg from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('[SEED ERROR] DATABASE_URL tidak ditemukan. Pastikan ada di .env.local.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

async function runSeed() {
  console.log('[SEED] Memulai inisialisasi data & penarikan API...');
  await client.connect();

  try {
    // 1. Reset data tabel
    console.log('[SEED] Membersihkan data lama...');
    await client.query(`
      TRUNCATE wishlists, reviews, order_items, orders, cart_items, products, categories, stores, users 
      RESTART IDENTITY CASCADE;
    `);

    // 2. Insert Users (Admin, Approved Sellers, Pending Seller, Rejected Seller, Buyer)
    console.log('[SEED] Membuat akun user dasar...');
    const userInsertQuery = `
      INSERT INTO users (name, email, password, role, status, phone, address)
      VALUES 
        ('Super Admin Esports', 'admin@esports.com', 'admin123', 'admin', 'approved', '081234567890', 'HQ Esports Arena, Jakarta'),
        ('Alex "Apex" Pratama', 'seller1@apexgear.com', 'seller123', 'seller', 'approved', '081234567891', 'Jl. Gamers No. 10, Bandung'),
        ('Rian "Nexus" Wijaya', 'seller2@nexuspro.com', 'seller123', 'seller', 'approved', '081234567892', 'Ruko Pro Player Blok B, Surabaya'),
        ('Budi Calon Seller', 'seller3@pending.com', 'seller123', 'seller', 'pending', '081234567893', 'Jl. Baru Buka No. 5, Makassar'),
        ('Andi Spam Seller', 'seller4@rejected.com', 'seller123', 'seller', 'rejected', '081234567894', 'Jl. Melanggar Syarat No. 9, Medan'),
        ('Dylan Buyer', 'buyer@gmail.com', 'buyer123', 'buyer', 'approved', '081234567895', 'Jl. Mahasiswa Unhas No. 8, Makassar')
      RETURNING id, name, email, role, status;
    `;
    const userRes = await client.query(userInsertQuery);
    const users = userRes.rows;
    console.log(`[SEED] Berhasil membuat ${users.length} user (Admin, Seller, Buyer).`);

    const seller1 = users.find((u) => u.email === 'seller1@apexgear.com');
    const seller2 = users.find((u) => u.email === 'seller2@nexuspro.com');
    const buyer1 = users.find((u) => u.email === 'buyer@gmail.com');

    // 3. Insert Stores (untuk seller yang approved)
    console.log('[SEED] Membuat profil toko seller...');
    const storeRes = await client.query(`
      INSERT INTO stores (seller_id, name, slug, description, logo_url, banner_url)
      VALUES 
        (${seller1.id}, 'Apex Pro Gaming Gear', 'apex-pro-gaming-gear', 
         'Official dealer perlengkapan turnamen esports, gaming mouse, keyboard mekanikal, dan headset profesional.', 
         'https://images.unsplash.com/photo-1612287233207-686f047ff6bd?w=200&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80'),
        (${seller2.id}, 'Nexus Esports Merch & Apparel', 'nexus-esports-merch', 
         'Pusat jersey tim esports resmi, hoodie turnamen, streetwear pro player, dan merchandise eksklusif.', 
         'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&auto=format&fit=crop&q=80',
         'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80')
      RETURNING id, name;
    `);
    const store1Id = storeRes.rows[0].id;
    const store2Id = storeRes.rows[1].id;

    // 4. Insert Categories
    console.log('[SEED] Membuat kategori produk esports...');
    const catRes = await client.query(`
      INSERT INTO categories (name, slug, description)
      VALUES 
        ('Gaming Gear & Peripherals', 'gaming-gear', 'Mouse ultralight, keyboard mechanical switch, headset 7.1 surround sound.'),
        ('Esports Apparel & Jerseys', 'esports-apparel', 'Jersey tim esports pro kit, hoodie gaming, dan apparel turnamen.'),
        ('Gaming Hardware & Rig', 'gaming-hardware', 'Laptop gaming performa tinggi, monitor 240Hz, dan rig streaming.'),
        ('Accessories & Merch', 'accessories', 'Mousepad deskmat control/speed, gantungan kunci, dan aksesori pro setup.')
      RETURNING id, slug, name;
    `);
    const catMap = {};
    for (const cat of catRes.rows) {
      catMap[cat.slug] = cat.id;
    }

    // 5. Tarik Produk dari API Eksternal (DummyJSON API)
    console.log('[SEED] Menarik data produk & gambar langsung dari API e-commerce internet (DummyJSON)...');
    let apiProducts = [];
    try {
      const endpoints = [
        'https://dummyjson.com/products/category/laptops?limit=5',
        'https://dummyjson.com/products/category/mobile-accessories?limit=6',
        'https://dummyjson.com/products/category/mens-shirts?limit=5',
        'https://dummyjson.com/products/search?q=gaming&limit=5',
      ];

      for (const url of endpoints) {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.products) {
            apiProducts = apiProducts.concat(data.products);
          }
        }
      }
      console.log(`[SEED] Sukses menarik ${apiProducts.length} item dari DummyJSON API.`);
    } catch (fetchErr) {
      console.warn('[SEED WARNING] Gagal fetch online, beralih ke dataset online terintegrasi:', fetchErr.message);
    }

    // Curated catalog esports yang dipadukan dengan gambar API DummyJSON & Unsplash CDN
    const esportsCatalog = [
      {
        storeId: store1Id,
        catSlug: 'gaming-gear',
        name: 'Viper Pro Wireless Gaming Mouse 8KHz',
        slug: 'viper-pro-wireless-gaming-mouse-8khz',
        desc: 'Mouse gaming nirkabel kelas turnamen dengan sensor optik 30K DPI dan polling rate 8000Hz. Berat ultra ringan hanya 49 gram.',
        price: 1850000,
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        apiSourceId: 101,
        brand: 'Razer Apex',
        ratingAvg: 4.9,
        ratingCount: 42,
        isFeatured: true,
      },
      {
        storeId: store1Id,
        catSlug: 'gaming-gear',
        name: 'Apex Pro TKL Mechanical Keyboard (OmniPoint Switch)',
        slug: 'apex-pro-tkl-mechanical-keyboard',
        desc: 'Keyboard mekanik dengan aktuasi switch yang dapat diatur dari 0.1mm hingga 4.0mm dan display mini OLED.',
        price: 2799000,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        apiSourceId: 102,
        brand: 'Apex Forge',
        ratingAvg: 4.8,
        ratingCount: 38,
        isFeatured: true,
      },
      {
        storeId: store1Id,
        catSlug: 'gaming-gear',
        name: 'Cloud Pro Alpha Wireless Headset 300H Battery',
        slug: 'cloud-pro-alpha-wireless-headset',
        desc: 'Headset gaming dengan daya tahan baterai hingga 300 jam sekali isi daya, driver dual-chamber 50mm, dan mic detachable.',
        price: 2450000,
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=80',
        apiSourceId: 103,
        brand: 'HyperAudio',
        ratingAvg: 4.9,
        ratingCount: 56,
        isFeatured: true,
      },
      {
        storeId: store2Id,
        catSlug: 'esports-apparel',
        name: 'Official Pro Kit 2026 Jersey (Custom Nickname Edition)',
        slug: 'official-pro-kit-2026-jersey',
        desc: 'Jersey turnamen resmi berteknologi dry-fit breathe tech anti-keringat, grafis sublimasi tajam, dan opsi custom cetak nama pro player.',
        price: 499000,
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        apiSourceId: 104,
        brand: 'Nexus Wear',
        ratingAvg: 4.7,
        ratingCount: 89,
        isFeatured: true,
      },
      {
        storeId: store2Id,
        catSlug: 'esports-apparel',
        name: 'Champion Winter Hoodie Heavyweight Fleece',
        slug: 'champion-winter-hoodie-heavyweight',
        desc: 'Hoodie streetwear esports dengan bahan cotton fleece 380gsm hangat dan embroidery logo reflektif.',
        price: 649000,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        apiSourceId: 105,
        brand: 'Nexus Wear',
        ratingAvg: 4.8,
        ratingCount: 29,
        isFeatured: false,
      },
      {
        storeId: store1Id,
        catSlug: 'gaming-hardware',
        name: 'Strix Scar 18 RTX 4090 Gaming Rig Laptop',
        slug: 'strix-scar-18-rtx-4090-gaming-rig',
        desc: 'Monster gaming laptop Intel Core i9 Gen-14, RTX 4090 16GB, layar 18 inci 2.5K Nebula HDR 240Hz, RAM 64GB DDR5.',
        price: 52999000,
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
        apiSourceId: 106,
        brand: 'ROG Tech',
        ratingAvg: 5.0,
        ratingCount: 12,
        isFeatured: true,
      },
      {
        storeId: store1Id,
        catSlug: 'gaming-hardware',
        name: 'Predator 360Hz Fast-IPS Esports Monitor 24.5"',
        slug: 'predator-360hz-fast-ips-monitor',
        desc: 'Monitor pro turnamen FPS 24.5 inci 360Hz dengan response time 0.5ms GtG dan teknologi G-Sync esport.',
        price: 8850000,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        apiSourceId: 107,
        brand: 'Predator',
        ratingAvg: 4.9,
        ratingCount: 23,
        isFeatured: false,
      },
      {
        storeId: store2Id,
        catSlug: 'accessories',
        name: 'CyberGrid Cordura Speed Deskmat XXL (900x400mm)',
        slug: 'cybergrid-cordura-speed-deskmat-xxl',
        desc: 'Deskmat berukuran jumbo berbahan kain Cordura tahan air, jahitan pinggir anti-fraying, dan dasar karet anti-selip.',
        price: 299000,
        stock: 75,
        imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80',
        apiSourceId: 108,
        brand: 'Nexus Gear',
        ratingAvg: 4.8,
        ratingCount: 67,
        isFeatured: false,
      },
    ];

    // Jika ada hasil dari DummyJSON API, kombinasikan dan sesuaikan
    if (apiProducts.length > 0) {
      for (const item of apiProducts.slice(0, 6)) {
        const isGear = item.category.includes('laptop') || item.category.includes('accessories');
        esportsCatalog.push({
          storeId: isGear ? store1Id : store2Id,
          catSlug: isGear ? 'gaming-hardware' : 'esports-apparel',
          name: `[API] ${item.title}`,
          slug: `api-${item.id}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          desc: item.description,
          price: Math.round(item.price * 16000), // konversi USD ke IDR
          stock: item.stock || 25,
          imageUrl: item.thumbnail || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
          apiSourceId: item.id,
          brand: item.brand || 'Pro Esports',
          ratingAvg: item.rating || 4.5,
          ratingCount: 15,
          isFeatured: false,
        });
      }
    }

    // Insert semua produk ke tabel `products`
    console.log(`[SEED] Memasukkan ${esportsCatalog.length} produk ke tabel products di pgAdmin...`);
    const insertedProducts = [];
    for (const p of esportsCatalog) {
      const catId = catMap[p.catSlug] || catMap['gaming-gear'];
      const res = await client.query(
        `INSERT INTO products 
          (store_id, category_id, name, slug, description, price, stock, image_url, api_source_id, brand, rating_avg, rating_count, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id, name, price;`,
        [
          p.storeId,
          catId,
          p.name,
          p.slug,
          p.desc,
          p.price,
          p.stock,
          p.imageUrl,
          p.apiSourceId,
          p.brand,
          p.ratingAvg,
          p.ratingCount,
          p.isFeatured,
        ]
      );
      insertedProducts.push(res.rows[0]);
    }
    console.log(`[SEED] Berhasil memasukkan ${insertedProducts.length} produk katalog esports.`);

    // 6. Buat 1 Contoh Pesanan (Order) Selesai + Review dari Buyer
    console.log('[SEED] Membuat contoh transaksi pesanan & review...');
    const prod1 = insertedProducts[0];
    const orderRes = await client.query(
      `INSERT INTO orders (order_number, buyer_id, total_amount, shipping_address, notes, status)
       VALUES ('ORD-2026-ESP001', $1, $2, 'Jl. Mahasiswa Unhas No. 8, Makassar', 'Tolong bubble wrap tebal untuk mouse turnamen.', 'Selesai')
       RETURNING id;`,
      [buyer1.id, prod1.price]
    );
    const orderId = orderRes.rows[0].id;

    await client.query(
      `INSERT INTO order_items (order_id, product_id, store_id, quantity, price, subtotal)
       VALUES ($1, $2, $3, 1, $4, $4);`,
      [orderId, prod1.id, store1Id, prod1.price]
    );

    await client.query(
      `INSERT INTO reviews (order_id, product_id, buyer_id, rating, comment)
       VALUES ($1, $2, $3, 5, 'Mouse gaming terbaik yang pernah saya pakai! Sensor 8KHz sangat responsif untuk main CS2 dan Valorant, packing rapi dan seller ramah.');`,
      [orderId, prod1.id, buyer1.id]
    );

    console.log('[SEED] SELESAI! Seluruh database dan seeder API esports siap digunakan.');
  } catch (err) {
    console.error('[SEED FATAL ERROR]', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

runSeed();
