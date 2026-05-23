import db from './db.js';

export async function getAllCategories() {
  const result = await db.query('SELECT id, name, description FROM categories ORDER BY name');
  return result.rows;
}

export async function getCategoryById(id) {
  const result = await db.query('SELECT id, name, description FROM categories WHERE id = $1', [id]);
  return result.rows[0];
}

export async function getCategoriesForProject(projectId) {
  const query = `
    SELECT c.id, c.name
    FROM categories c
    JOIN project_categories pc ON c.id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
}

export async function getProjectsForCategory(categoryId) {
  const query = `
    SELECT p.id AS project_id, p.title
    FROM projects p
    JOIN project_categories pc ON p.id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.title;
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows;
}
