import express from 'express';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { getAllCategories } from './models/categories.js';

const router = express.Router();

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', { title: 'Categories', categories });
  } catch (error) {
    next(error);
  }
});

export default router;
