#!/bin/bash

# Script to start frontend
# Usage: ./start-frontend.sh

echo "🎨 Starting Clinic Queue Pro - Frontend"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
fi

echo "🚀 Starting frontend server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Frontend will be available at:"
echo "👉 http://localhost:5173"
echo ""
echo "Login credentials:"
echo "  Admin:  admin@clinic.com / admin123"
echo "  Dokter: dokter@clinic.com / dokter123"
echo "  Pasien: pasien@clinic.com / pasien123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev
