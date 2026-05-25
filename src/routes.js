import express from 'express';
import { 
  showProjectsPage, 
  showProjectDetailsPage, 
  showEditProjectForm, 
  processEditProjectForm 
} from './controllers/projects.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { 
  showCategoriesPage, 
  showCategoryDetailsPage, 
  showNewCategoryForm, 
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm
} from './controllers/categories.js';

const router = express.Router();

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', express.urlencoded({ extended: true }), processEditProjectForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', express.urlencoded({ extended: true }), processNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', express.urlencoded({ extended: true }), processEditCategoryForm);

export default router;

