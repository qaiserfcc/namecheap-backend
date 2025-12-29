const express = require('express');
const discountService = require('./service');
const { authenticateToken, requireAdmin } = require('../auth/middleware');

const router = express.Router();

// Validate discount code (public)
router.post('/validate', async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const result = await discountService.validateDiscount(code, orderAmount);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get all discounts (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const discounts = await discountService.getAllDiscounts(req.query);
    res.json(discounts);
  } catch (error) {
    next(error);
  }
});

// Get discount by code (admin only)
router.get('/:code', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const discount = await discountService.getDiscountByCode(req.params.code);
    res.json(discount);
  } catch (error) {
    next(error);
  }
});

// Create discount (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const discount = await discountService.createDiscount(req.body);
    res.status(201).json(discount);
  } catch (error) {
    next(error);
  }
});

// Update discount (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const discount = await discountService.updateDiscount(req.params.id, req.body);
    res.json(discount);
  } catch (error) {
    next(error);
  }
});

// Delete discount (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const result = await discountService.deleteDiscount(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
