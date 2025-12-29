const express = require('express');
const notificationService = require('./service');
const { authenticateToken } = require('../auth/middleware');

const router = express.Router();

// All notification routes require authentication
router.use(authenticateToken);

// Get user notifications
router.get('/', async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id, req.query);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// Get unread count
router.get('/unread-count', async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json(count);
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.user.id, req.params.id);
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

// Mark all as read
router.put('/read-all', async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Delete notification
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await notificationService.deleteNotification(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
