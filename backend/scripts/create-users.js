// Script to create default users in database
// Usage: node scripts/create-users.js

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const users = [
  {
    email: 'admin@clinic.com',
    password: 'admin123',
    role: 'admin',
    full_name: 'Administrator',
    phone: '081234567890',
    gender: 'L',
    address: 'Jl. Admin No. 1'
  },
  {
    email: 'dokter@clinic.com',
    password: 'dokter123',
    role: 'dokter',
    full_name: 'Dr. Budi Santoso, Sp.PD',
    phone: '081234567891',
    gender: 'L',
    address: 'Jl. Dokter No. 2'
  },
  {
    email: 'pasien@clinic.com',
    password: 'pasien123',
    role: 'pasien',
    full_name: 'Ahmad Rizki',
    phone: '081234567892',
    gender: 'L',
    address: 'Jl. Pasien No. 3'
  }
];

async function createUsers() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'clinic_queue_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to database');
    console.log('Creating users...\n');

    for (const user of users) {
      try {
        // Check if user exists
        const [existing] = await connection.query(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );

        if (existing.length > 0) {
          console.log(`❌ User ${user.email} already exists. Skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        console.log(`Creating ${user.role}: ${user.email}`);
        console.log(`Password: ${user.password}`);
        console.log(`Hash: ${hashedPassword}`);

        // Insert user
        const [result] = await connection.query(
          'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
          [user.email, hashedPassword, user.role]
        );

        const userId = result.insertId;

        // Insert profile
        await connection.query(
          'INSERT INTO profiles (user_id, full_name, phone, gender, address) VALUES (?, ?, ?, ?, ?)',
          [userId, user.full_name, user.phone, user.gender, user.address]
        );

        console.log(`✅ User ${user.email} created successfully (ID: ${userId})`);
        console.log('');
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
      }
    }

    // Create doctor schedules for dokter
    console.log('Creating doctor schedules...');
    const [dokter] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['dokter@clinic.com']
    );

    if (dokter.length > 0) {
      const doctorId = dokter[0].id;
      
      // Check if schedules already exist
      const [existingSchedules] = await connection.query(
        'SELECT id FROM doctor_schedules WHERE doctor_id = ?',
        [doctorId]
      );

      if (existingSchedules.length === 0) {
        const schedules = [
          { day: 'Senin', start: '08:00:00', end: '12:00:00', max: 20 },
          { day: 'Selasa', start: '08:00:00', end: '12:00:00', max: 20 },
          { day: 'Rabu', start: '08:00:00', end: '12:00:00', max: 20 },
          { day: 'Kamis', start: '08:00:00', end: '12:00:00', max: 20 },
          { day: 'Jumat', start: '08:00:00', end: '11:00:00', max: 15 }
        ];

        for (const schedule of schedules) {
          await connection.query(
            'INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [doctorId, schedule.day, schedule.start, schedule.end, schedule.max, 'Poliklinik Umum']
          );
        }
        console.log('✅ Doctor schedules created');
      } else {
        console.log('❌ Doctor schedules already exist');
      }
    }

    console.log('\n✅ All done!');
    console.log('\nTest accounts:');
    console.log('Admin:  admin@clinic.com / admin123');
    console.log('Dokter: dokter@clinic.com / dokter123');
    console.log('Pasien: pasien@clinic.com / pasien123');

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('\nMake sure:');
    console.error('1. MySQL is running');
    console.error('2. Database "clinic_queue_db" exists');
    console.error('3. .env file has correct credentials');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createUsers();
