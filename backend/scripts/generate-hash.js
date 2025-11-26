// Script to generate bcrypt password hashes
// Usage: node scripts/generate-hash.js

import bcrypt from 'bcryptjs';

const passwords = {
  admin: 'admin123',
  dokter: 'dokter123',
  pasien: 'pasien123'
};

console.log('Generating password hashes...\n');

for (const [role, password] of Object.entries(passwords)) {
  const hash = bcrypt.hashSync(password, 10);
  console.log(`${role.toUpperCase()}:`);
  console.log(`  Password: ${password}`);
  console.log(`  Hash: ${hash}`);
  console.log('');
}

console.log('Copy the hashes above and update backend/database/schema.sql');
