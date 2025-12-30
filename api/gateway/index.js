const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('../auth/routes');
const productRoutes = require('../product/routes');
const cartRoutes = require('../cart/routes');
const wishlistRoutes = require('../wishlist/routes');
const orderRoutes = require('../order/routes');
const paymentRoutes = require('../payment/routes');
const discountRoutes = require('../discount/routes');
const adminRoutes = require('../admin/routes');
const notificationRoutes = require('../notification/routes');
const contentRoutes = require('../content/routes');

const openapiSpec = require('./openapi.json');

const app = express();

// CORS configuration for frontend integration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Namecheap E-Commerce API Gateway', 
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Namecheap E-Commerce API',
    version: '1.0.0',
    description: 'Backend API for e-commerce platform',
    endpoints: {
      health: '/api/health',
      info: '/api/info',
      time: '/api/time',
      echo: '/api/echo',
      docs: '/api/docs'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Time endpoint - returns server time in various formats
app.get('/api/time', (req, res) => {
  const now = new Date();
  res.json({
    timestamp: now.toISOString(),
    unix: Math.floor(now.getTime() / 1000),
    formatted: now.toLocaleString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    utc: now.toUTCString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
});

// Echo endpoint - echoes back the request data (useful for testing)
app.post('/api/echo', (req, res) => {
  res.json({
    message: 'Echo response',
    receivedData: req.body,
    headers: {
      'content-type': req.get('content-type'),
      'user-agent': req.get('user-agent')
    },
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// OpenAPI / Swagger
app.get('/api/openapi.json', (req, res) => {
  res.json(openapiSpec);
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// Route to different services
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/content', contentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });
}

module.exports = app;
