const express = require('express');
const orderService = require('./service');
const { authenticateToken, requireAdmin } = require('../auth/middleware');

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Get user's orders
router.get('/', async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.user.id, req.query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Create new order
router.post('/', async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// Get specific order
router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.user.id, req.params.id);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Cancel order
router.post('/:id/cancel', async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.user.id, req.params.id);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Update order status (admin only)
router.put('/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
