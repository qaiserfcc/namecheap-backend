const db = require('../../database/db');

class NotificationService {
  async createNotification(userId, type, title, message) {
    const result = await db.query(
      `INSERT INTO notifications (user_id, type, title, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, type, title, message]
    );

    return result.rows[0];
  }

  async getUserNotifications(userId, filters = {}) {
    const { isRead, limit = 50, offset = 0 } = filters;

    let query = 'SELECT * FROM notifications WHERE user_id = $1';
    const params = [userId];
    let paramCount = 2;

    if (isRead !== undefined) {
      query += ` AND is_read = $${paramCount}`;
      params.push(isRead);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  async markAsRead(userId, notificationId) {
    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Notification not found');
    }

    return result.rows[0];
  }

  async markAllAsRead(userId) {
    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    );

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(userId, notificationId) {
    const result = await db.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id',
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Notification not found');
    }

    return { message: 'Notification deleted successfully' };
  }

  async getUnreadCount(userId) {
    const result = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );

    return { count: parseInt(result.rows[0].count) };
  }

  // Helper methods to send notifications for various events
  async sendOrderConfirmation(userId, orderId, orderNumber) {
    return this.createNotification(
      userId,
      'order_confirmation',
      'Order Confirmed',
      `Your order ${orderNumber} has been confirmed and is being processed.`
    );
  }

  async sendOrderShipped(userId, orderId, orderNumber) {
    return this.createNotification(
      userId,
      'order_shipped',
      'Order Shipped',
      `Your order ${orderNumber} has been shipped and is on its way!`
    );
  }

  async sendOrderDelivered(userId, orderId, orderNumber) {
    return this.createNotification(
      userId,
      'order_delivered',
      'Order Delivered',
      `Your order ${orderNumber} has been delivered. Thank you for shopping with us!`
    );
  }

  async sendPaymentSuccess(userId, orderId, orderNumber) {
    return this.createNotification(
      userId,
      'payment_success',
      'Payment Successful',
      `Payment for order ${orderNumber} was successful.`
    );
  }

  async sendPaymentFailed(userId, orderId, orderNumber) {
    return this.createNotification(
      userId,
      'payment_failed',
      'Payment Failed',
      `Payment for order ${orderNumber} failed. Please try again.`
    );
  }
}

module.exports = new NotificationService();
