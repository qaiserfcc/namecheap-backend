# Quick Start Guide

Get the Namecheap Backend API up and running in 5 minutes!

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (local or hosted)
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/qaiserfcc/namecheap-backend.git
cd namecheap-backend
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Database

### Option A: Local PostgreSQL

```bash
# Create database
createdb ecommerce_db

# Load schema
psql ecommerce_db < database/schema.sql

# (Optional) Load sample data
psql ecommerce_db < database/seed.sql
```

### Option B: Hosted Database (Recommended for Quick Start)

Use a free hosted database:
- [Neon](https://neon.tech/) - Free tier, instant setup
- [Supabase](https://supabase.com/) - Free tier with dashboard
- [ElephantSQL](https://www.elephantsql.com/) - Free tier

After creating your database, copy the connection string.

## Step 4: Configure Environment

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your database URL:

```env
DATABASE_URL=postgresql://your-connection-string-here
JWT_SECRET=my-secret-key-for-development
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
ENABLE_PAYMENT_SIMULATION=true
```

## Step 5: Run the API

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
API Gateway running on port 3000
```

## Step 6: Test the API

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-29T01:00:00.000Z"
}
```

## Quick API Tests

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

### Get Products

```bash
curl http://localhost:3000/api/products
```

### Get Your Profile (Protected Route)

```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Create an Admin User

After registering a user, connect to your database and run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
```

Now you can access admin endpoints!

## Next Steps

### Connect a Frontend

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for detailed integration guide.

### Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

### Review Security

See [SECURITY.md](./SECURITY.md) for security best practices before production.

### API Reference

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API documentation.

## Common Issues

### Database Connection Error

**Error**: `FATAL: JWT_SECRET environment variable must be set in production!`
**Solution**: Make sure your `.env` file has `JWT_SECRET` set.

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`
**Solution**: Change the `PORT` in `.env` or stop the other process using port 3000.

### Cannot Connect to Database

**Error**: `connection to database failed`
**Solution**: 
1. Verify `DATABASE_URL` is correct
2. Ensure database is running
3. Check firewall/network settings
4. For hosted databases, ensure SSL is configured

## Development Tips

### Auto-reload on Changes

Use `npm run dev` to automatically restart the server when files change.

### View Logs

Morgan middleware logs all requests to the console:
```
::1 - - [29/Dec/2025:01:00:00 +0000] "GET /api/health HTTP/1.1" 200
```

### Test with Postman

Import the API into Postman:
1. Create a new collection
2. Add requests for each endpoint
3. Set up environment variables for token management

## Project Structure

```
namecheap-backend/
├── api/                    # Microservices
│   ├── gateway/           # Main entry point
│   ├── auth/              # Authentication
│   ├── product/           # Product management
│   ├── cart/              # Shopping cart
│   ├── order/             # Order processing
│   ├── payment/           # Payments
│   ├── discount/          # Coupons
│   ├── admin/             # Admin functions
│   └── notification/      # Notifications
├── database/              # Database files
│   ├── schema.sql        # Table definitions
│   ├── seed.sql          # Sample data
│   └── db.js             # Connection
├── .env.example          # Template
└── package.json          # Dependencies
```

## Getting Help

- **Documentation**: Check the docs in this repository
- **Issues**: Open an issue on GitHub
- **Security**: See SECURITY.md for security-related questions

## Success! 🎉

Your backend API is now running! You can:
- ✅ Register and login users
- ✅ Manage products
- ✅ Process orders
- ✅ Handle payments (simulated)
- ✅ Administer the system

Ready to connect your frontend? See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)!
