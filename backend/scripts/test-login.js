// Script to test login functionality
// Usage: node scripts/test-login.js

import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'clinic_queue_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database\n');

    const testAccounts = [
      { email: 'admin@clinic.com', password: 'admin123' },
      { email: 'dokter@clinic.com', password: 'dokter123' },
      { email: 'pasien@clinic.com', password: 'pasien123' }
    ];

    for (const account of testAccounts) {
      console.log(`Testing: ${account.email}`);
      
      // Get user from database
      const [users] = await connection.query(
        'SELECT u.*, p.full_name FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.email = ?',
        [account.email]
      );

      if (users.length === 0) {
        console.log(`❌ User not found in database\n`);
        continue;
      }

      const user = users[0];
      console.log(`   Found: ${user.full_name} (${user.role})`);
      console.log(`   Password in DB: ${user.password}`);

      // Test password
      const isValid = bcrypt.compareSync(account.password, user.password);
      
      if (isValid) {
        console.log(`   ✅ Password match! Login should work\n`);
      } else {
        console.log(`   ❌ Password mismatch! Login will fail\n`);
        
        // Generate correct hash
        const correctHash = bcrypt.hashSync(account.password, 10);
        console.log(`   Fix with this SQL:`);
        console.log(`   UPDATE users SET password = '${correctHash}' WHERE email = '${account.email}';\n`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testLogin();
