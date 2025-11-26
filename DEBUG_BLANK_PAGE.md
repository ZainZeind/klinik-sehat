# Debug: Halaman Blank Putih Total

## Masalah: Halaman /dashboard/admin/users Blank Putih

Kalau halaman blank putih total (bukan loading, bukan navbar, NOTHING), berarti ada **JavaScript error yang crash component**.

---

## 🚨 LANGKAH PERTAMA (WAJIB):

### 1. Buka Browser Console

```
Tekan F12 → Tab Console
```

**LIHAT ERROR MERAH!** Screenshot semua error!

---

## 🔍 Error Umum & Solusi:

### Error 1: "Failed to fetch" / "ERR_CONNECTION_REFUSED"

```
GET http://localhost:5000/api/admin/users net::ERR_CONNECTION_REFUSED
```

**Artinya:** Backend tidak jalan

**Solusi:**
```bash
cd backend
npm run dev

# Output harus:
# Server is running on port 5000
```

---

### Error 2: "Uncaught TypeError: Cannot read property 'map' of undefined"

```
TypeError: Cannot read property 'map' of undefined
    at UserManagement.tsx:305
```

**Artinya:** Data users undefined saat render

**Solusi:** Sudah di-fix di code terbaru. Pull latest changes:
```bash
git pull
npm install
```

---

### Error 3: "Module not found" / Import error

```
Module not found: Can't resolve '@/components/ui/table'
```

**Artinya:** Missing component atau path salah

**Solusi:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

### Error 4: React error overlay / White screen dengan error box

**Artinya:** React caught an error

**Solusi:**
1. Read the error message carefully
2. Check backend console
3. Clear browser cache: `Ctrl+Shift+R`

---

## 📋 Debug Checklist

Jalankan ini **SATU PER SATU** dan cek hasilnya:

### Step 1: Check Backend
```bash
# Check backend running
lsof -i :5000

# Jika tidak ada output, start backend
cd backend
npm run dev
```

✅ **HARUS ADA OUTPUT:** "Server is running on port 5000"

---

### Step 2: Check API Response
```bash
# Get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"admin123"}'

# Simpan token, lalu test API
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/admin/users
```

✅ **HARUS RETURN:** `{"users": [...]}`

---

### Step 3: Check Browser Console

1. Buka halaman `/dashboard/admin/users`
2. Tekan **F12**
3. Tab **Console**

Cek console log (harus muncul):
```
🔍 UserManagement component rendering...
🔄 useEffect triggered, loading users...
📡 Fetching users with filter: 
```

Kalau **TIDAK ADA LOG INI** → Component tidak render sama sekali!

**Kemungkinan:**
- Route error
- ProtectedRoute blocking
- Import error

---

### Step 4: Check Network Tab

1. **F12** → Tab **Network**
2. Reload page
3. Cari request ke `/api/admin/users`

**Jika request TIDAK ADA** → Component crash sebelum fetch
**Jika request FAILED (merah)** → Backend issue
**Jika request SUCCESS (200)** → Response handling issue

---

## 🛠️ Quick Fixes

### Fix 1: Clear Everything
```bash
# Stop semua
# Ctrl+C di terminal backend dan frontend

# Clear cache frontend
rm -rf node_modules .vite dist
npm install

# Clear cache backend
cd backend
rm -rf node_modules
npm install
cd ..

# Restart semua
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
npm run dev
```

---

### Fix 2: Hard Reload Browser
```bash
# Di browser:
1. Ctrl+Shift+R (hard reload)
2. Atau:
   - F12 → Klik kanan reload button
   - Pilih "Empty Cache and Hard Reload"
```

---

### Fix 3: Clear LocalStorage
```javascript
// Di browser console (F12 → Console):
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

### Fix 4: Try Different Browser
```bash
# Coba buka di:
- Chrome Incognito
- Firefox Private
- Safari

# Ini untuk isolate apakah masalahnya di browser cache
```

---

## 🎯 Systematic Debugging

Jalankan command ini dan **screenshot OUTPUT-nya**:

```bash
# 1. Check backend
echo "=== Backend Status ==="
lsof -i :5000
echo ""

# 2. Check backend health
echo "=== Backend Health ==="
curl http://localhost:5000/health
echo ""

# 3. Check backend logs
echo "=== Backend Console Output ==="
# (screenshot terminal backend)

# 4. Check frontend console
echo "=== Frontend Console ==="
# (screenshot browser F12 console)

# 5. Check network
echo "=== Network Requests ==="
# (screenshot browser F12 network tab)
```

---

## 📸 Screenshot Yang Dibutuhkan

Kalau masih blank, kirim screenshot:

1. ✅ **Browser Console** (F12 → Console) - FULL OUTPUT
2. ✅ **Network Tab** (F12 → Network) - All requests
3. ✅ **Backend Terminal** - Console output
4. ✅ **URL Bar** - Confirm URL correct
5. ✅ **Blank Page** - Show full screen

---

## 🔄 Error Boundary

Saya sudah tambahkan Error Boundary. Kalau ada error, sekarang akan muncul pesan error yang jelas, BUKAN blank putih.

**Jika tetap blank putih setelah update code:**
→ Error terjadi SEBELUM component render (routing issue)

**Jika muncul error page dengan icon merah:**
→ Error tertangkap oleh boundary, baca pesan errornya

---

## 💡 Most Common Cause

**99% kasus blank putih:**

1. ❌ Backend tidak jalan → Start backend
2. ❌ Token expired → Logout & login lagi
3. ❌ Import error → Check console
4. ❌ Browser cache → Hard reload
5. ❌ Database kosong → Import schema

**Test ini dulu:**
```bash
cd backend && npm run dev
```

Lalu buka browser fresh (Incognito), login ulang.

---

## 🆘 Emergency Fix

Kalau MASIH blank setelah semua
