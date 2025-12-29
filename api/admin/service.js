const db = require('../../database/db');

class AdminService {
  async getDashboardStats() {
    // Get total users
    const usersResult = await db.query(
      'SELECT COUNT(*) as total_users FROM users WHERE is_active = true'
    );

    // Get total products
    const productsResult = await db.query(
      'SELECT COUNT(*) as total_products FROM products WHERE is_active = true'
    );

    // Get total orders
    const ordersResult = await db.query(
      'SELECT COUNT(*) as total_orders, SUM(final_amount) as total_revenue FROM orders'
    );

    // Get pending orders
    const pendingOrdersResult = await db.query(
      'SELECT COUNT(*) as pending_orders FROM orders WHERE status = $1',
      ['pending']
    );

    // Get recent orders
    const recentOrdersResult = await db.query(
      `SELECT o.*, u.email, u.first_name, u.last_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    // Get low stock products
    const lowStockResult = await db.query(
      `SELECT * FROM products 
       WHERE is_active = true AND stock_quantity < 10
       ORDER BY stock_quantity ASC
       LIMIT 10`
    );

    return {
      totalUsers: parseInt(usersResult.rows[0].total_users),
      totalProducts: parseInt(productsResult.rows[0].total_products),
      totalOrders: parseInt(ordersResult.rows[0].total_orders),
      totalRevenue: parseFloat(ordersResult.rows[0].total_revenue || 0),
      pendingOrders: parseInt(pendingOrdersResult.rows[0].pending_orders),
      recentOrders: recentOrdersResult.rows,
      lowStockProducts: lowStockResult.rows
    };
  }

  async getAllUsers(filters = {}) {
    const { role, isActive, limit = 50, offset = 0 } = filters;

    let query = 'SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    if (isActive !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(isActive);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  async getAllOrders(filters = {}) {
    const { status, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT o.*, u.email, u.first_name, u.last_name,
             COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` GROUP BY o.id, u.email, u.first_name, u.last_name ORDER BY o.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  async getSalesReport(startDate, endDate) {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        SUM(discount_amount) as total_discounts,
        SUM(final_amount) as net_sales
      FROM orders
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    const result = await db.query(query, [startDate, endDate]);
    return result.rows;
  }

  async getTopProducts(limit = 10) {
    const query = `
      SELECT 
        p.id, p.name, p.price, p.category,
        COUNT(oi.id) as order_count,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT $1
    `;

    const result = await db.query(query, [limit]);
    return result.rows;
  }

  async updateUserRole(userId, role) {
    const result = await db.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, role',
      [role, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0];
  }

  async deactivateUser(userId) {
    const result = await db.query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return { message: 'User deactivated successfully' };
  }
}

module.exports = new AdminService();
