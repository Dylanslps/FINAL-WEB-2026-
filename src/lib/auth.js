import pool, { query } from './db.js';

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error('Email dan password wajib diisi.');
  }

  const sql = `
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      u.password, 
      u.role, 
      u.status, 
      u.phone, 
      u.address,
      s.id AS store_id,
      s.name AS store_name,
      s.slug AS store_slug
    FROM users u
    LEFT JOIN stores s ON u.id = s.seller_id
    WHERE u.email = $1
    LIMIT 1;
  `;

  const res = await query(sql, [email.trim().toLowerCase()]);
  const user = res.rows[0];

  if (!user || user.password !== password) {
    throw new Error('Email atau password tidak sesuai.');
  }

  delete user.password;
  return user;
}

export async function registerBuyer({ name, email, password, phone = '', address = '' }) {
  if (!name || !email || !password) {
    throw new Error('Nama, email, dan password wajib diisi.');
  }

  const checkRes = await query('SELECT id FROM users WHERE email = $1;', [email.trim().toLowerCase()]);
  if (checkRes.rows.length > 0) {
    throw new Error('Email sudah terdaftar.');
  }

  const sql = `
    INSERT INTO users (name, email, password, role, status, phone, address)
    VALUES ($1, $2, $3, 'buyer', 'approved', $4, $5)
    RETURNING id, name, email, role, status, phone, address, created_at;
  `;

  const res = await query(sql, [
    name.trim(),
    email.trim().toLowerCase(),
    password,
    phone.trim() || null,
    address.trim() || null,
  ]);
  return res.rows[0];
}

export async function registerSeller({
  name,
  email,
  password,
  phone = '',
  address = '',
  storeName,
  storeDescription = '',
}) {
  if (!name || !email || !password || !storeName) {
    throw new Error('Nama, email, password, dan nama toko wajib diisi.');
  }

  const checkRes = await query('SELECT id FROM users WHERE email = $1;', [email.trim().toLowerCase()]);
  if (checkRes.rows.length > 0) {
    throw new Error('Email sudah terdaftar.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertUserSql = `
      INSERT INTO users (name, email, password, role, status, phone, address)
      VALUES ($1, $2, $3, 'seller', 'pending', $4, $5)
      RETURNING id, name, email, role, status, created_at;
    `;
    const userRes = await client.query(insertUserSql, [
      name.trim(),
      email.trim().toLowerCase(),
      password,
      phone.trim() || null,
      address.trim() || null,
    ]);
    const newUser = userRes.rows[0];

    const storeSlug = storeName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const insertStoreSql = `
      INSERT INTO stores (seller_id, name, slug, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, slug, description;
    `;
    const storeRes = await client.query(insertStoreSql, [
      newUser.id,
      storeName.trim(),
      storeSlug,
      storeDescription.trim() || null,
    ]);

    await client.query('COMMIT');

    return {
      ...newUser,
      store_id: storeRes.rows[0].id,
      store_name: storeRes.rows[0].name,
      store_slug: storeRes.rows[0].slug,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserById(id) {
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
      s.slug AS store_slug,
      s.description AS store_description,
      s.logo_url AS store_logo
    FROM users u
    LEFT JOIN stores s ON u.id = s.seller_id
    WHERE u.id = $1
    LIMIT 1;
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
}

export async function deleteRejectedSeller(userId) {
  const checkRes = await query('SELECT id, role, status FROM users WHERE id = $1;', [userId]);
  const user = checkRes.rows[0];

  if (!user) {
    throw new Error('Akun pengguna tidak ditemukan.');
  }

  if (user.role !== 'seller' || user.status !== 'rejected') {
    throw new Error('Hanya akun seller dengan status ditolak (rejected) yang dapat dihapus.');
  }

  const deleteSql = 'DELETE FROM users WHERE id = $1 RETURNING id;';
  const res = await query(deleteSql, [userId]);
  return res.rows[0] || null;
}

export function canAccessSellerDashboard(user) {
  return Boolean(user && user.role === 'seller' && user.status === 'approved');
}
