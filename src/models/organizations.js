import db from './db.js';

export async function getAllOrganizations() {
  const result = await db.query(
    'SELECT id, name, description, image, website FROM organizations ORDER BY name'
  );
  return result.rows;
}

export async function getOrganizationDetails(id) {
  const result = await db.query(
    'SELECT id, name, description, image, website FROM organizations WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function getProjectsByOrganization(id) {
  const query = `
    SELECT p.id AS project_id,
           p.title,
           p.description,
           p.location,
           p.date,
           o.name AS organization_name
    FROM projects p
    JOIN organizations o ON o.id = p.organization_id
    WHERE p.organization_id = $1
    ORDER BY p.date ASC;
  `;

  const result = await db.query(query, [id]);
  return result.rows.map((row) => ({
    project_id: row.project_id,
    title: row.title,
    description: row.description,
    location: row.location,
    date: row.date ? new Date(row.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null,
    organization_name: row.organization_name
  }));
}
