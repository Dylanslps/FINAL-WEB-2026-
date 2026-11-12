import { query } from './db.js';

export async function getProducts({
  categorySlug,
  search,
  sortBy = 'newest',
  isFeatured,
  storeId,
  limit = 20,
  offset = 0,
} = {}) {
  const conditions = [];
  const params = [];
  let paramIdx = 1;

  if (categorySlug) {
    conditions.push(`c.slug = $${paramIdx++}`);
    params.push(categorySlug);
  }

  if (storeId) {
    conditions.push(`p.store_id = $${paramIdx++}`);
    params.push(storeId);
  }

  if (isFeatured !== undefined) {
    conditions.push(`p.is_featured = $${paramIdx++}`);
    params.push(isFeatured);
  }

  if (search && search.trim() !== '') {
    conditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx} OR p.brand ILIKE $${paramIdx})`);
    params.push(`%${search.trim()}%`);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderByClause = 'ORDER BY p.created_at DESC';
  if (sortBy === 'price_asc') {
    orderByClause = 'ORDER BY p.price ASC';
  } else if (sortBy === 'price_desc') {
    orderByClause = 'ORDER BY p.price DESC';
  } else if (sortBy === 'rating') {
    orderByClause = 'ORDER BY p.rating_avg DESC, p.rating_count DESC';
  } else if (sortBy === 'newest') {
    orderByClause = 'ORDER BY p.created_at DESC';
  }

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
      p.api_source_id,
      p.brand,
      p.rating_avg,
      p.rating_count,
      p.is_featured,
      p.created_at,
      c.name AS category_name,
      c.slug AS category_slug,
      s.name AS store_name,
      s.slug AS store_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN stores s ON p.store_id = s.id
    ${whereClause}
    ${orderByClause}
    LIMIT $${paramIdx++} OFFSET $${paramIdx++};
  `;

  params.push(limit, offset);

  const res = await query(sql, params);

  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN stores s ON p.store_id = s.id
    ${whereClause};
  `;
  const countParams = params.slice(0, paramIdx - 3);
  const countRes = await query(countSql, countParams);

  return {
    products: res.rows,
    total: countRes.rows[0]?.total || 0,
  };
}

export async function getProductBySlug(slug) {
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
      p.api_source_id,
      p.brand,
      p.rating_avg,
      p.rating_count,
      p.is_featured,
      p.created_at,
      p.updated_at,
      c.name AS category_name,
      c.slug AS category_slug,
      s.name AS store_name,
      s.slug AS store_slug,
      s.description AS store_description,
      s.logo_url AS store_logo
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN stores s ON p.store_id = s.id
    WHERE p.slug = $1
    LIMIT 1;
  `;

  const res = await query(sql, [slug]);
  return res.rows[0] || null;
}

export async function getProductById(id) {
  const sql = `
    SELECT 
      p.*,
      c.name AS category_name,
      c.slug AS category_slug,
      s.name AS store_name,
      s.slug AS store_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN stores s ON p.store_id = s.id
    WHERE p.id = $1
    LIMIT 1;
  `;

  const res = await query(sql, [id]);
  return res.rows[0] || null;
}

export async function getFeaturedProducts(limit = 4) {
  const { products } = await getProducts({ isFeatured: true, limit });
  return products;
}
