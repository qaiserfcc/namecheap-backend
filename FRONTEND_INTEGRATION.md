# Frontend Integration Guide

This guide explains how to integrate a frontend application with the Namecheap Backend API.

## Prerequisites

- The backend API must be running and accessible
- Frontend application configured to make HTTP requests

## Configuration

### 1. Backend Setup

Ensure your backend `.env` file has the correct `FRONTEND_URL`:

```env
FRONTEND_URL=http://localhost:3001
# or for production
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Frontend Configuration

In your frontend application, configure the API base URL:

**For React/Next.js:**
```javascript
// config.js or .env file
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export default {
  apiUrl: API_BASE_URL
};
```

**For Vue.js:**
```javascript
// config.js
export default {
  apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
};
```

## Authentication Flow

### 1. User Registration

```javascript
const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName
    })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Store token in localStorage or state management
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.error.message);
  }
};
```

### 2. User Login

```javascript
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.error.message);
  }
};
```

### 3. Making Authenticated Requests

```javascript
const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error.message);
  }
};
```

## API Service Example

Create a reusable API service for your frontend:

```javascript
// api.service.js
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.getToken() && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    const config = {
      ...options,
      headers
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Product methods
  async getProducts(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/products?${queryString}`, { skipAuth: true });
  }

  async getProduct(id) {
    return this.request(`/products/${id}`, { skipAuth: true });
  }

  // Cart methods
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
  }

  // Order methods
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }
}

// Export instance
const apiService = new ApiService(process.env.REACT_APP_API_URL || 'http://localhost:3000/api');
export default apiService;
```

## Using the API Service

```javascript
// In your React component
import React, { useEffect, useState } from 'react';
import apiService from './services/api.service';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

All API errors follow this format:

```javascript
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

Handle errors consistently:

```javascript
try {
  const data = await apiService.someMethod();
  // Handle success
} catch (error) {
  // error.message contains the error description
  console.error('API Error:', error.message);
  // Show error to user
}
```

## CORS

The backend is configured to accept requests from the URL specified in `FRONTEND_URL` environment variable. Make sure this is set correctly in production.

## Production Deployment

### Backend
1. Deploy backend to your hosting platform (Vercel, Heroku, etc.)
2. Set environment variables in hosting platform
3. Note the backend URL (e.g., `https://api.yourdomain.com`)

### Frontend
1. Update API URL in your frontend configuration to point to the deployed backend
2. Deploy frontend to your hosting platform
3. Update backend's `FRONTEND_URL` environment variable to match your frontend URL

## Example Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-production-secret
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

**Frontend (.env or .env.production):**
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Testing the Integration

1. Start the backend: `npm start` or `npm run dev`
2. Start your frontend application
3. Test user registration and login
4. Test product browsing
5. Test cart operations
6. Test checkout flow

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend `.env`
- Check that frontend is making requests to the correct API URL
- In development, you may need to set `FRONTEND_URL=*` temporarily

### Authentication Errors
- Verify JWT token is being sent in Authorization header
- Check token format: `Bearer <token>`
- Ensure token hasn't expired (7-day expiration)

### Connection Errors
- Verify backend is running and accessible
- Check API URL is correct in frontend configuration
- Test API health endpoint: `GET /api/health`

## Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [README](./README.md) - Backend setup and deployment guide
