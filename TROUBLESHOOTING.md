# 🔧 Troubleshooting Guide - Klinik Sehat

Panduan lengkap mengatasi masalah umum saat setup dan menjalankan aplikasi.

---

## 📍 Checklist Sebelum Mulai

Pastikan semua ini sudah OK sebelum troubleshoot:

- [ ] MySQL sudah installed dan running
- [ ] Node.js (v16+) sudah installed
- [ ] Backend & Frontend dependencies sudah di-install (`npm install`)
- [ ] File `.env` sudah ada di root folder DAN di folder `backend`
- [ ] Port 5000 tidak digunakan aplikasi lain

---

## ❌ Problem #1: Tidak Bisa Login dengan Akun Dummy

### Gejala:
- Login dengan `admin@clinic.com` / `admin123` gagal
- Error: "Email atau password salah"
- Atau loading terus tanpa response

### Diagnosis Step-by-Step:

#### Step 1: Check Backend Running
```bash
# Check apakah backend jalan di port 5000
lsof -i :5000
# atau
curl http://localhost:5000/health
```

**Jika tidak ada response:**
```bash
cd backend
npm run dev
```

**✅ Output yang benar:**
```
Server is running on port 5000
```

---

#### Step 2: Check Database Exists
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'clinic_queue_db';"
```

**Jika database tidak ada:**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE clinic_queue_db;"

# Import schema (ini sudah include 3 users dummy)
mysql -u root -p clinic_queue_db < backend/database/schema.sql
```

---

#### Step 3: Check Users Exist
```bash
mysql -u root -p clinic_queue_db -e "SELECT id, email, role FROM users;"
```

**✅ Output yang benar:**
```
+----+----------------------+--------+
| id | email                | role   |
+----+----------------------+--------+
|  1 | admin@clinic.com     | admin  |
|  2 | dokter@clinic.com    | dokter |
|  3 | pasien@clinic.com    | pasien |
+----+----------------------+--------+
```

**Jika users tidak ada atau kosong:**
```bash
cd backend
node scripts/create-users.js
```

---

#### Step 4: Test Password Hash
```bash
cd backend
node scripts/test-login.js
```

**✅ Output yang benar:**
```
✅ Connected to database

Testing: admin@clinic.com
   Found: Administrator (admin)
   ✅ Password match! Login should work

Testing: dokter@clinic.com
   Found: Dr. Budi Santoso, Sp.PD (dokter)
   ✅ Password match! Login should work

Testing: pasien@clinic.com
   Found: Ahmad Rizki (pasien)
   ✅ Password match! Login should work
```

**❌ Jika ada password mismatch:**
Script akan kasih SQL command untuk fix. Copy dan run di MySQL:
```sql
UPDATE users SET password = 'HASH_DARI_OUTPUT' WHERE email = 'admin@clinic.com';
```

---

#### Step 5: Test Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"admin123"}'
```

**✅ Response yang benar:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@clinic.com",
    "role": "admin",
    "full_name": "Administrator"
  }
}
```

**❌ Response error:**
```json
{
  "message": "Email atau password salah"
}
```
→ Kembali ke Step 3 atau 4

---

### 🚀 Quick Fix (Nuclear Option)

Jika masih belum solve, coba fresh install:

```bash
# 1. Stop backend (Ctrl+C)

# 2. Drop & create database fresh
mysql -u root -p << EOF
DROP DATABASE IF EXISTS clinic_queue_db;
CREATE DATABASE clinic_queue_db;
EOF

# 3. Import schema (includes users)
mysql -u root -p clinic_queue_db < backend/database/schema.sql

# 4. Verify users created
mysql -u root -p clinic_queue_db -e "SELECT email, role, LEFT(password, 20) as pwd_preview FROM users;"

# Output harus ada 3 rows

# 5. Restart backend
cd backend
npm run dev
```

---

## ❌ Problem #2: "Failed to Fetch" / Network Error

### Gejala:
- Error di browser console: "Failed to fetch"
- Atau "ERR_CONNECTION_REFUSED"

### Solusi:

#### Check 1: Backend Running?
```bash
lsof -i :5000
```
Jika kosong, backend tidak jalan. Start dengan:
```bash
cd backend && npm run dev
```

