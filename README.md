# E-Commerce Backend API

Backend API for e-commerce platform built with Node.js (Express) and PostgreSQL. This is a microservices-style architecture designed to be consumed by frontend applications.

## 🏗️ Architecture

This backend follows a microservices-style architecture with the following services:

- **API Gateway**: Central routing and middleware handling
- **Auth/User Service**: User registration, login, JWT authentication
- **Product Service**: Product CRUD operations, bulk uploads, categories
- **Cart Service**: Shopping cart management
- **Order Service**: Order creation, tracking, and management
- **Payment Service**: Payment processing simulation
- **Discount Service**: Coupon codes and promotions
- **Admin Service**: Dashboard, reports, user management
- **Notification Service**: User notifications
- **Content Service**: Homepage, about, features, testimonials, FAQ content for frontend

## 🚀 Features

### API Capabilities
- ✅ JWT-based authentication and authorization
- ✅ User management (registration, login, profile)
- ✅ Product catalog with categories and subcategories
- ✅ Shopping cart management
- ✅ Order processing and tracking
- ✅ Payment processing (simulated)
- ✅ Discount/coupon system
- ✅ Admin dashboard and reports
- ✅ Notification system
- ✅ Content API for homepage and marketing pages
- ✅ CORS support for frontend integration
- ✅ Security with Helmet middleware
- ✅ Request logging with Morgan
- ✅ Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs (password hashing), Helmet (security headers)
- **Middleware**: CORS, Morgan (logging)
- **Environment**: dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/qaiserfcc/namecheap-backend.git
cd namecheap-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database and run the schema:

```bash
# Connect to PostgreSQL
psql -U your_username -d postgres

# Create database
CREATE DATABASE ecommerce_db;

# Connect to the database
\c ecommerce_db

# Run schema
\i database/schema.sql

# (Optional) Load seed data
\i database/seed.sql
```

### 4. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

### 5. Running the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

The API will be available at: `http://localhost:3000/api`

## 📁 Project Structure

```
namecheap-backend/
├── api/
│   ├── gateway/          # API Gateway - main entry point
│   ├── auth/             # Authentication service
│   ├── product/          # Product service
│   ├── cart/             # Cart service
│   ├── order/            # Order service
│   ├── payment/          # Payment service
│   ├── discount/         # Discount service
│   ├── admin/            # Admin service
│   └── notification/     # Notification service
├── database/
│   ├── schema.sql        # Database schema
│   ├── seed.sql          # Seed data
│   ├── init.sh           # Database initialization script
│   └── db.js             # Database connection utilities
├── .env.example          # Environment template
├── .gitignore
├── package.json
├── API_DOCUMENTATION.md  # Detailed API documentation
└── README.md
```

## 🔐 API Endpoints

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Quick Overview

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `POST /api/auth/change-password` - Change password (protected)

#### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/categories` - Get product categories
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `POST /api/products/bulk` - Bulk create products (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

#### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/items` - Add item to cart (protected)
- `PUT /api/cart/items/:itemId` - Update cart item (protected)
- `DELETE /api/cart/items/:itemId` - Remove from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

#### Orders
- `GET /api/orders` - Get user orders (protected)
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `POST /api/orders/:id/cancel` - Cancel order (protected)
- `PUT /api/orders/:id/status` - Update order status (admin)

#### Payments
- `POST /api/payments` - Create payment (protected)
- `POST /api/payments/:id/process` - Process payment (protected)
- `GET /api/payments/order/:orderId` - Get payment by order (protected)
- `POST /api/payments/:id/refund` - Refund payment (admin)

#### Discounts
- `POST /api/discounts/validate` - Validate discount code
- `GET /api/discounts` - Get all discounts (admin)
- `POST /api/discounts` - Create discount (admin)
- `PUT /api/discounts/:id` - Update discount (admin)
- `DELETE /api/discounts/:id` - Delete discount (admin)

#### Admin
- `GET /api/admin/dashboard` - Get dashboard stats (admin)
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/orders` - Get all orders (admin)
- `GET /api/admin/reports/sales` - Get sales report (admin)
- `GET /api/admin/reports/top-products` - Get top products (admin)
- `PUT /api/admin/users/:id/role` - Update user role (admin)
- `DELETE /api/admin/users/:id` - Deactivate user (admin)

#### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `GET /api/notifications/unread-count` - Get unread count (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)
- `PUT /api/notifications/read-all` - Mark all as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

#### Content (Public)
- `GET /api/content/homepage` - Get homepage content bundle (featured products, categories, stats, hero)
- `GET /api/content/about` - Get about page content (mission, vision, values)
- `GET /api/content/features` - Get platform features and benefits
- `GET /api/content/testimonials` - Get customer testimonials
- `GET /api/content/faq` - Get FAQ content organized by category
- `GET /api/content/banners` - Get promotional banners based on active discounts

## 🔒 Authentication & Authorization

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **customer**: Regular users (default)
- **admin**: Administrative users with full access

## 🌐 CORS Configuration

The API is configured to accept requests from frontend applications. Update the `FRONTEND_URL` environment variable to match your frontend application's URL.

## 🧪 Testing

### Create Admin User

First, register a normal user, then update their role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Test API Endpoints

You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)
- Or any HTTP client

Example cURL request:

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📝 Development Notes

- All services share a single PostgreSQL database
- JWT tokens expire after 7 days
- Payment processing is simulated (90% success rate)
- Stock levels are automatically managed
- Orders can be cancelled if status is 'pending' or 'confirmed'

## 🚀 Deployment

### Vercel Deployment

This backend can be deployed to Vercel or any other Node.js hosting platform.

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL`
4. Deploy

### Other Platforms

You can also deploy to:
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean App Platform
- Google Cloud Run
- Any VPS with Node.js support

## 🔗 Frontend Integration

This backend is designed to work with a separate frontend application. The frontend should:

1. Make API requests to the backend URL
2. Include JWT tokens in the Authorization header for protected routes
3. Handle CORS properly (already configured on backend)

### Frontend Resources

For building a visually beautiful frontend with consistent theming:

- **[Frontend Design Guide](./FRONTEND_DESIGN_GUIDE.md)** - Complete design system with:
  - Color palette and typography guidelines
  - React component examples (Hero, ProductCard, Header)
  - CSS styling with design tokens
  - API integration patterns
  - Page layout examples

- **[Frontend Vercel Deployment Guide](./FRONTEND_VERCEL_DEPLOYMENT.md)** - Step-by-step guide to:
  - Deploy your frontend to Vercel
  - Configure environment variables
  - Set up custom domains
  - Continuous deployment setup

- **[API Documentation](./API_DOCUMENTATION.md)** - Detailed API reference
- **[Frontend Integration Guide](./FRONTEND_INTEGRATION.md)** - Basic integration patterns

### Using the Content API

The Content API provides structured data for building rich, visually appealing pages:

```javascript
// Get complete homepage content
const response = await fetch('http://localhost:3000/api/content/homepage');
const homepageData = await response.json();

// homepageData includes:
// - featuredProducts: Top selling products
// - categories: Product categories with counts
// - stats: Platform statistics
// - newProducts: Recently added products
// - bestSellers: Best selling products
// - hero: Hero section content with CTAs
```

Example frontend integration (using fetch):

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;

// Use token for protected requests
const profileResponse = await fetch('http://localhost:3000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Initial work - [qaiserfcc](https://github.com/qaiserfcc)

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.
