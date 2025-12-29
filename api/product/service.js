const db = require('../../database/db');
const { parse } = require('csv-parse/sync');

class ProductService {
  normalizeProductPayload(productData = {}) {
    return {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      subCategory: productData.subCategory ?? productData.sub_category,
      stockQuantity: productData.stockQuantity ?? productData.stock_quantity,
      imageUrl: productData.imageUrl ?? productData.image_url,
      isActive: productData.isActive ?? productData.is_active,
    };
  }

  async attachVariants(products) {
    if (!products || products.length === 0) return products;

    const productIds = products.map((p) => p.id);
    const variantsResult = await db.query(
      'SELECT * FROM product_variants WHERE is_active = true AND product_id = ANY($1::int[]) ORDER BY id ASC',
      [productIds]
    );

    const variantsByProductId = new Map();
    for (const variant of variantsResult.rows) {
      const list = variantsByProductId.get(variant.product_id) || [];
      list.push(variant);
      variantsByProductId.set(variant.product_id, list);
    }

    return products.map((product) => ({
      ...product,
      variants: variantsByProductId.get(product.id) || [],
    }));
  }

  async getAllProducts(filters = {}) {
    const { category, subCategory, sub_category, search, minPrice, maxPrice, limit = 50, offset = 0, includeInactive } = filters;
    const normalizedSubCategory = subCategory ?? sub_category;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (!includeInactive) {
      query += ' AND is_active = true';
    }

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (normalizedSubCategory) {
      query += ` AND sub_category = $${paramCount}`;
      params.push(normalizedSubCategory);
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
    return this.attachVariants(result.rows);
  }

  async getProductById(id) {
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }

    const product = result.rows[0];
    const withVariants = await this.attachVariants([product]);
    return withVariants[0];
  }

  async createProduct(productData) {
    const { name, description, price, category, subCategory, stockQuantity, imageUrl } = this.normalizeProductPayload(productData);

    const result = await db.query(
      `INSERT INTO products (name, description, price, category, sub_category, stock_quantity, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, price, category, subCategory, stockQuantity || 0, imageUrl]
    );

    return result.rows[0];
  }

  async updateProduct(id, updates) {
    const { name, description, price, category, subCategory, stockQuantity, imageUrl, isActive } = this.normalizeProductPayload(updates);

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

    const product = result.rows[0];
    const withVariants = await this.attachVariants([product]);
    return withVariants[0];
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

  async toggleProductStatus(id) {
    const result = await db.query(
      'UPDATE products SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }

    const withVariants = await this.attachVariants([result.rows[0]]);
    return withVariants[0];
  }

  async createVariant(productId, variantData) {
    const { name, sku, price, stock_quantity, stockQuantity, attributes } = variantData || {};
    const normalizedStock = stockQuantity ?? stock_quantity ?? 0;
    const normalizedAttributes = attributes ?? {};

    // Ensure product exists
    const productResult = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (productResult.rows.length === 0) {
      throw new Error('Product not found');
    }

    const result = await db.query(
      `INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [productId, name, sku, price, normalizedStock, normalizedAttributes]
    );

    return result.rows[0];
  }

  async bulkUploadProductsFromCsv(csvBuffer) {
    const content = csvBuffer.toString('utf-8');

    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    let success = 0;
    let failed = 0;
    const errors = [];

    for (let index = 0; index < records.length; index++) {
      const rowNumber = index + 2; // header is line 1
      const row = records[index] || {};

      const name = row.name;
      const rawPrice = row.price;
      const category = row.category;

      if (!name || !rawPrice || !category) {
        failed++;
        errors.push(`Row ${rowNumber}: missing required fields (name, price, category)`);
        continue;
      }

      const price = Number(rawPrice);
      if (Number.isNaN(price)) {
        failed++;
        errors.push(`Row ${rowNumber}: invalid price`);
        continue;
      }

      const stockQuantity = row.stock_quantity !== undefined && row.stock_quantity !== '' ? Number(row.stock_quantity) : 0;
      if (Number.isNaN(stockQuantity)) {
        failed++;
        errors.push(`Row ${rowNumber}: invalid stock_quantity`);
        continue;
      }

      const productPayload = {
        name,
        description: row.description || '',
        price,
        category,
        sub_category: row.sub_category || null,
        stock_quantity: stockQuantity,
        image_url: row.image_url || null,
        is_active: true,
      };

      let variants = [];
      if (row.variants) {
        try {
          variants = JSON.parse(row.variants);
          if (!Array.isArray(variants)) variants = [];
        } catch (e) {
          // Keep going, but record parse error
          variants = [];
          errors.push(`Row ${rowNumber}: could not parse variants JSON (skipped variants)`);
        }
      }

      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        const createdProduct = await client.query(
          `INSERT INTO products (name, description, price, category, sub_category, stock_quantity, image_url, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true)
           RETURNING *`,
          [
            productPayload.name,
            productPayload.description,
            productPayload.price,
            productPayload.category,
            productPayload.sub_category,
            productPayload.stock_quantity,
            productPayload.image_url,
          ]
        );

        const product = createdProduct.rows[0];

        if (variants.length > 0) {
          for (const variant of variants) {
            if (!variant || !variant.name || !variant.price) continue;
            await client.query(
              `INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes, is_active)
               VALUES ($1, $2, $3, $4, $5, $6, true)`,
              [
                product.id,
                variant.name,
                variant.sku || null,
                Number(variant.price),
                Number(variant.stock_quantity ?? 0),
                variant.attributes ?? {},
              ]
            );
          }
        }

        await client.query('COMMIT');
        success++;
      } catch (e) {
        await client.query('ROLLBACK');
        failed++;
        errors.push(`Row ${rowNumber}: ${e.message || 'failed to import product'}`);
      } finally {
        client.release();
      }
    }

    return { success, failed, errors };
  }

  async updateVariant(productId, variantId, updates) {
    const { name, sku, price, stock_quantity, stockQuantity, attributes, is_active, isActive } = updates || {};
    const normalizedStock = stockQuantity ?? stock_quantity;
    const normalizedIsActive = isActive ?? is_active;

    const result = await db.query(
      `UPDATE product_variants
       SET name = COALESCE($1, name),
           sku = COALESCE($2, sku),
           price = COALESCE($3, price),
           stock_quantity = COALESCE($4, stock_quantity),
           attributes = COALESCE($5, attributes),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND product_id = $8
       RETURNING *`,
      [name, sku, price, normalizedStock, attributes, normalizedIsActive, variantId, productId]
    );

    if (result.rows.length === 0) {
      throw new Error('Variant not found');
    }

    return result.rows[0];
  }

  async deleteVariant(productId, variantId) {
    const result = await db.query(
      'UPDATE product_variants SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND product_id = $2 RETURNING id',
      [variantId, productId]
    );

    if (result.rows.length === 0) {
      throw new Error('Variant not found');
    }

    return { message: 'Variant deleted successfully' };
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
