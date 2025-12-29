const express = require('express');
const paymentService = require('./service');
const { authenticateToken, requireAdmin } = require('../auth/middleware');

const router = express.Router();

// All payment routes require authentication
router.use(authenticateToken);

// Create payment for order
router.post('/', async (req, res, next) => {
  try {
    const { orderId, paymentMethod, transactionId } = req.body;
    const payment = await paymentService.createPayment(orderId, { paymentMethod, transactionId });
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
});

// Process payment
router.post('/:id/process', async (req, res, next) => {
  try {
    const payment = await paymentService.processPayment(req.params.id, req.user.id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

// Get payment for order
router.get('/order/:orderId', async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByOrderId(req.params.orderId, req.user.id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

// Refund payment (admin only)
router.post('/:id/refund', requireAdmin, async (req, res, next) => {
  try {
    const payment = await paymentService.refundPayment(req.params.id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
