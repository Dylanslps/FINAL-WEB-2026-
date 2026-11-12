import { query } from './db.js';

export async function getCart(buyerId) {
  const sql = `
    SELECT 
      ci.id AS cart_item_id,
      ci.buyer_id,
      ci.product_id,
      ci.quantity,
      ci.created_at,
      p.name AS product_name,
      p.slug AS product_slug,
      p.price AS product_price,
      p.stock AS product_stock,
      p.image_url AS product_image,
      p.brand AS product_brand,
      s.id AS store_id,
      s.name AS store_name,
      (ci.quantity * p.price)::numeric(12, 2) AS subtotal
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    JOIN stores s ON p.store_id = s.id
    WHERE ci.buyer_id = $1
    ORDER BY ci.created_at DESC;
  `;

  const res = await query(sql, [buyerId]);
  const items = res.rows;

  const totalAmount = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const totalItems = items.reduce((acc, item) => acc + Number(item.quantity), 0);

  return {
    items,
    totalAmount,
    totalItems,
  };
}

export async function addToCart({ buyerId, productId, quantity = 1 }) {
  if (quantity < 1) {
    throw new Error('Jumlah pembelian minimal 1 item.');
  }

  const prodRes = await query('SELECT id, name, stock, price FROM products WHERE id = $1;', [productId]);
  const product = prodRes.rows[0];

  if (!product) {
    throw new Error('Produk tidak ditemukan.');
  }

  if (product.stock < 1) {
    throw new Error(`Stok produk "${product.name}" sedang habis.`);
  }

  const existingRes = await query(
    'SELECT id, quantity FROM cart_items WHERE buyer_id = $1 AND product_id = $2;',
    [buyerId, productId]
  );
  const existing = existingRes.rows[0];
  const currentQtyInCart = existing ? existing.quantity : 0;
  const newQty = currentQtyInCart + quantity;

  if (newQty > product.stock) {
    throw new Error(`Stok tidak mencukupi. Anda sudah memiliki ${currentQtyInCart} di keranjang (Maksimal: ${product.stock}).`);
  }

  const upsertSql = `
    INSERT INTO cart_items (buyer_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (buyer_id, product_id)
    DO UPDATE SET 
      quantity = cart_items.quantity + EXCLUDED.quantity,
      updated_at = NOW()
    RETURNING id, buyer_id, product_id, quantity;
  `;

  const res = await query(upsertSql, [buyerId, productId, quantity]);
  return res.rows[0];
}

export async function updateCartQuantity(cartItemId, buyerId, quantity) {
  if (quantity <= 0) {
    return await removeFromCart(cartItemId, buyerId);
  }

  const checkSql = `
    SELECT ci.id, ci.quantity, p.stock, p.name 
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.id = $1 AND ci.buyer_id = $2;
  `;
  const checkRes = await query(checkSql, [cartItemId, buyerId]);
  const item = checkRes.rows[0];

  if (!item) {
    throw new Error('Item keranjang tidak ditemukan.');
  }

  if (quantity > item.stock) {
    throw new Error(`Jumlah melebihi stok yang tersedia (${item.stock} item).`);
  }

  const updateSql = `
    UPDATE cart_items
    SET quantity = $1, updated_at = NOW()
    WHERE id = $2 AND buyer_id = $3
    RETURNING id, buyer_id, product_id, quantity;
  `;

  const res = await query(updateSql, [quantity, cartItemId, buyerId]);
  return res.rows[0];
}

export async function removeFromCart(cartItemId, buyerId) {
  const sql = `
    DELETE FROM cart_items 
    WHERE id = $1 AND buyer_id = $2
    RETURNING id;
  `;
  const res = await query(sql, [cartItemId, buyerId]);
  return res.rows[0] || null;
}

export async function clearCart(buyerId) {
  const sql = `DELETE FROM cart_items WHERE buyer_id = $1 RETURNING id;`;
  const res = await query(sql, [buyerId]);
  return res.rowCount;
}
