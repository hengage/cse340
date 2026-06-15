import db from './db.js';

export async function addVolunteer(userId, projectId) {
  await db.query(
    'INSERT INTO user_projects (user_id, project_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, projectId]
  );
}

export async function removeVolunteer(userId, projectId) {
  await db.query(
    'DELETE FROM user_projects WHERE user_id = $1 AND project_id = $2',
    [userId, projectId]
  );
}

export async function getProjectsForUser(userId) {
  const query = `
    SELECT p.id AS project_id, p.title, p.description, p.location, p.date
    FROM projects p
    JOIN user_projects up ON p.id = up.project_id
    WHERE up.user_id = $1
    ORDER BY p.date ASC;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
}

export async function isUserVolunteered(userId, projectId) {
  const result = await db.query(
    'SELECT 1 FROM user_projects WHERE user_id = $1 AND project_id = $2',
    [userId, projectId]
  );
  return result.rowCount > 0;
}
