import express from 'express';
import { 
  showProjectsPage, 
  showProjectDetailsPage, 
  showEditProjectForm, 
  processEditProjectForm,
  showNewProjectForm,
  processNewProjectForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm
} from './controllers/projects.js';
import { 
  showOrganizationsPage, 
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm
} from './controllers/organizations.js';
import { 
  showCategoriesPage, 
  showCategoryDetailsPage, 
  showNewCategoryForm, 
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm
} from './controllers/categories.js';
import { 
  showUserRegistrationForm, 
  processUserRegistrationForm 
} from './controllers/users.js';

const router = express.Router();

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', express.urlencoded({ extended: true }), processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', express.urlencoded({ extended: true }), processEditOrganizationForm);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', express.urlencoded({ extended: true }), processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', express.urlencoded({ extended: true }), processEditProjectForm);
router.get('/project/:id/assign-categories', showAssignCategoriesForm);
router.post('/project/:id/assign-categories', express.urlencoded({ extended: true }), processAssignCategoriesForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', express.urlencoded({ extended: true }), processNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', express.urlencoded({ extended: true }), processEditCategoryForm);

router.get('/register', showUserRegistrationForm);
router.post('/register', express.urlencoded({ extended: true }), processUserRegistrationForm);

export default router;


