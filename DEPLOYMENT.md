# Deployment Guide

This guide covers deploying the Namecheap Backend API to various hosting platforms.

## Prerequisites

- A PostgreSQL database (local or hosted)
- Node.js environment on hosting platform
- GitHub repository with your code

## Vercel Deployment

### 1. Prepare Your Database

Set up a PostgreSQL database using one of these services:
- [Neon](https://neon.tech/) - Free tier available
- [Supabase](https://supabase.com/) - Free tier available
- [Railway](https://railway.app/) - PostgreSQL hosting
- [ElephantSQL](https://www.elephantsql.com/) - Free tier available

### 2. Initialize Database Schema

```bash
# Connect to your database
psql "your-database-connection-string"

# Run schema
\i database/schema.sql

# (Optional) Load seed data
\i database/seed.sql
```

### 3. Deploy to Vercel

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add FRONTEND_URL

# Deploy to production
vercel --prod
```

#### Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com/)
2. Click "Import Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your frontend URL or `*` for development
5. Click "Deploy"

### 4. Verify Deployment

Test your deployed API:

```bash
curl https://your-project.vercel.app/api/health
```

Swagger/OpenAPI endpoints:

```bash
# OpenAPI JSON
curl https://your-project.vercel.app/api/openapi.json

# Swagger UI (note: /api/docs may redirect to /api/docs/)
open https://your-project.vercel.app/api/docs/
```

## Heroku Deployment

### 1. Create Heroku App

```bash
# Install Heroku CLI
# See: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini
```

### 2. Configure Environment Variables

```bash
heroku config:set JWT_SECRET="your-secure-secret"
heroku config:set NODE_ENV="production"
heroku config:set FRONTEND_URL="https://your-frontend-url.com"

# DATABASE_URL is automatically set by the PostgreSQL addon
```

### 3. Create Procfile

Create a file named `Procfile` in the root directory:

```
web: node api/gateway/index.js
```

### 4. Deploy

```bash
git push heroku main

# Initialize database
heroku run bash
# Then in the Heroku shell:
psql $DATABASE_URL < database/schema.sql
exit
```

### 5. Verify Deployment

```bash
heroku open
# Or test directly:
curl https://your-app-name.herokuapp.com/api/health
```

## Railway Deployment

### 1. Create Railway Account

Sign up at [railway.app](https://railway.app/)

### 2. Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js

### 3. Add PostgreSQL Database

1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically create DATABASE_URL

### 4. Configure Environment Variables

In your Railway project settings, add:
- `JWT_SECRET`: Your secure secret
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Your frontend URL
- `PORT`: `${{ PORT }}` (Railway provides this)

### 5. Set Start Command

In Railway settings, set start command:
```
node api/gateway/index.js
```

### 6. Initialize Database

```bash
# Use Railway CLI
railway login
railway run bash

# Run schema
psql $DATABASE_URL < database/schema.sql
exit
```

## DigitalOcean App Platform

### 1. Create App

1. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Click "Create App"
3. Connect your GitHub repository
4. Select your repository and branch

### 2. Configure App

- **Type**: Web Service
- **Build Command**: `npm install`
- **Run Command**: `node api/gateway/index.js`
- **HTTP Port**: 3000

### 3. Add Database

1. Add a PostgreSQL database component
2. Note the connection details

### 4. Environment Variables

Add in App settings:
- `DATABASE_URL`: From database component
- `JWT_SECRET`: Your secure secret
- `NODE_ENV`: production
- `FRONTEND_URL`: Your frontend URL

### 5. Initialize Database

Use DigitalOcean's database console or connect via psql:
```bash
psql "connection-string" < database/schema.sql
```

## AWS Elastic Beanstalk

### 1. Install EB CLI

```bash
pip install awsebcli
```

### 2. Initialize Application

```bash
eb init -p node.js your-app-name --region us-east-1
```

### 3. Create Environment

```bash
eb create production-env
```

### 4. Set Environment Variables

```bash
eb setenv DATABASE_URL="your-database-url" \
          JWT_SECRET="your-secret" \
          NODE_ENV="production" \
          FRONTEND_URL="your-frontend-url"
```

### 5. Deploy

```bash
eb deploy
```

### 6. Open Application

```bash
eb open
```

## Environment Variables Reference

All platforms require these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT token signing | `your-random-secret-string` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend application URL | `https://yourfrontend.com` |
| `PORT` | Server port (optional) | `3000` |

## Database Connection String Format

```
postgresql://username:password@host:port/database?sslmode=require
```

Example:
```
postgresql://myuser:mypassword@db.example.com:5432/mydb?sslmode=require
```

## Post-Deployment Steps

### 1. Test Health Endpoint

```bash
curl https://your-api-url.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Create Admin User

```bash
# Register a user via API
curl -X POST https://your-api-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "secure-password",
    "fullName": "Admin User"
  }'

# Then update role in database
psql $DATABASE_URL
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### 3. Test Authentication

```bash
# Login
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure-password"
  }'

# Save the token from response and test protected endpoint
curl https://your-api-url.com/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Update Frontend Configuration

Update your frontend's API URL to point to the deployed backend:

```javascript
// .env.production
REACT_APP_API_URL=https://your-api-url.com/api
```

## Monitoring and Logs

### Vercel
```bash
vercel logs
```

### Heroku
```bash
heroku logs --tail
```

### Railway
Use the Railway dashboard logs viewer

### DigitalOcean
Use the App Platform logs viewer in the dashboard

## Security Checklist

- [ ] Use strong `JWT_SECRET` (minimum 32 random characters)
- [ ] Enable database SSL (`sslmode=require` in connection string)
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS with specific `FRONTEND_URL` (avoid using `*` in production)
- [ ] Use HTTPS for all endpoints
- [ ] Keep dependencies updated
- [ ] Enable database backups
- [ ] Monitor logs for suspicious activity

## Troubleshooting

### Database Connection Errors

```bash
# Test database connection
psql "your-database-url"

# Check if schema is loaded
\dt
```

### Application Won't Start

- Check environment variables are set correctly
- Review application logs
- Verify `package.json` scripts
- Ensure Node.js version compatibility

### CORS Errors

- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check CORS configuration in `api/gateway/index.js`

### 500 Internal Server Errors

- Check application logs
- Verify database connection
- Test database queries manually
- Check all environment variables are set

## Scaling Considerations

### Database
- Use connection pooling (already implemented in `database/db.js`)
- Consider read replicas for high-traffic applications
- Monitor database performance and optimize queries

### Application
- Most platforms auto-scale (Vercel, Railway)
- For manual scaling, increase number of instances
- Use load balancers for multiple instances

### Caching
Consider adding Redis for:
- Session management
- Cart data caching
- Product catalog caching

## Backup and Recovery

### Database Backups

Most hosted databases provide automatic backups. Manual backup:

```bash
pg_dump "your-database-url" > backup.sql

# Restore
psql "your-database-url" < backup.sql
```

### Application State

Ensure your code is always in version control (Git).

## Support

For deployment issues:
- Check platform-specific documentation
- Review application logs
- Test endpoints individually
- Verify environment variables

For application issues:
- See [README.md](./README.md)
- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
