const db = require('../../database/db');

class PaymentService {
  async createPayment(orderId, paymentData) {
    const { paymentMethod, transactionId } = paymentData;

    // Verify order exists
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      throw new Error('Order not found');
    }

    const order = orderResult.rows[0];

    // Create payment record
    const result = await db.query(
      `INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, amount)
       VALUES ($1, $2, 'pending', $3, $4)
       RETURNING *`,
      [orderId, paymentMethod, transactionId, order.final_amount]
    );

    return result.rows[0];
  }

  async processPayment(paymentId, userId) {
    // ============================================================================
    // IMPORTANT: This is a SIMULATED payment processor for development/testing!
    // In production, replace this with actual payment gateway integration such as:
    // - Stripe: https://stripe.com/docs/api
    // - PayPal: https://developer.paypal.com/
    // - Square: https://developer.squareup.com/
    // This simulation has a 90% success rate to demonstrate error handling.
    // ============================================================================
    
    const paymentResult = await db.query(
      `SELECT p.*, o.user_id 
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE p.id = $1`,
      [paymentId]
    );

    if (paymentResult.rows.length === 0) {
      throw new Error('Payment not found');
    }

    const payment = paymentResult.rows[0];

    if (payment.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    // SIMULATION: Random success/failure (90% success rate)
    // TODO: Replace with actual payment gateway API call
    const success = Math.random() > 0.1;

    const status = success ? 'completed' : 'failed';

    await db.query(
      'UPDATE payments SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, paymentId]
    );

    if (success) {
      // Update order status
      await db.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        ['confirmed', payment.order_id]
      );
    }

    const updatedPayment = await db.query(
      'SELECT * FROM payments WHERE id = $1',
      [paymentId]
    );

    return updatedPayment.rows[0];
  }

  async getPaymentByOrderId(orderId, userId) {
    const result = await db.query(
      `SELECT p.* 
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       WHERE p.order_id = $1 AND o.user_id = $2`,
      [orderId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Payment not found');
    }

    return result.rows[0];
  }

  async refundPayment(paymentId) {
    const result = await db.query(
      `UPDATE payments 
       SET payment_status = 'refunded', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [paymentId]
    );

    if (result.rows.length === 0) {
      throw new Error('Payment not found');
    }

    return result.rows[0];
  }
}

module.exports = new PaymentService();
