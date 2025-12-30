# Frontend Quick Start Guide

Get your Namecheap Marketplace frontend up and running in minutes with this comprehensive guide.

## 🚀 Quick Overview

This guide will help you:
1. Create a beautiful, themed frontend that consumes our backend API
2. Integrate the Content API for rich homepage content
3. Deploy to Vercel

**Time to complete:** 30-60 minutes

---

## Prerequisites

✅ Node.js 14+ installed  
✅ GitHub account  
✅ Vercel account (free tier)  
✅ Basic knowledge of React/JavaScript

---

## Step 1: Create Your Frontend Project (5 minutes)

### Option A: Create React App

```bash
# Create new React app
npx create-react-app namecheap-frontend
cd namecheap-frontend

# Install additional dependencies
npm install axios
```

### Option B: Next.js (Recommended for Production)

```bash
# Create new Next.js app
npx create-next-app@latest namecheap-frontend
cd namecheap-frontend

# Install additional dependencies
npm install axios
```

---

## Step 2: Set Up API Configuration (5 minutes)

### Create API Client

Create `src/api/client.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

### Create Content API Service

Create `src/api/content.js`:

```javascript
import apiClient from './client';

export const contentAPI = {
  getHomepage: () => apiClient.get('/content/homepage'),
  getAbout: () => apiClient.get('/content/about'),
  getFeatures: () => apiClient.get('/content/features'),
  getTestimonials: () => apiClient.get('/content/testimonials'),
  getFAQ: () => apiClient.get('/content/faq'),
  getBanners: () => apiClient.get('/content/banners')
};

