import { 
  getAllOrganizations, 
  getOrganizationDetails, 
  getProjectsByOrganization,
  createOrganization,
  updateOrganization
} from '../models/organizations.js';

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

export async function showNewOrganizationForm(req, res) {
  res.render('new-organization', { title: 'New Organization', siteName });
}

export async function processNewOrganizationForm(req, res, next) {
  try {
    const { name, description, image, website } = req.body;
    // Basic validation
    if (!name || name.length < 3) {
      return res.status(400).render('new-organization', {
        title: 'New Organization',
        siteName,
        error: 'Organization name is required and must be at least 3 characters.'
      });
    }
    await createOrganization(name, description, image, website);
    req.flash('message', 'Organization created successfully.');
    res.redirect('/organizations');
  } catch (error) {
    next(error);
  }
}

export async function processEditOrganizationForm(req, res, next) {
  try {
    const organizationId = Number(req.params.id);
    const { name, description, image, website } = req.body;
    // Basic validation
    if (!name || name.length < 3) {
      const organization = await getOrganizationDetails(organizationId);
      return res.status(400).render('edit-organization', {
        title: 'Edit Organization',
        siteName,
        organization,
        error: 'Organization name is required and must be at least 3 characters.'
      });
    }
    await updateOrganization(organizationId, name, description, image, website);
    req.flash('message', 'Organization updated successfully.');
    res.redirect(`/organization/${organizationId}`);
  } catch (error) {
    next(error);
  }
}

export async function showEditOrganizationForm(req, res, next) {
  try {
    const organizationId = Number(req.params.id);
    const organization = await getOrganizationDetails(organizationId);
    if (!organization) {
      return res.status(404).render('error', { title: 'Organization Not Found', siteName, error: 'Not found' });
    }
    res.render('edit-organization', { title: 'Edit Organization', siteName, organization });
  } catch (error) {
    next(error);
  }
}