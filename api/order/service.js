const db = require('../../database/db');

class OrderService {
  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(userId, orderData) {
    const { shippingAddress, billingAddress, discountCode } = orderData;

    // Get cart items
    const cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      throw new Error('Cart not found');
    }

    const cartId = cartResult.rows[0].id;

    const cartItems = await db.query(
      `SELECT ci.product_id, ci.quantity, ci.price, p.name, p.stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1 AND p.is_active = true`,
      [cartId]
    );

    if (cartItems.rows.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of cartItems.rows) {
      if (item.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.name}`);
      }
      totalAmount += item.price * item.quantity;
    }

    // Apply discount if provided
    let discountAmount = 0;
    if (discountCode) {
      const discountResult = await db.query(
        `SELECT * FROM discounts 
         WHERE code = $1 AND is_active = true 
         AND (valid_from IS NULL OR valid_from <= CURRENT_TIMESTAMP)
         AND (valid_until IS NULL OR valid_until >= CURRENT_TIMESTAMP)
         AND (usage_limit IS NULL OR used_count < usage_limit)`,
        [discountCode]
      );

      if (discountResult.rows.length > 0) {
        const discount = discountResult.rows[0];
        
        if (totalAmount >= discount.min_order_amount) {
          if (discount.discount_type === 'percentage') {
            discountAmount = (totalAmount * discount.discount_value) / 100;
            if (discount.max_discount_amount && discountAmount > discount.max_discount_amount) {
              discountAmount = discount.max_discount_amount;
            }
          } else {
            discountAmount = discount.discount_value;
          }

          // Update discount usage
          await db.query(
            'UPDATE discounts SET used_count = used_count + 1 WHERE id = $1',
            [discount.id]
          );
        }
      }
    }

    const finalAmount = totalAmount - discountAmount;
    const orderNumber = this.generateOrderNumber();

    // Create order
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, order_number, total_amount, discount_amount, final_amount, 
                          shipping_address, billing_address, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [userId, orderNumber, totalAmount, discountAmount, finalAmount, shippingAddress, billingAddress]
    );

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of cartItems.rows) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, item.name, item.quantity, item.price, item.price * item.quantity]
      );

      // Update product stock
      await db.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    return this.getOrderById(userId, order.id);
  }

  async getOrders(userId, filters = {}) {
    const { status, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (status) {
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  async getOrderById(userId, orderId) {
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );

    order.items = itemsResult.rows;

    return order;
  }

  async updateOrderStatus(orderId, status) {
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      throw new Error('Order not found');
    }

    return result.rows[0];
  }

  async cancelOrder(userId, orderId) {
    const order = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (order.rows.length === 0) {
      throw new Error('Order not found');
    }

    if (!['pending', 'confirmed'].includes(order.rows[0].status)) {
      throw new Error('Order cannot be cancelled');
    }

    // Restore product stock
    const items = await db.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
      [orderId]
    );

    for (const item of items.rows) {
      await db.query(
        'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    return this.updateOrderStatus(orderId, 'cancelled');
  }
}

module.exports = new OrderService();
