import { getUpcomingProjects, getProjectDetails, updateProject } from '../models/projects.js';
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

export async function processEditProjectForm(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    const { organization_id, title, description, location, date } = req.body;
    await updateProject(projectId, organization_id, title, description, location, date);
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}
