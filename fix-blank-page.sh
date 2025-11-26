#!/bin/bash

echo "🔧 Fix Blank Page - Quick Diagnostic"
echo "====================================="
echo ""

# 1. Check backend
echo "1️⃣  Checking backend..."
if lsof -i :5000 > /dev/null 2>&1; then
    echo "   ✅ Backend running on port 5000"
else
    echo "   ❌ Backend NOT running"
    echo "   💡 Start backend: cd backend && npm run dev"
    exit 1
fi

# 2. Test API
echo ""
echo "2️⃣  Testing API endpoint..."
HEALTH=$(curl -s http://localhost:5000/health)
if [ $? -eq 0 ]; then
    echo "   ✅ Backend responding: $HEALTH"
else
    echo "   ❌ Backend not responding"
    exit 1
fi

# 3. Instructions
echo ""
echo "3️⃣  Next steps:"
echo "   • Open browser and go to /dashboard/admin/users"
echo "   • Press F12 to open Developer Tools"
echo "   • Check Console tab for errors"
echo "   • Check Network tab for failed requests"
echo ""
echo "4️⃣  If still blank:"
echo "   • Clear browser cache: Ctrl+Shift+R"
echo "   • Clear localStorage in console: localStorage.clear()"
echo "   • Logout and login again"
echo ""
echo "✅ Backend is healthy. Check browser console for frontend errors."
