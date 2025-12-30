# Quick Vercel Deployment Guide

Deploy this Express.js API to Vercel in minutes!

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to GitHub

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Import Project

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (e.g., `your-username/your-backend-repo`)
4. Vercel will auto-detect the configuration from `vercel.json`

### Step 2: Configure Environment Variables (Optional)

If you're using the full e-commerce features (requires database):

Add these environment variables in the Vercel project settings:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string (e.g., generate with `openssl rand -hex 32`)
- `NODE_ENV` - Set to `production`
- `FRONTEND_URL` - Your frontend URL or `*` for development

**Note:** For basic API endpoints (`/api/health`, `/api/info`, `/api/time`, `/api/echo`), these environment variables are **not required**.

### Step 3: Deploy

Click **"Deploy"** and wait for the build to complete (usually < 1 minute).

### Step 4: Test Your API

Once deployed, test your endpoints:

```bash
# Replace YOUR-PROJECT.vercel.app with your actual Vercel URL

# Health check
curl https://YOUR-PROJECT.vercel.app/api/health

# API info
curl https://YOUR-PROJECT.vercel.app/api/info

# Server time
curl https://YOUR-PROJECT.vercel.app/api/time

# Echo test
curl -X POST https://YOUR-PROJECT.vercel.app/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from Vercel!"}'
```

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
# Navigate to your project directory
cd namecheap-backend

# Deploy
vercel

# For production deployment
vercel --prod
```

### Step 4: Set Environment Variables (if needed)

```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add FRONTEND_URL
```

## What Gets Deployed?

The `vercel.json` configuration automatically:
- ✅ Builds your Node.js application
- ✅ Routes all requests to `api/gateway/index.js`
- ✅ Handles serverless function execution
- ✅ Provides automatic HTTPS
- ✅ Enables global CDN

## Basic Endpoints (No Database Required)

These endpoints work immediately after deployment without any configuration:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API gateway info |
| `/api/health` | GET | Health check |
| `/api/info` | GET | API information and available endpoints |
| `/api/time` | GET | Server time in multiple formats |
| `/api/echo` | POST | Echo back request data |
| `/api/docs` | GET | Swagger/OpenAPI documentation |

## Advanced Features (Require Database)

For full e-commerce functionality, you'll need to set up a PostgreSQL database:

1. Use a service like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)
2. Run the database schema from `database/schema.sql`
3. Add the `DATABASE_URL` environment variable in Vercel
4. Redeploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility (v14+)
- Review build logs in Vercel dashboard

### Environment Variables Not Working
- Redeploy after adding environment variables
- Check variable names are exact (case-sensitive)
- Use Vercel dashboard to verify values

### CORS Errors
- Set `FRONTEND_URL` environment variable to your frontend domain
- Or use `*` for development (not recommended for production)

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed by Vercel
5. Vercel automatically provisions SSL certificate

## Monitoring

View your API logs and analytics:
- Go to Vercel dashboard
- Select your project
- Click **"Logs"** or **"Analytics"**

## Next Steps

- ✅ Test all basic endpoints
- ✅ Set up custom domain (optional)
- ✅ Configure database for advanced features (optional)
- ✅ Connect your frontend application
- ✅ Review [SECURITY.md](./SECURITY.md) before going to production

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Project Issues](https://github.com/qaiserfcc/namecheap-backend/issues)

## Success! 🎉

Your Express.js API is now live on Vercel with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless scaling
- ✅ Zero configuration deployment

Test it now: `https://YOUR-PROJECT.vercel.app/api/health`
