import { query } from './db.js';

export async function getAdminStats() {
  const sql = `
    SELECT 
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM users WHERE role = 'buyer') AS total_buyers,
      (SELECT COUNT(*)::int FROM users WHERE role = 'seller' AND status = 'approved') AS total_active_sellers,
      (SELECT COUNT(*)::int FROM users WHERE role = 'seller' AND status = 'pending') AS total_pending_sellers,
      (SELECT COUNT(*)::int FROM products) AS total_products,
      (SELECT COUNT(*)::int FROM orders) AS total_orders,
      (SELECT COALESCE(SUM(total_amount), 0)::numeric(14, 2) FROM orders WHERE status = 'Selesai') AS total_completed_revenue;
  `;
  const res = await query(sql);
  return res.rows[0];
}

export async function getAdminUsers({ role = null } = {}) {
  const conditions = [];
  const params = [];

  if (role) {
    conditions.push('u.role = $1');
    params.push(role);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.role,
      u.status,
      u.phone,
      u.address,
      u.created_at,
      s.id AS store_id,
      s.name AS store_name,
      COUNT(DISTINCT o.id)::int AS total_orders
    FROM users u
    LEFT JOIN stores s ON u.id = s.seller_id
    LEFT JOIN orders o ON u.id = o.buyer_id
    ${whereClause}
    GROUP BY u.id, s.id, s.name
    ORDER BY u.created_at DESC;
  `;

  const res = await query(sql, params);
  return res.rows;
}

export async function getPendingSellers() {
  const sql = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.phone,
      u.address,
      u.status,
      u.created_at,
      s.id AS store_id,
      s.name AS store_name,
      s.slug AS store_slug,
      s.description AS store_description
    FROM users u
    LEFT JOIN stores s ON u.id = s.seller_id
    WHERE u.role = 'seller' AND u.status = 'pending'
    ORDER BY u.created_at ASC;
  `;
  const res = await query(sql);
  return res.rows;
}

export async function approveSeller(sellerId) {
  const sql = `
    UPDATE users
    SET status = 'approved', updated_at = NOW()
    WHERE id = $1 AND role = 'seller'
    RETURNING id, name, email, role, status;
  `;
  const res = await query(sql, [sellerId]);

  if (res.rows.length === 0) {
    throw new Error('Seller tidak ditemukan atau bukan akun dengan peran seller.');
  }

  return res.rows[0];
}

export async function rejectSeller(sellerId) {
  const sql = `
    UPDATE users
    SET status = 'rejected', updated_at = NOW()
    WHERE id = $1 AND role = 'seller'
    RETURNING id, name, email, role, status;
  `;
  const res = await query(sql, [sellerId]);

  if (res.rows.length === 0) {
    throw new Error('Seller tidak ditemukan atau bukan akun dengan peran seller.');
  }

  return res.rows[0];
}

export async function deleteUser(adminId, targetUserId) {
  if (Number(adminId) === Number(targetUserId)) {
    throw new Error('Admin tidak dapat menghapus akunnya sendiri.');
  }

  const sql = 'DELETE FROM users WHERE id = $1 RETURNING id, name, email, role;';
  const res = await query(sql, [targetUserId]);

  if (res.rows.length === 0) {
    throw new Error('User yang akan dihapus tidak ditemukan.');
  }

  return res.rows[0];
}

export async function deleteInfringingProduct(productId) {
  const sql = 'DELETE FROM products WHERE id = $1 RETURNING id, name;';
  const res = await query(sql, [productId]);

  if (res.rows.length === 0) {
    throw new Error('Produk yang akan dihapus tidak ditemukan.');
  }

  return res.rows[0];
}

export async function getAllStores() {
  const sql = `
    SELECT 
      s.id,
      s.name,
      s.slug,
      s.seller_id,
      u.name AS seller_name,
      u.email AS seller_email
    FROM stores s
    JOIN users u ON s.seller_id = u.id
    ORDER BY s.name ASC;
  `;
  const res = await query(sql);
  return res.rows;
}

export async function createAdminProduct({
  storeId,
  categoryId,
  name,
  description = '',
  price,
  stock,
  imageUrl,
  brand = '',
  isFeatured = false,
}) {
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
    Number(storeId),
    Number(categoryId),
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

export async function updateAdminProduct(productId, {
  storeId,
  categoryId,
  name,
  description,
  price,
  stock,
  imageUrl,
  brand,
  isFeatured,
}) {
  const sql = `
    UPDATE products
    SET 
      store_id = COALESCE($1, store_id),
      category_id = COALESCE($2, category_id),
      name = COALESCE($3, name),
      description = COALESCE($4, description),
      price = COALESCE($5, price),
      stock = COALESCE($6, stock),
      image_url = COALESCE($7, image_url),
      brand = COALESCE($8, brand),
      is_featured = COALESCE($9, is_featured),
      updated_at = NOW()
    WHERE id = $10
    RETURNING *;
  `;

  const res = await query(sql, [
    storeId ? Number(storeId) : null,
    categoryId ? Number(categoryId) : null,
    name ? name.trim() : null,
    description !== undefined ? description.trim() : null,
    price !== undefined ? Number(price) : null,
    stock !== undefined ? Number(stock) : null,
    imageUrl ? imageUrl.trim() : null,
    brand !== undefined ? brand.trim() : null,
    isFeatured !== undefined ? Boolean(isFeatured) : null,
    Number(productId),
  ]);

  if (res.rows.length === 0) {
    throw new Error('Produk tidak ditemukan.');
  }

  return res.rows[0];
}
