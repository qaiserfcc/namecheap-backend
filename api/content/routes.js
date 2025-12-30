const express = require('express');
const contentService = require('./service');

const router = express.Router();

// Get homepage content
router.get('/homepage', async (req, res, next) => {
  try {
    const content = await contentService.getHomepageContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

// Get about page content
router.get('/about', async (req, res, next) => {
  try {
    const content = await contentService.getAboutContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

// Get features content
router.get('/features', async (req, res, next) => {
  try {
    const content = await contentService.getFeaturesContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

// Get testimonials
router.get('/testimonials', async (req, res, next) => {
  try {
    const content = await contentService.getTestimonials();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

// Get FAQ content
router.get('/faq', async (req, res, next) => {
  try {
    const content = await contentService.getFAQContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

// Get promotional banners
router.get('/banners', async (req, res, next) => {
  try {
    const content = await contentService.getPromotionalBanners();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
