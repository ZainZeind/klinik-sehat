# Fix: Halaman Blank / Navbar Hilang

## Problem: Halaman Kelola User Blank

Jika halaman "Kelola User" tampil blank dan navbar hilang, ikuti langkah ini:

### 1. Check Backend Running

```bash
# Pastikan backend jalan
lsof -i :5000

# Jika tidak ada, start backend
cd backend
npm run dev
```

**Output harus:**
```
Server is running on port 5000
```

---

### 2. Check Browser Console (PENTING!)

1. Buka halaman yang blank
2. Tekan **F12** (Developer Tools)
3. Buka tab **Console**
4. Screenshot semua error messages (warna merah)

**Error Umum:**

#### Error: "Failed to fetch" / Network Error
```
GET http://localhost:5000/api/admin/users net::ERR_CONNECTION_REFUSED
```

**Solusi:** Backend tidak jalan
```bash
cd backend && npm run dev
```

#### Error: 401 Unauthorized
```
GET http://localhost:5000/api/admin/users 401 (Unauthorized)
```

**Solusi:** Token expired, logout & login lagi
```javascript
// Di browser console, jalankan:
localStorage.clear();
location.reload();
```

#### Error: 500 Internal Server Error
```
GET http://localhost:5000/api/admin/users 500 (Internal Server Error)
```

**Solusi:** Error di backend, check backend console

---

### 3. Test API Manual

```bash
# Get token dulu (login)
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"admin123"}' | \
  jq -r '.token')

echo "Token: $TOKEN"

# Test get users
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/admin/users
```

**Output yang benar:**
```json
{
  "users": [
    {"id": 1, "email": "admin@clinic.com", "role": "admin", ...},
    ...
  ]
}
```

---

### 4. Clear Cache & Reload

```bash
# Di browser:
1. Tekan Ctrl+Shift+R (hard reload)
2. Atau:
   - Tekan F12
   - Klik kanan tombol reload
   - Pilih "Empty Cache and Hard Reload"
```

---

### 5. Fix Loading State

Jika halaman stuck di loading spinner:

```javascript
// Di browser console:
// Check loading state
console.log(window.location.pathname);

// Force reload
location.reload();
```

---

### 6. Check Network Tab

1. Buka **F12** → Tab **Network**
2. Reload halaman
3. Cari request ke `/api/admin/users`
4. Klik request → Tab **Response**
5. Screenshot response-nya

---

## Checklist Debugging

- [ ] Backend running di port 5000
- [ ] Browser console tidak ada error merah
- [ ] Network tab show request ke `/api/admin/users` berhasil (200)
- [ ] Response dari API ada data `users`
- [ ] Token valid (tidak 401)
- [ ] Sudah try hard reload (Ctrl+Shift+R)
- [ ] Sudah clear localStorage

---

## Quick Fix Commands

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Test API
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Browser Console: Clear storage
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## Jika Masih Blank

Kirim screenshot:
1. **Browser console** (F12 → Console) - semua error
2. **Network tab** (F12 → Network) - request yang gagal
3. **Backend terminal** - output saat akses halaman
4. **URL bar** - pastikan di `/dashboard/admin/users`

---

## Common Causes & Solutions

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Blank putih total | Backend tidak jalan | Start backend |
| Spinner loading terus | API error | Check console error |
| 401 Unauthorized | Token expired | Logout & login lagi |
| 500 Server Error | Backend error | Check backend console |
| CORS error | Port salah | Check .env VITE_API_URL |
| Network error | Backend crashed | Restart backend |

---

## Prevention

Untuk mencegah halaman blank:
1. Selalu start backend sebelum akses admin pages
2. Check backend console tidak ada error
3. Jangan biarkan backend idle terlalu lama (token expire)
4. Test API endpoint sebelum navigate ke halaman

---

**Need Help?** 
Run diagnostics: `cd backend && node scripts/diagnose.js`