export const productAPI = {
  getProducts: (params) => apiClient.get('/products', { params }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  getCategories: () => apiClient.get('/products/categories')
};
```

### Environment Configuration

Create `.env`:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

Create `.env.production`:

```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
REACT_APP_ENV=production
```

---

## Step 3: Create Design System (10 minutes)

### Create Global Styles

Create `src/styles/variables.css`:

```css
:root {
  /* Primary Colors */
  --primary-blue: #0066CC;
  --primary-dark: #004B99;
  --primary-light: #3385D6;
  
  /* Secondary Colors */
  --secondary-green: #00A86B;
  --secondary-orange: #FF6B35;
  --secondary-purple: #8B5CF6;
  
  /* Neutral Colors */
  --gray-900: #1A202C;
  --gray-800: #2D3748;
  --gray-700: #4A5568;
  --gray-600: #718096;
  --gray-500: #A0AEC0;
  --gray-400: #CBD5E0;
  --gray-300: #E2E8F0;
  --gray-200: #EDF2F7;
  --gray-100: #F7FAFC;
  --white: #FFFFFF;
  
  /* Semantic Colors */
  --success: #48BB78;
  --warning: #F6AD55;
  --error: #F56565;
  --info: #4299E1;
  
  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-heading: 'Poppins', 'Inter', sans-serif;
  
  /* Spacing */
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  
  /* Border Radius */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-primary);
  color: var(--gray-900);
  background: var(--gray-100);
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
```

Import in `src/index.js` or `src/App.js`:

```javascript
import './styles/variables.css';
```

---

## Step 4: Build Homepage (15 minutes)

### Create Hero Component

Create `src/components/Hero.jsx`:

```jsx
import React from 'react';
import './Hero.css';

const Hero = ({ hero }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{hero.title}</h1>
        <p className="subtitle">{hero.subtitle}</p>
        <p className="description">{hero.description}</p>
        <div className="hero-actions">
          <a href={hero.cta.primary.link} className="btn btn-primary">
            {hero.cta.primary.text}
          </a>
          <a href={hero.cta.secondary.link} className="btn btn-secondary">
            {hero.cta.secondary.text}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

Create `src/components/Hero.css`:

```css
.hero {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-purple) 100%);
  color: var(--white);
  padding: var(--space-12) var(--space-8);
  border-radius: var(--radius-xl);
  margin: var(--space-8);
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

.hero .subtitle {
  font-size: 1.5rem;
  margin-bottom: var(--space-4);
}

.hero .description {
  font-size: 1.125rem;
  margin-bottom: var(--space-8);
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
}

.btn {
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.125rem;
}

.btn-primary {
  background: var(--white);
  color: var(--primary-blue);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: transparent;
  color: var(--white);
  border: 2px solid var(--white);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}
```

### Create Product Card Component

Create `src/components/ProductCard.jsx`:

```jsx
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image_url} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button className="btn-add-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
```

Create `src/components/ProductCard.css`:

```css
.product-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: var(--space-6);
}

.product-category {
  color: var(--primary-blue);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.product-card h3 {
  font-size: 1.25rem;
  margin: var(--space-2) 0;
  color: var(--gray-900);
}

.product-description {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-bottom: var(--space-4);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-blue);
}

.btn-add-cart {
  background: var(--primary-blue);
  color: var(--white);
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-cart:hover {
  background: var(--primary-dark);
}
```

### Create Homepage

Create `src/pages/HomePage.jsx`:

```jsx
import React, { useEffect, useState } from 'react';
import { contentAPI } from '../api/content';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentAPI.getHomepage();
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching homepage content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!content) {
    return <div className="error">Failed to load content</div>;
  }

  return (
    <div className="homepage">
      <Hero hero={content.hero} />
      
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{content.stats.total_products}+</h3>
            <p>Products</p>
          </div>
          <div className="stat-card">
            <h3>{content.stats.total_customers}+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card">
            <h3>{content.stats.total_orders}+</h3>
            <p>Orders Delivered</p>
          </div>
          <div className="stat-card">
            <h3>{content.stats.total_categories}+</h3>
            <p>Categories</p>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {content.featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="new-arrivals">
        <h2>New Arrivals</h2>
        <div className="products-grid">
          {content.newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

Create `src/pages/HomePage.css`:

```css
.homepage {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-4);
}

.loading, .error {
  text-align: center;
  padding: var(--space-12);
  font-size: 1.5rem;
}

.stats-section {
  margin: var(--space-12) 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  padding: 0 var(--space-8);
}

.stat-card {
  background: var(--white);
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.stat-card h3 {
  font-size: 2.5rem;
  color: var(--primary-blue);
  margin-bottom: var(--space-2);
}

.stat-card p {
  color: var(--gray-600);
  font-size: 1.125rem;
}

.featured-section, .new-arrivals {
  margin: var(--space-12) 0;
  padding: 0 var(--space-8);
}

.featured-section h2, .new-arrivals h2 {
  font-size: 2rem;
  margin-bottom: var(--space-8);
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

---

## Step 5: Test Locally (5 minutes)

### Start Backend

```bash
# In backend directory
npm run dev
```

Backend should be running on http://localhost:3000

### Start Frontend

```bash
# In frontend directory
npm start
```

Frontend should open at http://localhost:3001

### Verify

✅ Homepage loads  
✅ Hero section displays  
✅ Products appear with images  
✅ Stats section shows data  
✅ No console errors

---

## Step 6: Deploy to Vercel (10 minutes)

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin https://github.com/yourusername/namecheap-frontend
git push -u origin main
```

### Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend.vercel.app/api`
5. Click "Deploy"

### Update Backend CORS

After deployment, update your backend's environment variable:

```env
FRONTEND_URL=https://your-frontend.vercel.app
```

Redeploy backend if needed.

---

## Step 7: Verify Deployment (5 minutes)

Visit your deployed site and check:

✅ Homepage loads correctly  
✅ Images display  
✅ API calls work (check Network tab)  
✅ No CORS errors

---

## 🎉 You're Done!

Your Namecheap Marketplace frontend is now live!

### What You've Built

✅ Beautiful homepage with hero section  
✅ Featured products with professional images  
✅ Stats dashboard  
✅ New arrivals section  
✅ Consistent design system  
✅ Deployed on Vercel

### Next Steps

1. **Add More Pages:**
   - Products listing page
   - Product detail page
   - Cart page
   - Checkout page

2. **Add Features:**
   - User authentication
   - Shopping cart functionality
   - Search and filters
   - Product reviews

3. **Enhance Design:**
   - Add animations
   - Improve mobile responsiveness
   - Add loading skeletons
   - Implement dark mode

### Resources

- [Full Design Guide](./FRONTEND_DESIGN_GUIDE.md)
- [Deployment Guide](./FRONTEND_VERCEL_DEPLOYMENT.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Backend Integration](./FRONTEND_INTEGRATION.md)

### Need Help?

- Check the browser console for errors
- Verify API URL in environment variables
- Ensure backend is running and accessible
- Check CORS configuration

Happy coding! 🚀