#### Check 2: Port Benar?
```bash
# Check backend/.env
grep PORT backend/.env
# Harus: PORT=5000

# Check frontend .env
grep VITE_API_URL .env
# Harus: VITE_API_URL=http://localhost:5000/api
```

#### Check 3: CORS Issue?
Buka `backend/server.js`, pastikan ada:
```javascript
import cors from 'cors';
app.use(cors());
```

---

## ❌ Problem #3: Port 5000 Already in Use

### Gejala:
```
Error: listen EADDRINUSE: address already in use :::5000
```

### Solusi:

#### Option 1: Kill Process yang Pakai Port 5000
```bash
# Find process
lsof -i :5000

# Kill by PID
kill -9 <PID>
```

#### Option 2: Ganti Port
```bash
# Edit backend/.env
PORT=5001

# Edit .env (root)
VITE_API_URL=http://localhost:5001/api

# Restart backend
cd backend && npm run dev
```

---

## ❌ Problem #4: MySQL Connection Error

### Gejala:
```
Error: Access denied for user 'root'@'localhost'
```
atau
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

### Solusi:

#### Check 1: MySQL Running?
```bash
# macOS
mysql.server status
mysql.server start  # jika stopped

# Linux
sudo service mysql status
sudo service mysql start

# Windows
net start MySQL
```

#### Check 2: Credentials Benar?
```bash
# Test connection
mysql -u root -p -e "SELECT 1;"

# Jika success, credentials OK
```

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=clinic_queue_db
DB_PORT=3306
```

#### Check 3: Database Permissions
```sql
-- Login ke MySQL
mysql -u root -p

-- Grant privileges
GRANT ALL PRIVILEGES ON clinic_queue_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

---

## ❌ Problem #5: Frontend Tidak Tampil Data

### Gejala:
- Login berhasil
- Tapi halaman kosong atau loading terus
- Data tidak muncul di dashboard

### Diagnosis:

#### Check 1: Network Tab (F12)
1. Buka browser Developer Tools (F12)
2. Tab "Network"
3. Reload halaman
4. Lihat request yang gagal (merah)

**Cari:**
- Status code 401 → Token expired atau invalid
- Status code 500 → Backend error
- Status code 404 → Route salah

#### Check 2: Console Errors
Tab "Console" di Developer Tools, lihat error messages

#### Check 3: Backend Console
Lihat terminal backend, ada error?

---

## ✅ Checklist Sukses

Aplikasi berjalan dengan baik jika:

- [ ] Backend running tanpa error: `Server is running on port 5000`
- [ ] Frontend running: `Local: http://localhost:5173/`
- [ ] MySQL running: `mysql.server status` → Running
- [ ] Database exist: `SHOW DATABASES;` → `clinic_queue_db`
- [ ] Users exist: `SELECT * FROM users;` → 3 rows
- [ ] Login berhasil: Dashboard muncul sesuai role
- [ ] Test API berhasil: `curl localhost:5000/health` → OK

---

## 📞 Masih Bermasalah?

Kumpulkan informasi ini:

1. **Screenshot error** (browser & terminal)
2. **Backend console output** (copy semua)
3. **Browser console errors** (F12 → Console)
4. **Versions:**
   ```bash
   node --version
   npm --version
   mysql --version
   ```
5. **Test results:**
   ```bash
   cd backend
   node scripts/test-login.js
   ```

---

## 🔍 Debug Mode

Aktifkan debug untuk info lebih lengkap:

**Backend `backend/server.js`:**
```javascript
// Add after imports
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

**Check .env values:**
```bash
# Backend
cat backend/.env

# Frontend
cat .env
```

---

## 💡 Tips Debugging

1. **Selalu check backend running dulu** sebelum test frontend
2. **Gunakan Postman/cURL** untuk test API langsung
3. **Check browser console** untuk error messages
4. **Restart backend** setelah ubah code
5. **Clear localStorage** jika auth bermasalah:
   ```javascript
   // Di browser console
   localStorage.clear();
   location.reload();
   ```

---

**Good Luck!** 🚀
