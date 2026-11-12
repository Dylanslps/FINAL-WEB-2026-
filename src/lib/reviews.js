import { query } from './db.js';

export async function createReview({ orderId, productId, buyerId, rating, comment = '' }) {
  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5) {
    throw new Error('Rating harus berupa angka antara 1 sampai 5.');
  }

  const orderSql = `
    SELECT o.id, o.status, o.buyer_id
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = $1 AND o.buyer_id = $2 AND oi.product_id = $3
    LIMIT 1;
  `;
  const orderRes = await query(orderSql, [orderId, buyerId, productId]);
  const order = orderRes.rows[0];

  if (!order) {
    throw new Error('Pesanan tidak ditemukan atau produk tidak ada di dalam pesanan ini.');
  }

  if (order.status !== 'Selesai') {
    throw new Error('Ulasan hanya dapat diberikan untuk pesanan yang telah berstatus Selesai.');
  }

  const existingRes = await query(
    'SELECT id FROM reviews WHERE order_id = $1 AND product_id = $2 AND buyer_id = $3;',
    [orderId, productId, buyerId]
  );
  if (existingRes.rows.length > 0) {
    throw new Error('Anda sudah memberikan ulasan untuk produk ini pada pesanan tersebut.');
  }

  const insertSql = `
    INSERT INTO reviews (order_id, product_id, buyer_id, rating, comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, order_id, product_id, buyer_id, rating, comment, created_at;
  `;
  const res = await query(insertSql, [orderId, productId, buyerId, numRating, comment.trim()]);
  const newReview = res.rows[0];

  await query(
    `UPDATE products
     SET 
       rating_avg = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE product_id = $1),
       rating_count = (SELECT COUNT(*)::int FROM reviews WHERE product_id = $1)
     WHERE id = $1;`,
    [productId]
  );

  return newReview;
}

export async function getProductReviews(productId, limit = 10, offset = 0) {
  const sql = `
    SELECT 
      r.id,
      r.order_id,
      r.product_id,
      r.rating,
      r.comment,
      r.created_at,
      u.name AS buyer_name
    FROM reviews r
    JOIN users u ON r.buyer_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const res = await query(sql, [productId, limit, offset]);
  return res.rows;
}

export async function getProductRatingSummary(productId) {
  const sql = `
    SELECT 
      COUNT(*)::int AS total_reviews,
      COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS average_rating,
      COUNT(*) FILTER (WHERE rating = 5)::int AS count_5,
      COUNT(*) FILTER (WHERE rating = 4)::int AS count_4,
      COUNT(*) FILTER (WHERE rating = 3)::int AS count_3,
      COUNT(*) FILTER (WHERE rating = 2)::int AS count_2,
      COUNT(*) FILTER (WHERE rating = 1)::int AS count_1
    FROM reviews
    WHERE product_id = $1;
  `;
  const res = await query(sql, [productId]);
  const data = res.rows[0] || {
    total_reviews: 0,
    average_rating: 0,
    count_5: 0,
    count_4: 0,
    count_3: 0,
    count_2: 0,
    count_1: 0,
  };

  const total = data.total_reviews || 0;
  const distribution = [
    { star: 5, count: data.count_5, percentage: total > 0 ? Math.round((data.count_5 / total) * 100) : 0 },
    { star: 4, count: data.count_4, percentage: total > 0 ? Math.round((data.count_4 / total) * 100) : 0 },
    { star: 3, count: data.count_3, percentage: total > 0 ? Math.round((data.count_3 / total) * 100) : 0 },
    { star: 2, count: data.count_2, percentage: total > 0 ? Math.round((data.count_2 / total) * 100) : 0 },
    { star: 1, count: data.count_1, percentage: total > 0 ? Math.round((data.count_1 / total) * 100) : 0 },
  ];

  return {
    totalReviews: total,
    averageRating: Number(data.average_rating),
    distribution,
  };
}

export async function checkCanReview({ orderId, productId, buyerId }) {
  const sql = `
    SELECT 
      o.status,
      r.id AS existing_review_id
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN reviews r ON r.order_id = o.id AND r.product_id = oi.product_id AND r.buyer_id = $3
    WHERE o.id = $1 AND oi.product_id = $2 AND o.buyer_id = $3
    LIMIT 1;
  `;
  const res = await query(sql, [orderId, productId, buyerId]);
  const row = res.rows[0];

  if (!row) return false;
  return row.status === 'Selesai' && !row.existing_review_id;
}
