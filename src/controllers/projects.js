import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

export const NUMBER_OF_UPCOMING_PROJECTS = 5;

export async function showProjectsPage(req, res, next) {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('projects', {
      title: 'Upcoming Service Projects',
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
        error: 'Invalid project ID.'
      });
    }

    const project = await getProjectDetails(projectId);
    if (!project) {
      return res.status(404).render('error', {
        title: 'Project Not Found',
        error: 'Project could not be found.'
      });
    }

    res.render('project', {
      title: project.title,
      project
    });
  } catch (error) {
    next(error);
  }
}
