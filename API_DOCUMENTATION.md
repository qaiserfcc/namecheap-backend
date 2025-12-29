# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses follow this format:
```json
{
  "data": {},
  "error": null
}
```

Or in case of error:
```json
{
  "error": {
    "message": "Error message",
    "status": 400
  }
}
```

## Endpoints

### Health Check
```
GET /api/health
```
Returns the API status.

---

## Authentication Endpoints

### Register
```
POST /api/auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```
**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:** Same as register

### Get Profile
```
GET /api/auth/profile
```
**Headers:** Authorization required
**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "role": "customer"
}
```

---

## Product Endpoints

### Get All Products
```
GET /api/products?category=Health&search=tea&minPrice=10&maxPrice=50&limit=20
```
**Query Parameters:**
- `category` (optional): Filter by category
- `subCategory` (optional): Filter by subcategory
- `search` (optional): Search in name and description
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
[
  {
    "id": 1,
    "name": "Natural Honey",
    "description": "Pure organic honey",
    "price": 29.99,
    "category": "Health & Wellness",
    "sub_category": "Natural Products",
    "stock_quantity": 100,
    "image_url": "https://...",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Product by ID
```
GET /api/products/:id
```
**Response:** Single product object

### Create Product (Admin Only)
```
POST /api/products
```
**Headers:** Authorization required (admin)
**Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "category": "Category",
  "subCategory": "Subcategory",
  "stockQuantity": 100,
  "imageUrl": "https://..."
}
```

### Bulk Create Products (Admin Only)
```
POST /api/products/bulk
```
**Headers:** Authorization required (admin)
**Body:**
```json
{
  "products": [
    {
      "name": "Product 1",
      "price": 29.99,
      "category": "Category",
      "stockQuantity": 100
    },
    {
      "name": "Product 2",
      "price": 39.99,
      "category": "Category",
      "stockQuantity": 50
    }
  ]
}
```

---

## Cart Endpoints

### Get Cart
```
GET /api/cart
```
**Headers:** Authorization required
**Response:**
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "quantity": 2,
      "price": 29.99,
      "product_id": 1,
      "name": "Natural Honey",
      "stock_quantity": 100
    }
  ],
  "total": "59.98"
}
```

### Add to Cart
```
POST /api/cart/items
```
**Headers:** Authorization required
**Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

### Update Cart Item
```
PUT /api/cart/items/:itemId
```
**Headers:** Authorization required
**Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
```
DELETE /api/cart/items/:itemId
```
**Headers:** Authorization required

---

## Order Endpoints

### Create Order
```
POST /api/orders
```
**Headers:** Authorization required
**Body:**
```json
{
  "shippingAddress": "123 Main St, City, Country",
  "billingAddress": "123 Main St, City, Country",
  "discountCode": "WELCOME10"
}
```
**Response:**
```json
{
  "id": 1,
  "order_number": "ORD-1234567890-123",
  "total_amount": 100.00,
  "discount_amount": 10.00,
  "final_amount": 90.00,
  "status": "pending",
  "items": [...]
}
```

### Get Orders
```
GET /api/orders?status=pending
```
**Headers:** Authorization required
**Query Parameters:**
- `status` (optional): Filter by status

### Get Order by ID
```
GET /api/orders/:id
```
**Headers:** Authorization required

### Cancel Order
```
POST /api/orders/:id/cancel
```
**Headers:** Authorization required

---

## Payment Endpoints

### Create Payment
```
POST /api/payments
```
**Headers:** Authorization required
**Body:**
```json
{
  "orderId": 1,
  "paymentMethod": "card",
  "transactionId": "txn_123456"
}
```

### Process Payment
```
POST /api/payments/:id/process
```
**Headers:** Authorization required

---

## Discount Endpoints

### Validate Discount Code
```
POST /api/discounts/validate
```
**Body:**
```json
{
  "code": "WELCOME10",
  "orderAmount": 100.00
}
```
**Response:**
```json
{
  "valid": true,
  "discount": {...},
  "discountAmount": "10.00",
  "finalAmount": "90.00"
}
```

---

## Admin Endpoints

### Get Dashboard Stats
```
GET /api/admin/dashboard
```
**Headers:** Authorization required (admin)
**Response:**
```json
{
  "totalUsers": 100,
  "totalProducts": 50,
  "totalOrders": 200,
  "totalRevenue": 10000.00,
  "pendingOrders": 15,
  "recentOrders": [...],
  "lowStockProducts": [...]
}
```

### Get All Users
```
GET /api/admin/users?role=customer
```
**Headers:** Authorization required (admin)

### Get All Orders
```
GET /api/admin/orders?status=pending
```
**Headers:** Authorization required (admin)

### Get Sales Report
```
GET /api/admin/reports/sales?startDate=2024-01-01&endDate=2024-12-31
```
**Headers:** Authorization required (admin)

---

## Notification Endpoints

### Get Notifications
```
GET /api/notifications?isRead=false
```
**Headers:** Authorization required

### Get Unread Count
```
GET /api/notifications/unread-count
```
**Headers:** Authorization required

### Mark as Read
```
PUT /api/notifications/:id/read
```
**Headers:** Authorization required

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
