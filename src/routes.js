import express from 'express';
import { 
  showProjectsPage, 
  showProjectDetailsPage, 
  showEditProjectForm, 
  processEditProjectForm 
} from './controllers/projects.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';

const router = express.Router();
const siteName = 'Service Impact';

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', express.urlencoded({ extended: true }), processEditProjectForm);

export default router;
