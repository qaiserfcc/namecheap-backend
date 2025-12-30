# Frontend Deployment Guide for Vercel

This guide provides step-by-step instructions for deploying your Namecheap Marketplace frontend to Vercel.

## Prerequisites

- A frontend application (React, Next.js, Vue, etc.)
- GitHub account
- Vercel account (free tier available)
- Backend API already deployed (see [DEPLOYMENT.md](./DEPLOYMENT.md))

---

## Step 1: Prepare Your Frontend Repository

### 1.1 Create a Separate Frontend Repository

If you haven't already, create a separate repository for your frontend:

```bash
# Create a new directory
mkdir namecheap-frontend
cd namecheap-frontend

# Initialize a React app (or use your preferred framework)
npx create-react-app .
# OR for Next.js:
# npx create-next-app .

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/namecheap-frontend
git branch -M main
git push -u origin main
```

### 1.2 Configure Environment Variables

Create a `.env.example` file:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

Create a `.env.production` file:

```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
REACT_APP_ENV=production
```

**Important:** Add `.env` and `.env.production` to `.gitignore` (but keep `.env.example`):

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development.local
.env.test.local

# Keep example
!.env.example
```

### 1.3 Update API Configuration

Create or update your API configuration file:

```javascript
// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default API_CONFIG;
```

---

## Step 2: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

#### 2.1 Sign Up / Log In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Connect your GitHub account

#### 2.2 Import Your Project

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find and select your `namecheap-frontend` repository
4. Click "Import"

#### 2.3 Configure Project Settings

Vercel will auto-detect your framework. Verify these settings:

**For Create React App:**
- Framework Preset: `Create React App`
- Build Command: `npm run build` (auto-filled)
- Output Directory: `build` (auto-filled)
- Install Command: `npm install` (auto-filled)

**For Next.js:**
- Framework Preset: `Next.js`
- Build Command: `next build` (auto-filled)
- Output Directory: `.next` (auto-filled)
- Install Command: `npm install` (auto-filled)

#### 2.4 Add Environment Variables

In the "Environment Variables" section, add:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | `https://your-backend.vercel.app/api` |
| `REACT_APP_ENV` | `production` |

**Important:** Replace `your-backend.vercel.app` with your actual backend URL.

Click "Deploy"

#### 2.5 Wait for Deployment

- Vercel will build and deploy your application
- This typically takes 1-3 minutes
- You'll see a success screen when complete

#### 2.6 Get Your Deployment URL

After deployment, you'll receive a URL like:
```
https://namecheap-frontend.vercel.app
```

Or with your custom domain:
```
https://yourdomain.com
```

---

### Method 2: Via Vercel CLI

#### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 2.2 Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### 2.3 Deploy

From your project directory:

```bash
# For development preview
vercel

# For production
vercel --prod
```

#### 2.4 Set Environment Variables via CLI

```bash
# Add environment variables
vercel env add REACT_APP_API_URL
# Enter: https://your-backend.vercel.app/api
# Select: Production

vercel env add REACT_APP_ENV
# Enter: production
# Select: Production

# Redeploy with new variables
vercel --prod
```

---

## Step 3: Configure Backend CORS

After deploying your frontend, update your backend's CORS configuration:

### 3.1 Update Backend Environment Variables

In your backend's Vercel dashboard or `.env`:

```env
FRONTEND_URL=https://namecheap-frontend.vercel.app
```

**For multiple frontends:**
```env
FRONTEND_URL=https://namecheap-frontend.vercel.app,https://yourdomain.com
```

### 3.2 Update CORS Configuration (if needed)

If you have custom CORS settings in your backend:

```javascript
// api/gateway/index.js
const corsOptions = {
  origin: process.env.FRONTEND_URL.split(','),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 3.3 Redeploy Backend

If you made changes, redeploy your backend:

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

---

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Enter your domain name (e.g., `shop.yourdomain.com`)
4. Click "Add"

### 4.2 Configure DNS

Vercel will provide DNS configuration instructions. Add one of:

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: shop (or www)
Value: cname.vercel-dns.com
```

**Option B: A Record**
```
Type: A
Name: @ (or subdomain)
Value: 76.76.21.21
```

### 4.3 Wait for DNS Propagation

- DNS changes can take 1-48 hours
- Vercel will automatically provision an SSL certificate
- Your site will be available at your custom domain

