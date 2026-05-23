import { getAllOrganizations, getOrganizationDetails, getProjectsByOrganization } from '../models/organizations.js';

const siteName = 'Service Impact';

export async function showOrganizationsPage(req, res, next) {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', { title: 'Organizations', siteName, organizations });
  } catch (error) {
    next(error);
  }
}

export async function showOrganizationDetailsPage(req, res, next) {
  try {
    const organizationId = Number(req.params.id);
    if (Number.isNaN(organizationId)) {
      return res.status(400).render('error', {
        title: 'Invalid Organization',
        siteName,
        error: 'Invalid organization ID.'
      });
    }

    const organization = await getOrganizationDetails(organizationId);
    if (!organization) {
      return res.status(404).render('error', {
        title: 'Organization Not Found',
        siteName,
        error: 'Organization could not be found.'
      });
    }

    const projects = await getProjectsByOrganization(organizationId);
    res.render('organization', {
      title: organization.name,
      siteName,
      organization,
      projects
    });
  } catch (error) {
    next(error);
  }
}
