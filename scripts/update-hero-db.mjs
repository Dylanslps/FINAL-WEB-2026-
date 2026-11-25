import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dylan2007@localhost:5432/STRIDE',
});

async function main() {
  try {
    // 1. Tambah kategori Custom Shoes jika belum ada
    const catRes = await pool.query(`
      INSERT INTO categories (name, slug, description)
      VALUES (
        'Custom Shoes',
        'custom-shoes',
        'Koleksi sneaker custom eksklusif, edisi kolaborasi desainer, dan seni artwork terbatas.'
      )
      ON CONFLICT (slug) DO UPDATE 
        SET name = EXCLUDED.name,
            description = EXCLUDED.description
      RETURNING id, name, slug;
    `);
    const customShoesCat = catRes.rows[0];
    console.log('CATEGORY READY:', JSON.stringify(customShoesCat, null, 2));

    // 2. Update Royal Gray LV Air Force 1 ke kategori Custom Shoes & harga 6.850.000
    const resLv = await pool.query(`
      UPDATE products 
      SET 
        category_id = $1,
        price = 6850000.00,
        name = 'Royal Gray LV Air Force 1',
        brand = 'Nike',
        image_url = '/hero/lv-af1.png',
        description = 'Custom Royal Gray Louis Vuitton x Off-White Nike Air Force 1 Low featuring grey and white LV Monogram leather overlays, contrast black leather Swoosh with gold LV chain charm, "LACET" printed laces, and signature "AIR" cupsole midsole.'
      WHERE id = 1 OR slug = 'nike-air-jordan-1-red-and-black'
      RETURNING id, name, slug, category_id, brand, price, image_url;
    `, [customShoesCat.id]);
    console.log('UPDATE SLIDE 1 (LV AF1) SUCCESS:', JSON.stringify(resLv.rows, null, 2));

    // 3. Update Blue Chrome Hearts Air Force 1 ke kategori Custom Shoes
    const resCh = await pool.query(`
      UPDATE products 
      SET 
        category_id = $1,
        price = 4346916.99,
        name = 'Blue Chrome Hearts Air Force 1',
        brand = 'Nike',
        image_url = '/hero/chromehearts.png',
        description = 'Custom Blue Chrome Hearts Nike Air Force 1 Low featuring ice-blue airbrushed leather, black leather Gothic cross patches, splatter midsole detailing, and signature God Bless heel artwork.'
      WHERE id = 3 OR slug = 'puma-future-rider-trainers'
      RETURNING id, name, slug, category_id, brand, price, image_url;
    `, [customShoesCat.id]);
    console.log('UPDATE SLIDE 2 (CHROME HEARTS AF1) SUCCESS:', JSON.stringify(resCh.rows, null, 2));

    // 4. Verifikasi jumlah produk per kategori
    const summaryRes = await pool.query(`
      SELECT c.id, c.name, c.slug, COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.slug
      ORDER BY c.id;
    `);
    console.log('ALL CATEGORIES SUMMARY:', JSON.stringify(summaryRes.rows, null, 2));
  } catch (err) {
    console.error('UPDATE ERROR:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
