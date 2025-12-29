const express = require('express');
const wishlistService = require('./service');
const { authenticateToken } = require('../auth/middleware');

const router = express.Router();

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
});

router.post('/items', authenticateToken, async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const wishlist = await wishlistService.addItem(req.user.id, productId);
    res.status(201).json(wishlist);
  } catch (error) {
    next(error);
  }
});

router.delete('/items/:itemId', authenticateToken, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const wishlist = await wishlistService.removeItem(req.user.id, itemId);
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
});

router.delete('/', authenticateToken, async (req, res, next) => {
  try {
    const wishlist = await wishlistService.clear(req.user.id);
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
});

module.exports = router;