import pool, { query } from './db.js';

export async function checkoutOrder({ buyerId, shippingAddress, notes = '' }) {
  if (!shippingAddress || shippingAddress.trim() === '') {
    throw new Error('Alamat pengiriman wajib diisi.');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cartSql = `
      SELECT 
        ci.id AS cart_item_id,
        ci.product_id,
        ci.quantity,
        p.name AS product_name,
        p.price,
        p.stock,
        p.store_id
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.buyer_id = $1
      FOR UPDATE OF p;
    `;
    const cartRes = await client.query(cartSql, [buyerId]);
    const cartItems = cartRes.rows;

    if (cartItems.length === 0) {
      throw new Error('Keranjang belanja Anda kosong.');
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        throw new Error(
          `Stok produk "${item.product_name}" tidak mencukupi. (Diminta: ${item.quantity}, Tersedia: ${item.stock})`
        );
      }
      totalAmount += Number(item.price) * item.quantity;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-2026-ESP${Date.now().toString().slice(-5)}${randomSuffix}`;

    const insertOrderSql = `
      INSERT INTO orders (order_number, buyer_id, total_amount, shipping_address, notes, status)
      VALUES ($1, $2, $3, $4, $5, 'Menunggu Pembayaran')
      RETURNING id, order_number, total_amount, status, created_at;
    `;
    const orderRes = await client.query(insertOrderSql, [
      orderNumber,
      buyerId,
      totalAmount,
      shippingAddress.trim(),
      notes ? notes.trim() : null,
    ]);
    const newOrder = orderRes.rows[0];

    for (const item of cartItems) {
      const subtotal = Number(item.price) * item.quantity;
      await client.query(
        `INSERT INTO order_items (order_id, product_id, store_id, quantity, price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [newOrder.id, item.product_id, item.store_id, item.quantity, item.price, subtotal]
      );

      await client.query(
        `UPDATE products 
         SET stock = stock - $1, updated_at = NOW() 
         WHERE id = $2;`,
        [item.quantity, item.product_id]
      );
    }

    await client.query('DELETE FROM cart_items WHERE buyer_id = $1;', [buyerId]);

    await client.query('COMMIT');
    return newOrder;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getBuyerOrders(buyerId) {
  const sql = `
    SELECT 
      o.id,
      o.order_number,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.notes,
      o.created_at,
      COUNT(oi.id)::int AS total_items,
      ARRAY_AGG(p.name) AS product_names,
      (ARRAY_AGG(p.image_url))[1] AS thumbnail_image
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.buyer_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC;
  `;
  const res = await query(sql, [buyerId]);
  return res.rows;
}

export async function getOrderDetail(orderId) {
  const orderSql = `
    SELECT 
      o.id,
      o.order_number,
      o.buyer_id,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.notes,
      o.created_at,
      o.updated_at,
      u.name AS buyer_name,
      u.email AS buyer_email,
      u.phone AS buyer_phone
    FROM orders o
    JOIN users u ON o.buyer_id = u.id
    WHERE o.id = $1
    LIMIT 1;
  `;
  const orderRes = await query(orderSql, [orderId]);
  const order = orderRes.rows[0];

  if (!order) return null;

  const itemsSql = `
    SELECT 
      oi.id AS order_item_id,
      oi.product_id,
      oi.store_id,
      oi.quantity,
      oi.price,
      oi.subtotal,
      p.name AS product_name,
      p.slug AS product_slug,
      p.image_url AS product_image,
      s.name AS store_name,
      r.id AS review_id,
      r.rating AS review_rating,
      r.comment AS review_comment
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN stores s ON oi.store_id = s.id
    LEFT JOIN reviews r ON r.order_id = oi.order_id AND r.product_id = oi.product_id
    WHERE oi.order_id = $1;
  `;
  const itemsRes = await query(itemsSql, [orderId]);
  order.items = itemsRes.rows;

  return order;
}

export async function updateOrderStatus(orderId, newStatus) {
  const validStatuses = ['Menunggu Pembayaran', 'Diproses', 'Selesai', 'Dibatalkan'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Status "${newStatus}" tidak valid.`);
  }

  const sql = `
    UPDATE orders
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, order_number, status, updated_at;
  `;
  const res = await query(sql, [newStatus, orderId]);
  return res.rows[0] || null;
}

export async function getSellerOrders(sellerId) {
  const sql = `
    SELECT DISTINCT
      o.id,
      o.order_number,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.created_at,
      u.name AS buyer_name,
      u.email AS buyer_email,
      COUNT(oi.id)::int AS items_count,
      SUM(oi.subtotal)::numeric(12, 2) AS store_subtotal
    FROM orders o
    JOIN users u ON o.buyer_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN stores s ON oi.store_id = s.id
    WHERE s.seller_id = $1
    GROUP BY o.id, u.name, u.email
    ORDER BY o.created_at DESC;
  `;
  const res = await query(sql, [sellerId]);
  return res.rows;
}
