const express = require('express');
const adminService = require('./service');
const { authenticateToken, requireAdmin } = require('../auth/middleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Get all users
router.get('/users', async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers(req.query);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get all orders
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await adminService.getAllOrders(req.query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get sales report
router.get('/reports/sales', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await adminService.getSalesReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

// Get top products
router.get('/reports/top-products', async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await adminService.getTopProducts(limit);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Update user role
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.params.id, role);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Deactivate user
router.delete('/users/:id', async (req, res, next) => {
  try {
    const result = await adminService.deactivateUser(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
