const db = require('../../database/db');

class ProductService {
  async getAllProducts(filters = {}) {
    const { category, subCategory, search, minPrice, maxPrice, limit = 50, offset = 0 } = filters;
    
    let query = 'SELECT * FROM products WHERE is_active = true';
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (subCategory) {
      query += ` AND sub_category = $${paramCount}`;
      params.push(subCategory);
      paramCount++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (minPrice) {
      query += ` AND price >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice) {
      query += ` AND price <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  async getProductById(id) {
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }

    return result.rows[0];
  }

  async createProduct(productData) {
    const { name, description, price, category, subCategory, stockQuantity, imageUrl } = productData;

    const result = await db.query(
      `INSERT INTO products (name, description, price, category, sub_category, stock_quantity, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, price, category, subCategory, stockQuantity || 0, imageUrl]
    );

    return result.rows[0];
  }

  async updateProduct(id, updates) {
    const { name, description, price, category, subCategory, stockQuantity, imageUrl, isActive } = updates;

    const result = await db.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category = COALESCE($4, category),
           sub_category = COALESCE($5, sub_category),
           stock_quantity = COALESCE($6, stock_quantity),
           image_url = COALESCE($7, image_url),
           is_active = COALESCE($8, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, description, price, category, subCategory, stockQuantity, imageUrl, isActive, id]
    );

    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }

    return result.rows[0];
  }

  async deleteProduct(id) {
    const result = await db.query(
      'UPDATE products SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }

    return { message: 'Product deleted successfully' };
  }

  async bulkCreateProducts(products) {
    const createdProducts = [];

    for (const product of products) {
      try {
        const created = await this.createProduct(product);
        createdProducts.push(created);
      } catch (error) {
        console.error('Error creating product:', product.name, error);
      }
    }

    return createdProducts;
  }

  async getCategories() {
    const result = await db.query(
      `SELECT DISTINCT category, sub_category 
       FROM products 
       WHERE is_active = true AND category IS NOT NULL
       ORDER BY category, sub_category`
    );

    const categories = {};
    result.rows.forEach(row => {
      if (!categories[row.category]) {
        categories[row.category] = [];
      }
      if (row.sub_category && !categories[row.category].includes(row.sub_category)) {
        categories[row.category].push(row.sub_category);
      }
    });

    return categories;
  }
}

module.exports = new ProductService();
