# Clinic Queue Pro - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MySQL Database
- Create MySQL database named `clinic_queue_db`
- Import the schema from `database/schema.sql`

```sql
mysql -u root -p < database/schema.sql
```

### 3. Configure Environment Variables
Create `.env` file in backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clinic_queue_db
DB_PORT=3306

JWT_SECRET=your_secret_key_here
PORT=5000
```

### 4. Create Default Admin User
The admin password needs to be hashed. Run this command:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
```

Copy the output and replace `$2a$10$YourHashedPasswordHere` in `database/schema.sql` with the actual hash.

### 5. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (requires auth)

### Doctor Routes
- `GET /api/doctor/schedules` - Get doctor schedules
- `POST /api/doctor/schedules` - Create schedule
- `PUT /api/doctor/schedules/:id` - Update schedule
- `DELETE /api/doctor/schedules/:id` - Delete schedule
- `POST /api/doctor/medical-records` - Create medical record
- `GET /api/doctor/medical-records/:patient_id` - Get patient medical records
- `GET /api/doctor/today-patients` - Get today's patients

### Patient Routes
- `GET /api/patient/doctors` - Get all doctors
- `GET /api/patient/doctors/:doctor_id/schedules` - Get doctor schedules
- `POST /api/patient/appointments` - Create appointment
- `GET /api/patient/appointments` - Get my appointments
- `GET /api/patient/queue/:appointment_id` - Get queue status
- `POST /api/patient/consultations` - Create consultation
- `GET /api/patient/consultations` - Get my consultations

### Admin Routes
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/queue/today` - Get today's queue
- `POST /api/admin/queue/call` - Call queue
- `POST /api/admin/queue/complete` - Complete queue
- `POST /api/admin/queue/skip` - Skip queue
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/patients/:id` - Get patient detail
- `POST /api/admin/notifications` - Create notification
- `POST /api/admin/notifications/bulk` - Send bulk notification

## Default Credentials

After setting up, use these credentials to login:

**Admin:**
- Email: admin@clinic.com
- Password: admin123

**Dokter:**
- Email: dokter@clinic.com
- Password: dokter123

**Pasien:**
- Email: pasien@clinic.com
- Password: pasien123

See `../TEST_ACCOUNTS.md` for detailed information about each account and their features.

## Tech Stack

- Node.js + Express
- MySQL2
- JWT for authentication
- bcryptjs for password hashing
