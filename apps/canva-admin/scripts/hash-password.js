#!/usr/bin/env node

/**
 * Script to generate bcrypt hash for default admin password
 * Usage: node scripts/hash-password.js [password]
 * Default password: admin123
 */

const bcrypt = require('bcryptjs');
const password = process.argv[2] || 'user123';

bcrypt.hash(password, 10).then(hash => {
  console.log(`Password: ${password}`);
  console.log(`Bcrypt Hash: ${hash}`);
  console.log('\nUse this hash in the SQL script: apps/canva-admin/database/insert_default_user.sql');
}).catch(err => {
  console.error('Error hashing password:', err);
  process.exit(1);
});

