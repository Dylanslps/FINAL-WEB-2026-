import { query } from './db.js';

export async function getCategories() {
  const sql = `
    SELECT 
      c.id, 
      c.name, 
      c.slug, 
      c.description, 
      c.created_at,
      COUNT(p.id)::int AS product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name, c.slug, c.description, c.created_at
    ORDER BY c.name ASC;
  `;
  const res = await query(sql);
  return res.rows;
}

export async function getCategoryBySlug(slug) {
  const sql = `
    SELECT 
      c.id, 
      c.name, 
      c.slug, 
      c.description, 
      c.created_at,
      COUNT(p.id)::int AS product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    WHERE c.slug = $1
    GROUP BY c.id, c.name, c.slug, c.description, c.created_at
    LIMIT 1;
  `;
  const res = await query(sql, [slug]);
  return res.rows[0] || null;
}

export async function createCategory({ name, slug, description = '' }) {
  const finalSlug = (slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const sql = `
    INSERT INTO categories (name, slug, description)
    VALUES ($1, $2, $3)
    RETURNING id, name, slug, description, created_at;
  `;
  const res = await query(sql, [name.trim(), finalSlug, description.trim()]);
  return res.rows[0];
}

export async function updateCategory(id, { name, slug, description = '' }) {
  const finalSlug = (slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const sql = `
    UPDATE categories
    SET name = $1, slug = $2, description = $3
    WHERE id = $4
    RETURNING id, name, slug, description, created_at;
  `;
  const res = await query(sql, [name.trim(), finalSlug, description.trim(), id]);
  return res.rows[0] || null;
}

export async function deleteCategory(id) {
  const countSql = `SELECT COUNT(*)::int AS count FROM products WHERE category_id = $1;`;
  const countRes = await query(countSql, [id]);
  const productCount = countRes.rows[0]?.count || 0;

  if (productCount > 0) {
    throw new Error(`Kategori tidak dapat dihapus karena masih memuat ${productCount} produk aktif.`);
  }

  const deleteSql = `DELETE FROM categories WHERE id = $1 RETURNING id;`;
  const res = await query(deleteSql, [id]);
  return res.rows[0] || null;
}
