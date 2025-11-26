#!/bin/bash

# Script to start backend server
# Usage: ./start-backend.sh

echo "🚀 Starting Clinic Queue Pro - Backend"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: backend/server.js not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo ""
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "Creating .env from .env.example..."
    cp backend/.env.example backend/.env
    echo "Please edit backend/.env with your MySQL credentials"
    echo ""
fi

# Check MySQL
echo "🔍 Checking MySQL..."
if command -v mysql &> /dev/null; then
    if mysql -u root -e "SELECT 1;" &> /dev/null; then
        echo "✅ MySQL is running"
    else
        echo "⚠️  MySQL is installed but not accessible"
        echo "Trying to start MySQL..."
        mysql.server start 2>/dev/null || true
    fi
else
    echo "❌ MySQL not found. Please install MySQL first."
    exit 1
fi
echo ""

# Check database
echo "🔍 Checking database..."
DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE 'clinic_queue_db';" 2>/dev/null | grep -c "clinic_queue_db")
if [ "$DB_EXISTS" -eq 0 ]; then
    echo "⚠️  Database 'clinic_queue_db' not found"
    echo "Creating database and importing schema..."
    mysql -u root -e "CREATE DATABASE clinic_queue_db;" 2>/dev/null
    mysql -u root clinic_queue_db < backend/database/schema.sql 2>/dev/null
    echo "✅ Database created"
else
    echo "✅ Database exists"
fi
echo ""

# Start backend
echo "🚀 Starting backend server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cd backend
npm run dev
