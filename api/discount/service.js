const db = require('../../database/db');

class DiscountService {
  async createDiscount(discountData) {
    const { 
      code, 
      description, 
      discountType, 
      discountValue, 
      minOrderAmount, 
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil
    } = discountData;

    const result = await db.query(
      `INSERT INTO discounts (code, description, discount_type, discount_value, 
                             min_order_amount, max_discount_amount, usage_limit, 
                             valid_from, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [code, description, discountType, discountValue, minOrderAmount, 
       maxDiscountAmount, usageLimit, validFrom, validUntil]
    );

    return result.rows[0];
  }

  async getAllDiscounts(filters = {}) {
    const { isActive, limit = 50, offset = 0 } = filters;

    let query = 'SELECT * FROM discounts WHERE 1=1';
    const params = [];
    let paramCount = 1;

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

  async getDiscountByCode(code) {
    const result = await db.query(
      'SELECT * FROM discounts WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      throw new Error('Discount code not found');
    }

    return result.rows[0];
  }

  async validateDiscount(code, orderAmount) {
    const result = await db.query(
      `SELECT * FROM discounts 
       WHERE code = $1 AND is_active = true
       AND (valid_from IS NULL OR valid_from <= CURRENT_TIMESTAMP)
       AND (valid_until IS NULL OR valid_until >= CURRENT_TIMESTAMP)
       AND (usage_limit IS NULL OR used_count < usage_limit)`,
      [code]
    );

    if (result.rows.length === 0) {
      return { valid: false, message: 'Invalid or expired discount code' };
    }

    const discount = result.rows[0];

    if (orderAmount < discount.min_order_amount) {
      return { 
        valid: false, 
        message: `Minimum order amount of $${discount.min_order_amount} required` 
      };
    }

    let discountAmount = 0;
    if (discount.discount_type === 'percentage') {
      discountAmount = (orderAmount * discount.discount_value) / 100;
      if (discount.max_discount_amount && discountAmount > discount.max_discount_amount) {
        discountAmount = discount.max_discount_amount;
      }
    } else {
      discountAmount = discount.discount_value;
    }

    return {
      valid: true,
      discount: discount,
      discountAmount: discountAmount.toFixed(2),
      finalAmount: (orderAmount - discountAmount).toFixed(2)
    };
  }

  async updateDiscount(id, updates) {
    const { 
      description, 
      discountType, 
      discountValue, 
      minOrderAmount, 
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil,
      isActive
    } = updates;

    const result = await db.query(
      `UPDATE discounts 
       SET description = COALESCE($1, description),
           discount_type = COALESCE($2, discount_type),
           discount_value = COALESCE($3, discount_value),
           min_order_amount = COALESCE($4, min_order_amount),
           max_discount_amount = COALESCE($5, max_discount_amount),
           usage_limit = COALESCE($6, usage_limit),
           valid_from = COALESCE($7, valid_from),
           valid_until = COALESCE($8, valid_until),
           is_active = COALESCE($9, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [description, discountType, discountValue, minOrderAmount, maxDiscountAmount,
       usageLimit, validFrom, validUntil, isActive, id]
    );

    if (result.rows.length === 0) {
      throw new Error('Discount not found');
    }

    return result.rows[0];
  }

  async deleteDiscount(id) {
    const result = await db.query(
      'UPDATE discounts SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Discount not found');
    }

    return { message: 'Discount deleted successfully' };
  }
}

module.exports = new DiscountService();
