import db from './db.js';

const formatProject = (row) => ({
  project_id: row.project_id,
  organization_id: row.organization_id,
  organization_name: row.organization_name,
  title: row.title,
  description: row.description,
  location: row.location,
  date: row.date ? new Date(row.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null
});

export async function getAllProjects() {
  const query = `
    SELECT p.id AS project_id,
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

  const result = await db.query(query);
  return result.rows.map(formatProject);
}

export async function getUpcomingProjects(number_of_projects) {
  const query = `
    SELECT p.id AS project_id,
           p.organization_id,
           o.name AS organization_name,
           p.title,
           p.description,
           p.location,
           p.date
    FROM projects p
    JOIN organizations o ON o.id = p.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);
  return result.rows.map(formatProject);
}

export async function getProjectDetails(id) {
  const query = `
    SELECT p.id AS project_id,
           p.organization_id,
           o.name AS organization_name,
           p.title,
           p.description,
           p.location,
           p.date
    FROM projects p
    JOIN organizations o ON o.id = p.organization_id
    WHERE p.id = $1;
  `;

  const result = await db.query(query, [id]);
  if (result.rowCount === 0) {
    return null;
  }

  return formatProject(result.rows[0]);
}

export async function updateProject(id, organization_id, title, description, location, date) {
  const query = `
    UPDATE projects
    SET organization_id = $1, title = $2, description = $3, location = $4, date = $5
    WHERE id = $6
    RETURNING id;
  `;
  const result = await db.query(query, [organization_id, title, description, location, date, id]);
  if (result.rowCount === 0) {
    throw new Error('Project not found');
  }
  return result.rows[0];
}
