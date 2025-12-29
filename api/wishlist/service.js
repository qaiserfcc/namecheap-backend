const db = require('../../database/db');

class WishlistService {
  async ensureWishlist(userId) {
    const existing = await db.query('SELECT id FROM wishlists WHERE user_id = $1', [userId]);

    if (existing.rows.length > 0) {
      return existing.rows[0].id;
    }

    const created = await db.query('INSERT INTO wishlists (user_id) VALUES ($1) RETURNING id', [userId]);
    return created.rows[0].id;
  }

  async getWishlist(userId) {
    const wishlistId = await this.ensureWishlist(userId);

    const items = await db.query(
      `SELECT wi.id, wi.created_at, p.id AS product_id, p.name, p.description, p.price, p.image_url, p.stock_quantity
       FROM wishlist_items wi
       JOIN products p ON wi.product_id = p.id
       WHERE wi.wishlist_id = $1 AND p.is_active = true`,
      [wishlistId]
    );

    return {
      id: wishlistId,
      items: items.rows,
      totalItems: items.rows.length
    };
  }

  async addItem(userId, productId) {
    const wishlistId = await this.ensureWishlist(userId);

    const product = await db.query(
      'SELECT id FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (product.rows.length === 0) {
      throw new Error('Product not found');
    }

    await db.query(
      `INSERT INTO wishlist_items (wishlist_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (wishlist_id, product_id)
       DO UPDATE SET updated_at = CURRENT_TIMESTAMP`,
      [wishlistId, productId]
    );

    return this.getWishlist(userId);
  }

  async removeItem(userId, itemId) {
    const result = await db.query(
      `DELETE FROM wishlist_items wi
       USING wishlists w
       WHERE wi.wishlist_id = w.id
       AND wi.id = $1
       AND w.user_id = $2
       RETURNING wi.id`,
      [itemId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Wishlist item not found');
    }

    return this.getWishlist(userId);
  }

  async clear(userId) {
    await db.query(
      `DELETE FROM wishlist_items wi
       USING wishlists w
       WHERE wi.wishlist_id = w.id
       AND w.user_id = $1`,
      [userId]
    );

    return this.getWishlist(userId);
  }
}

module.exports = new WishlistService();