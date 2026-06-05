import bcrypt from 'bcrypt';
import db from './db.js';

export async function createUser(name, email, passwordHash) {
  const query = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = 'user'))
    RETURNING user_id
  `;
  
  const result = await db.query(query, [name, email, passwordHash]);
  return result.rows[0].user_id;
}

export async function getUserByEmail(email) {
  const query = 'SELECT user_id, name, email, password_hash, role_id FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0] ?? null;
}

async function findUserByEmail(email) {
  const query = `
    SELECT user_id, name, email, password_hash, role_id 
    FROM users 
    WHERE email = $1
  `;
  const result = await db.query(query, [email]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0];
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await verifyPassword(password, user.password_hash);
  
  if (!isPasswordValid) {
    return null;
  }
  
  // Remove password_hash before returning
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
