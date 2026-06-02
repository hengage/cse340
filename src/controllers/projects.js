import { 
  getUpcomingProjects, 
  getProjectDetails, 
  updateProject,
  createProject,
  getProjectCategories,
  updateProjectCategories
} from '../models/projects.js';
import { getCategoriesForProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

const siteName = 'Service Impact';
export const NUMBER_OF_UPCOMING_PROJECTS = 5;

// ... (existing showProjectsPage, showProjectDetailsPage, showEditProjectForm, processEditProjectForm)

export async function showNewProjectForm(req, res) {
  const organizations = await getAllOrganizations();
  res.render('new-project', { title: 'New Project', siteName, organizations });
}

export async function processNewProjectForm(req, res, next) {
  try {
    const { organization_id, title, description, location, date } = req.body;
    // Simple server-side validation
    if (!title || !date) {
      return res.status(400).render('new-project', { title: 'New Project', siteName, error: 'Title and Date are required' });
    }
    await createProject(organization_id, title, description, location, date);
    res.redirect('/projects');
  } catch (error) {
    next(error);
  }
}

export async function showAssignCategoriesForm(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    const categories = await getProjectCategories(projectId);
    res.render('assign-categories', { title: 'Assign Categories', siteName, projectId, categories });
  } catch (error) {
    next(error);
  }
}

export async function processAssignCategoriesForm(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    const categoryIds = req.body.category_ids; // Assumes array of IDs from checkboxes
    await updateProjectCategories(projectId, Array.isArray(categoryIds) ? categoryIds : [categoryIds]);
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}