---

## Step 5: Verify Deployment

### 5.1 Test Your Frontend

1. Visit your deployment URL
2. Check that the homepage loads correctly
3. Verify API calls are working:
   - Open browser DevTools → Network tab
   - Navigate around your site
   - Confirm API requests go to your backend URL

### 5.2 Test API Integration

```javascript
// In your browser console
fetch('https://your-backend.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log);

// Should return: { status: 'ok', timestamp: '...' }
```

### 5.3 Test Content Endpoints

Visit these URLs in your browser:
- `https://your-backend.vercel.app/api/content/homepage`
- `https://your-backend.vercel.app/api/products`
- `https://your-backend.vercel.app/api/content/about`

### 5.4 Common Issues

**Issue: CORS errors**
- Solution: Verify `FRONTEND_URL` in backend matches your frontend URL exactly
- Check browser console for specific CORS error messages

**Issue: API calls not working**
- Solution: Check that `REACT_APP_API_URL` environment variable is set correctly
- Verify the environment variable is being used in your API client

**Issue: Environment variables not loaded**
- Solution: For Create React App, ensure variables start with `REACT_APP_`
- Rebuild and redeploy after adding environment variables

---

## Step 6: Continuous Deployment

### 6.1 Automatic Deployments

Vercel automatically deploys when you push to your repository:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Requests** → Preview deployment

### 6.2 Production vs Preview

**Production Deployment:**
- Triggered by pushing to your main branch
- Uses production environment variables
- Accessible via your primary domain

**Preview Deployment:**
- Created for each branch/PR
- Uses preview environment variables
- Useful for testing before merging

### 6.3 Configure Branch Deployments

In Vercel dashboard:
1. Go to Settings → Git
2. Set "Production Branch" (usually `main` or `master`)
3. Enable/disable preview deployments

---

## Step 7: Performance Optimization

### 7.1 Enable Vercel Analytics

1. Go to your project → Analytics
2. Enable Web Analytics
3. View real-time performance metrics

### 7.2 Configure Build Settings

```json
// vercel.json
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
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 7.3 Optimize Images

Use Vercel's Image Optimization (Next.js):

```jsx
import Image from 'next/image';

<Image 
  src={product.image_url} 
  alt={product.name}
  width={400}
  height={300}
  loading="lazy"
/>
```

---

## Step 8: Monitoring & Debugging

### 8.1 View Deployment Logs

1. Go to your project in Vercel
2. Click "Deployments"
3. Select a deployment
4. View build and runtime logs

### 8.2 Real-time Logs

```bash
# Using Vercel CLI
vercel logs
vercel logs --follow
```

### 8.3 Error Tracking

Integrate error tracking (optional):

```bash
npm install @vercel/analytics
```

```javascript
// src/index.js
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Frontend code is pushed to GitHub
- [ ] Environment variables are configured in Vercel
- [ ] Backend API URL is correct in frontend config
- [ ] Backend CORS is configured with frontend URL
- [ ] All API endpoints are tested and working
- [ ] Images and assets are optimized
- [ ] Build completes successfully locally
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active
- [ ] Error tracking is set up
- [ ] Analytics are enabled

---

## Rollback Procedure

If you need to rollback a deployment:

### Via Dashboard
1. Go to "Deployments"
2. Find the previous working deployment
3. Click "⋯" → "Promote to Production"

### Via CLI
```bash
vercel rollback
```

---

## Support & Resources

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Create React App on Vercel](https://vercel.com/guides/deploying-react-with-vercel)

### Project Documentation
- [Frontend Design Guide](./FRONTEND_DESIGN_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Backend Deployment Guide](./DEPLOYMENT.md)

### Troubleshooting

**Need help?** Check:
1. Vercel deployment logs
2. Browser console errors
3. Network tab in DevTools
4. Backend API logs

**Common Commands:**
```bash
# View logs
vercel logs

# List deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Get project info
vercel inspect

# Pull environment variables
vercel env pull
```

---

## Next Steps

After successful deployment:

1. **Test thoroughly** - Click through all pages and features
2. **Monitor performance** - Use Vercel Analytics
3. **Set up monitoring** - Configure error tracking
4. **Update documentation** - Document any custom configurations
5. **Share with stakeholders** - Provide deployment URL

Congratulations! Your frontend is now live on Vercel! 🎉
