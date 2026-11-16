import { query } from './db.js';

export async function getSellerStore(sellerId) {
  const sql = `
    SELECT 
      s.id,
      s.seller_id,
      s.name,
      s.slug,
      s.description,
      s.logo_url,
      s.banner_url,
      s.created_at,
      COUNT(DISTINCT p.id)::int AS total_products,
      COUNT(DISTINCT oi.order_id)::int AS total_orders
    FROM stores s
    LEFT JOIN products p ON s.id = p.store_id
    LEFT JOIN order_items oi ON s.id = oi.store_id
    WHERE s.seller_id = $1
    GROUP BY s.id;
  `;
  const res = await query(sql, [sellerId]);
  return res.rows[0] || null;
}

export async function updateSellerStore(sellerId, { name, description = '', logoUrl = '', bannerUrl = '' }) {
  const storeSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const sql = `
    UPDATE stores
    SET 
      name = $1, 
      slug = $2, 
      description = $3, 
      logo_url = $4, 
      banner_url = $5, 
      updated_at = NOW()
    WHERE seller_id = $6
    RETURNING id, name, slug, description, logo_url, banner_url, updated_at;
  `;
  const res = await query(sql, [name.trim(), storeSlug, description.trim(), logoUrl.trim(), bannerUrl.trim(), sellerId]);
  return res.rows[0] || null;
}

export async function getSellerProducts(sellerId) {
  const sql = `
    SELECT 
      p.id,
      p.store_id,
      p.category_id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      p.brand,
      p.rating_avg,
      p.rating_count,
      p.is_featured,
      p.created_at,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    JOIN stores s ON p.store_id = s.id
    JOIN categories c ON p.category_id = c.id
    WHERE s.seller_id = $1
    ORDER BY p.created_at DESC;
  `;
  const res = await query(sql, [sellerId]);
  return res.rows;
}

export async function createSellerProduct(sellerId, {
  categoryId,
  name,
  description = '',
  price,
  stock,
  imageUrl,
  brand = '',
  isFeatured = false,
}) {
  const storeRes = await query('SELECT id FROM stores WHERE seller_id = $1;', [sellerId]);
  const store = storeRes.rows[0];

  if (!store) {
    throw new Error('Toko untuk seller ini tidak ditemukan.');
  }

  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const sql = `
    INSERT INTO products (
      store_id, category_id, name, slug, description, price, stock, image_url, brand, is_featured
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const res = await query(sql, [
    store.id,
    categoryId,
    name.trim(),
    slug,
    description.trim(),
    Number(price),
    Number(stock),
    imageUrl.trim(),
    brand.trim() || 'Stride Studio',
    Boolean(isFeatured),
  ]);

  return res.rows[0];
}

export async function updateSellerProduct(sellerId, productId, {
  categoryId,
  name,
  description = '',
  price,
  stock,
  imageUrl,
  brand = '',
  isFeatured = false,
}) {
  const checkSql = `
    SELECT p.id 
    FROM products p
    JOIN stores s ON p.store_id = s.id
    WHERE p.id = $1 AND s.seller_id = $2;
  `;
  const checkRes = await query(checkSql, [productId, sellerId]);
  if (checkRes.rows.length === 0) {
    throw new Error('Produk tidak ditemukan atau bukan milik toko Anda.');
  }

  const sql = `
    UPDATE products
    SET 
      category_id = $1,
      name = $2,
      description = $3,
      price = $4,
      stock = $5,
      image_url = $6,
      brand = $7,
      is_featured = $8,
      updated_at = NOW()
    WHERE id = $9
    RETURNING *;
  `;

  const res = await query(sql, [
    categoryId,
    name.trim(),
    description.trim(),
    Number(price),
    Number(stock),
    imageUrl.trim(),
    brand.trim(),
    Boolean(isFeatured),
    productId,
  ]);

  return res.rows[0];
}

export async function deleteSellerProduct(sellerId, productId) {
  const checkSql = `
    SELECT p.id 
    FROM products p
    JOIN stores s ON p.store_id = s.id
    WHERE p.id = $1 AND s.seller_id = $2;
  `;
  const checkRes = await query(checkSql, [productId, sellerId]);
  if (checkRes.rows.length === 0) {
    throw new Error('Produk tidak ditemukan atau bukan milik toko Anda.');
  }

  const deleteSql = 'DELETE FROM products WHERE id = $1 RETURNING id;';
  const res = await query(deleteSql, [productId]);
  return res.rows[0] || null;
}

export async function getSellerIncomingOrders(sellerId) {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.order_number,
      o.status,
      o.shipping_address,
      o.notes,
      o.created_at,
      u.name AS buyer_name,
      u.email AS buyer_email,
      u.phone AS buyer_phone,
      oi.id AS order_item_id,
      oi.product_id,
      oi.quantity,
      oi.price,
      oi.subtotal,
      oi.selected_variant,
      oi.selected_color,
      p.name AS product_name,
      p.image_url AS product_image
    FROM orders o
    JOIN users u ON o.buyer_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN stores s ON oi.store_id = s.id
    JOIN products p ON oi.product_id = p.id
    WHERE s.seller_id = $1
    ORDER BY o.created_at DESC;
  `;
  const res = await query(sql, [sellerId]);

  const ordersMap = new Map();
  for (const row of res.rows) {
    if (!ordersMap.has(row.order_id)) {
      ordersMap.set(row.order_id, {
        id: row.order_id,
        order_number: row.order_number,
        status: row.status,
        shipping_address: row.shipping_address,
        notes: row.notes,
        created_at: row.created_at,
        buyer_name: row.buyer_name,
        buyer_email: row.buyer_email,
        buyer_phone: row.buyer_phone,
        items: [],
        seller_subtotal: 0,
      });
    }
    const order = ordersMap.get(row.order_id);
    order.items.push({
      order_item_id: row.order_item_id,
      product_id: row.product_id,
      product_name: row.product_name,
      product_image: row.product_image,
      quantity: row.quantity,
      price: row.price,
      subtotal: row.subtotal,
      selected_variant: row.selected_variant,
      selected_color: row.selected_color,
    });
    order.seller_subtotal += Number(row.subtotal);
  }

  return Array.from(ordersMap.values());
}

export async function updateSellerOrderStatus(sellerId, orderId, newStatus) {
  const validStatuses = ['Diproses', 'Selesai', 'Dibatalkan'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Status "${newStatus}" tidak diizinkan untuk seller.`);
  }

  const checkSql = `
    SELECT oi.id 
    FROM order_items oi
    JOIN stores s ON oi.store_id = s.id
    WHERE oi.order_id = $1 AND s.seller_id = $2
    LIMIT 1;
  `;
  const checkRes = await query(checkSql, [orderId, sellerId]);
  if (checkRes.rows.length === 0) {
    throw new Error('Pesanan tidak ditemukan atau tidak memuat barang dari toko Anda.');
  }

  const updateSql = `
    UPDATE orders
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, order_number, status, updated_at;
  `;
  const res = await query(updateSql, [newStatus, orderId]);
  return res.rows[0] || null;
}
