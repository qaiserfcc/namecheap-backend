#!/bin/bash

# Database initialization script
# This script creates the database schema and optionally seeds sample data

set -e

echo "🗄️  Initializing database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set it in your .env file or environment"
    exit 1
fi

# Run schema
echo "📋 Creating database schema..."
psql "$DATABASE_URL" -f database/schema.sql

echo "✅ Database schema created successfully"

# Ask if user wants to seed data
read -p "Do you want to seed sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🌱 Seeding sample data..."
    psql "$DATABASE_URL" -f database/seed.sql
    echo "✅ Sample data seeded successfully"
    echo ""
    echo "📝 Sample credentials:"
    echo "   Admin: admin@example.com / password123"
    echo "   Customer: customer@example.com / password123"
fi

echo ""
echo "🎉 Database initialization complete!"
