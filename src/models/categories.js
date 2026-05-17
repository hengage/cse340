import db from './db.js';

export async function getAllCategories() {
  const result = await db.query('SELECT id, name, description FROM categories ORDER BY name');
  return result.rows;
}
