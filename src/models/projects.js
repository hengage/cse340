import db from './db.js';
import { pool } from '../db/index.js'; // Import pool for transactions

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

export async function createProject(organization_id, title, description, location, date) {
  const result = await db.query(
    'INSERT INTO projects (organization_id, title, description, location, date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [organization_id, title, description, location, date]
  );
  return result.rows[0].id;
}

export async function getProjectCategories(projectId) {
  const query = `
    SELECT c.id, c.name, 
           EXISTS (SELECT 1 FROM project_categories pc WHERE pc.project_id = $1 AND pc.category_id = c.id) as is_assigned
    FROM categories c
    ORDER BY c.name;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
}

export async function updateProjectCategories(projectId, categoryIds) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM project_categories WHERE project_id = $1', [projectId]);
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map((_, i) => `($1, $${i + 2})`).join(',');
      const query = `INSERT INTO project_categories (project_id, category_id) VALUES ${values}`;
      await client.query(query, [projectId, ...categoryIds]);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

