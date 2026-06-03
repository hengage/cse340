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

export async function showProjectsPage(req, res, next) {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('projects', {
      title: 'Upcoming Service Projects',
      siteName,
      serviceProjects: projects
    });
  } catch (error) {
    next(error);
  }
}

export async function showProjectDetailsPage(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    if (Number.isNaN(projectId)) {
      return res.status(400).render('error', {
        title: 'Invalid Project',
        siteName,
        error: 'Invalid project ID.'
      });
    }

    const project = await getProjectDetails(projectId);
    if (!project) {
      return res.status(404).render('error', {
        title: 'Project Not Found',
        siteName,
        error: 'Project could not be found.'
      });
    }

    const categories = await getCategoriesForProject(projectId);

    res.render('project', {
      title: project.title,
      siteName,
      project,
      categories
    });
  } catch (error) {
    next(error);
  }
}

export async function showEditProjectForm(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    if (Number.isNaN(projectId)) {
      return res.status(400).render('error', {
        title: 'Invalid Project',
        siteName,
        error: 'Invalid project ID.'
      });
    }

    const project = await getProjectDetails(projectId);
    if (!project) {
      return res.status(404).render('error', {
        title: 'Project Not Found',
        siteName,
        error: 'Project could not be found.'
      });
    }
    const organizations = await getAllOrganizations();
    res.render('update-project', {
      title: 'Edit Project',
      siteName,
      project,
      organizations
    });
  } catch (error) {
    next(error);
  }
}

export async function processNewProjectForm(req, res, next) {
  try {
    const title = (req.body.title || '').trim();
    const { organization_id, description, location, date } = req.body;
    
    // Server-side validation
    if (title.length < 3 || title.length > 100 || !date) {
      const organizations = await getAllOrganizations();
      return res.status(400).render('new-project', { 
        title: 'New Project', 
        siteName, 
        organizations,
        error: 'Title must be 3-100 characters and Date is required.' 
      });
    }
    const newProjectId = await createProject(organization_id, title, description, location, date);
    req.flash('message', 'Project created successfully.');
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    next(error);
  }
}

export async function processEditProjectForm(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    const title = (req.body.title || '').trim();
    const { organization_id, description, location, date } = req.body;

    // Server-side validation
    if (title.length < 3 || title.length > 100 || !date) {
      const project = await getProjectDetails(projectId);
      const organizations = await getAllOrganizations();
      if (!project) {
        return res.status(404).render('error', {
          title: 'Project Not Found',
          siteName,
          error: 'The project you are trying to update no longer exists.'
        });
      }
      return res.status(400).render('update-project', {
        title: 'Edit Project',
        siteName,
        project,
        organizations,
        error: 'Title must be 3-100 characters and Date is required.'
      });
    }
    
    await updateProject(projectId, organization_id, title, description, location, date);
    req.flash('message', 'Project updated successfully.');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).render('error', {
        title: 'Project Not Found',
        siteName,
        error: 'The project you are trying to update no longer exists.'
      });
    }
    next(error);
  }
}

export async function processAssignCategoriesForm(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    // Ensure categoryIds is always an array, defaulting to empty if undefined/null
    let categoryIds = req.body.category_ids || [];
    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }
    
    await updateProjectCategories(projectId, categoryIds);
    req.flash('message', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}

export async function showNewProjectForm(req, res, next) {
  try {
    const organizations = await getAllOrganizations();
    res.render('new-project', { title: 'New Project', siteName, organizations });
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