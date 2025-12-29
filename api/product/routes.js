const express = require('express');
const productService = require('./service');
const { authenticateToken, requireAdmin } = require('../auth/middleware');

const router = express.Router();

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

// Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
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

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
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
