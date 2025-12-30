# Frontend Design System & Integration Guide

This guide provides comprehensive information for building a visually beautiful frontend that integrates with the Namecheap Backend API, with consistent theming across all pages.

## Table of Contents
1. [Design System](#design-system)
2. [API Integration](#api-integration)
3. [Page Components](#page-components)
4. [Deployment Guide](#deployment-guide)

---

## Design System

### Color Palette

Use these colors consistently across all pages:

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
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #0066CC 0%, #8B5CF6 100%);
  --gradient-success: linear-gradient(135deg, #00A86B 0%, #48BB78 100%);
  --gradient-sunset: linear-gradient(135deg, #FF6B35 0%, #F6AD55 100%);
}
```

### Typography

```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-heading: 'Poppins', 'Inter', sans-serif;
--font-mono: 'Fira Code', 'Monaco', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing

```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## API Integration

### Setup

```javascript
// config.js
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// api/client.js
import axios from 'axios';
import { API_CONFIG } from '../config';

const apiClient = axios.create(API_CONFIG);

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

### Homepage Content API

```javascript
// api/content.js
import apiClient from './client';

export const contentAPI = {
  // Get all homepage data in one request
  getHomepage: async () => {
    const response = await apiClient.get('/content/homepage');
    return response.data;
  },
  
  // Get about page content
  getAbout: async () => {
    const response = await apiClient.get('/content/about');
    return response.data;
  },
  
  // Get features
  getFeatures: async () => {
    const response = await apiClient.get('/content/features');
    return response.data;
  },
  
  // Get testimonials
  getTestimonials: async () => {
    const response = await apiClient.get('/content/testimonials');
    return response.data;
  },
  
  // Get FAQ
  getFAQ: async () => {
    const response = await apiClient.get('/content/faq');
    return response.data;
  },
  
  // Get promotional banners
  getBanners: async () => {
    const response = await apiClient.get('/content/banners');
    return response.data;
  }
};
```

---

## Page Components

### Homepage Component Example (React)

```jsx
// pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { contentAPI } from '../api/content';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import CategoryCard from '../components/CategoryCard';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FeaturesSection from '../components/FeaturesSection';

const HomePage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await contentAPI.getHomepage();
        setContent(data);
      } catch (error) {
        console.error('Error fetching homepage content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <Hero 
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        description={content.hero.description}
        primaryCTA={content.hero.cta.primary}
        secondaryCTA={content.hero.cta.secondary}
      />

      {/* Stats Section */}
      <StatsSection stats={content.stats} />

      {/* Categories */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {content.categories.map((category) => (
            <CategoryCard key={category.category} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>Featured Products</h2>
        <ProductGrid products={content.featuredProducts} />
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals">
        <h2>New Arrivals</h2>
        <ProductGrid products={content.newProducts} />
      </section>

      {/* Best Sellers */}
      <section className="best-sellers">
        <h2>Best Sellers</h2>
        <ProductGrid products={content.bestSellers} />
      </section>

      {/* Features */}
      <FeaturesSection />

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
```

### Hero Component Example

```jsx
// components/Hero.jsx
import React from 'react';
import './Hero.css';

const Hero = ({ title, subtitle, description, primaryCTA, secondaryCTA }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <p className="hero-description">{description}</p>
        <div className="hero-actions">
          <a href={primaryCTA.link} className="btn btn-primary">
            {primaryCTA.text}
          </a>
          <a href={secondaryCTA.link} className="btn btn-secondary">
            {secondaryCTA.text}
          </a>
        </div>
      </div>
      <div className="hero-image">
        {/* Add hero image or illustration */}
      </div>
    </section>
  );
};

export default Hero;
```

### Hero Styles (Using Design System)

```css
/* components/Hero.css */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  padding: var(--space-20) var(--space-8);
  background: var(--gradient-primary);
  color: var(--white);
  border-radius: var(--radius-2xl);
  margin: var(--space-8);
  min-height: 500px;
  align-items: center;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-4);
  opacity: 0.95;
}

.hero-description {
  font-size: var(--text-lg);
  margin-bottom: var(--space-8);
  opacity: 0.9;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
}

.btn {
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: var(--text-lg);
  display: inline-block;
}

.btn-primary {
  background: var(--white);
  color: var(--primary-blue);
  box-shadow: var(--shadow-lg);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-secondary {
  background: transparent;
  color: var(--white);
  border: 2px solid var(--white);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: var(--text-3xl);
  }
  
  .hero-actions {
    justify-content: center;
  }
}
```

### Product Card Component

```jsx
// components/ProductCard.jsx
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image_url} alt={product.name} />
        {product.total_sales > 0 && (
          <span className="badge badge-bestseller">Best Seller</span>
        )}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button className="btn-add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
```

```css
/* components/ProductCard.css */
.product-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.product-image {
  position: relative;
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

.badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
}

.badge-bestseller {
  background: var(--gradient-sunset);
  color: var(--white);
}

.product-info {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.product-category {
  font-size: var(--text-sm);
  color: var(--primary-blue);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin: 0;
}

.product-description {
  font-size: var(--text-sm);
  color: var(--gray-600);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--space-4);
}

.product-price {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary-blue);
}

.btn-add-to-cart {
  background: var(--primary-blue);
  color: var(--white);
  border: none;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-to-cart:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}
```

---

## Consistent Layout Components

### Header/Navigation

```jsx
// components/Header.jsx
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>Namecheap Marketplace</h1>
          </div>
          <nav className="main-nav">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <div className="header-actions">
            <button className="icon-btn">
              <SearchIcon />
            </button>
            <button className="icon-btn">
              <CartIcon />
            </button>
            <button className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </div>
    </header>
  );
};
```

```css
/* components/Header.css */
.header {
  background: var(--white);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) 0;
}

.logo h1 {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--primary-blue);
  margin: 0;
}

.main-nav {
  display: flex;
  gap: var(--space-8);
}

.main-nav a {
  color: var(--gray-700);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: color 0.3s ease;
}

.main-nav a:hover {
  color: var(--primary-blue);
}

.header-actions {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  padding: var(--space-2);
  cursor: pointer;
  color: var(--gray-700);
  transition: color 0.3s ease;
}

.icon-btn:hover {
  color: var(--primary-blue);
}
```

---

## Deployment Guide

### Deploying Frontend to Vercel

#### Option 1: Via Vercel Dashboard

1. **Prepare your frontend project:**
   ```bash
   # Ensure your project is in a Git repository
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to GitHub
   git remote add origin https://github.com/yourusername/namecheap-frontend
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework: React / Next.js / etc.
     - Build Command: `npm run build`
     - Output Directory: `build` or `dist`

3. **Set Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   REACT_APP_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at: `https://your-project.vercel.app`

#### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Configuration

Create `.env.production`:

```env
REACT_APP_API_URL=https://your-backend-api.vercel.app/api
REACT_APP_ENV=production
```

### Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Post-Deployment

1. **Update Backend CORS:**
   Update your backend's `FRONTEND_URL` environment variable to match your deployed frontend URL:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

2. **Test Integration:**
   - Visit your deployed frontend
   - Test API calls (products, cart, auth)
   - Verify CORS is working correctly

---

## Best Practices

### Theming Consistency

1. **Always use CSS variables** from the design system
2. **Maintain spacing consistency** using the spacing scale
3. **Use the same color palette** across all pages
4. **Keep typography consistent** with defined font families and sizes

### Component Reusability

1. **Create shared components** for common UI elements
2. **Use the same layout components** (Header, Footer) on all pages
3. **Maintain consistent button styles** across the application

### Performance

1. **Lazy load images** using native loading="lazy"
2. **Code split routes** using React.lazy()
3. **Cache API responses** where appropriate
4. **Optimize images** before deployment

### Accessibility

1. **Use semantic HTML** elements
2. **Provide alt text** for all images
3. **Ensure keyboard navigation** works
4. **Maintain sufficient color contrast**

---

## Example Pages

All pages should follow the same design system and use consistent components:

- **Homepage** - Hero, Featured Products, Categories, Stats, Testimonials
- **Products Page** - Product Grid, Filters, Search
- **Product Detail** - Image Gallery, Details, Reviews, Related Products
- **Cart** - Cart Items, Summary, Checkout Button
- **Checkout** - Shipping Info, Payment, Order Summary
- **About** - Mission, Vision, Values, Team
- **Contact** - Contact Form, Information, Map

Each page should include:
- Same Header/Navigation
- Same Footer
- Same color scheme
- Same typography
- Same spacing and layout principles
- Same button and form styles
