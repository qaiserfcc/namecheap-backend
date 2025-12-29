const express = require('express');
const productService = require('./service');
const multer = require('multer');
const { authenticateToken, requireAdmin } = require('../auth/middleware');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Get all products with filters
router.get('/', async (req, res, next) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Get product categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Download CSV template (public)
router.get('/csv-template', async (req, res) => {
  const headers = ['name', 'description', 'price', 'category', 'sub_category', 'stock_quantity', 'image_url', 'variants'];
  const exampleVariants = JSON.stringify([
    { name: '500g', sku: 'SKU-500G', price: 2999, stock_quantity: 50, attributes: { size: '500g' } },
  ]);
  const exampleRow = ['Natural Honey', 'Pure natural honey', '2999.00', 'Health & Wellness', 'Natural Products', '100', 'https://example.com/image.jpg', exampleVariants]
    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
    .join(',');
  const csv = `${headers.join(',')}\n${exampleRow}\n`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="products-template.csv"');
  res.send(csv);
});

// Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Create product variant (admin only)
router.post('/:id/variants', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const variant = await productService.createVariant(req.params.id, req.body);
    res.status(201).json(variant);
  } catch (error) {
    next(error);
  }
});

// Update product variant (admin only)
router.put('/:id/variants/:variantId', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const variant = await productService.updateVariant(req.params.id, req.params.variantId, req.body);
    res.json(variant);
  } catch (error) {
    next(error);
  }
});

// Delete product variant (admin only)
router.delete('/:id/variants/:variantId', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const result = await productService.deleteVariant(req.params.id, req.params.variantId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// Bulk create products (admin only)
router.post('/bulk', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { products } = req.body;
    const createdProducts = await productService.bulkCreateProducts(products);
    res.status(201).json(createdProducts);
  } catch (error) {
    next(error);
  }
});

// Bulk upload products via CSV (admin only)
router.post('/bulk-upload', authenticateToken, requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required (field name: file)' });
    }

    const result = await productService.bulkUploadProductsFromCsv(req.file.buffer);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Toggle product active status (admin only)
router.patch('/:id/toggle', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const product = await productService.toggleProductStatus(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
