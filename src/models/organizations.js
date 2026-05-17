import db from './db.js';

export async function getAllOrganizations() {
  const result = await db.query(
    'SELECT id, name, description, image, website FROM organizations ORDER BY name'
  );
  return result.rows;
}
