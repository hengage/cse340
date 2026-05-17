import db from './db.js';

export async function getAllProjects() {
  const query = `
    SELECT p.id,
           p.organization_id,
           o.name AS organization_name,
           p.title,
           p.description,
           p.location,
           p.date
    FROM projects p
    JOIN organizations o ON o.id = p.organization_id
    ORDER BY p.date;
  `;

  const result = await pool.query(query);
  return result.rows.map((row) => ({
    ...row,
    date: row.date ? new Date(row.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null
  }));
}
