const express = require('express');
const cartService = require('./service');
const { authenticateToken } = require('../auth/middleware');

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// Add item to cart
router.post('/items', async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user.id, productId, quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// Update cart item quantity
router.put('/items/:itemId', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user.id, req.params.itemId, quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
router.delete('/items/:itemId', async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(req.user.id, req.params.itemId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// Clear cart
router.delete('/', async (req, res, next) => {
  try {
    const result = await cartService.clearCart(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
