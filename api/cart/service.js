const db = require('../../database/db');

class CartService {
  async getCart(userId) {
    // Get or create cart for user
    let cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    let cartId;
    if (cartResult.rows.length === 0) {
      const newCart = await db.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Get cart items with product details
    const items = await db.query(
      `SELECT ci.id, ci.quantity, ci.price,
              p.id as product_id, p.name, p.description, p.image_url, p.stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1 AND p.is_active = true`,
      [cartId]
    );

    const total = items.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      id: cartId,
      items: items.rows,
      total: total.toFixed(2)
    };
  }

  async addToCart(userId, productId, quantity = 1) {
    // Get or create cart
    let cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    let cartId;
    if (cartResult.rows.length === 0) {
      const newCart = await db.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Check product availability
    const product = await db.query(
      'SELECT id, price, stock_quantity FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (product.rows.length === 0) {
      throw new Error('Product not found');
    }

    if (product.rows[0].stock_quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    // Check if item already in cart
    const existing = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );

    if (existing.rows.length > 0) {
      // Update quantity
      const newQuantity = existing.rows[0].quantity + quantity;
      await db.query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newQuantity, existing.rows[0].id]
      );
    } else {
      // Add new item
      await db.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [cartId, productId, quantity, product.rows[0].price]
      );
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId, itemId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, itemId);
    }

    // Verify cart ownership
    const result = await db.query(
      `SELECT ci.id, ci.product_id 
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.id = $1 AND c.user_id = $2`,
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Cart item not found');
    }

    // Check stock
    const product = await db.query(
      'SELECT stock_quantity FROM products WHERE id = $1',
      [result.rows[0].product_id]
    );

    if (product.rows[0].stock_quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    await db.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [quantity, itemId]
    );

    return this.getCart(userId);
  }

  async removeFromCart(userId, itemId) {
    // Verify cart ownership and delete
    const result = await db.query(
      `DELETE FROM cart_items ci
       USING carts c
       WHERE ci.cart_id = c.id
       AND ci.id = $1
       AND c.user_id = $2
       RETURNING ci.id`,
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Cart item not found');
    }

    return this.getCart(userId);
  }

  async clearCart(userId) {
    await db.query(
      `DELETE FROM cart_items ci
       USING carts c
       WHERE ci.cart_id = c.id
       AND c.user_id = $1`,
      [userId]
    );

    return { message: 'Cart cleared successfully' };
  }
}

module.exports = new CartService();
