import { getAllCategories, getCategoryById, getProjectsForCategory } from '../models/categories.js';

const siteName = 'Service Impact';

export async function showCategoriesPage(req, res, next) {
  try {
    const categories = await getAllCategories();
    res.render('categories', {
      title: 'Categories',
      siteName,
      categories
    });
  } catch (error) {
    next(error);
  }
}

export async function showCategoryDetailsPage(req, res, next) {
  try {
    const categoryId = Number(req.params.id);
    if (Number.isNaN(categoryId)) {
      return res.status(400).render('error', {
        title: 'Invalid Category',
        siteName,
        error: 'Invalid category ID.'
      });
    }

    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).render('error', {
        title: 'Category Not Found',
        siteName,
        error: 'Category could not be found.'
      });
    }

    const projects = await getProjectsForCategory(categoryId);

    res.render('category', {
      title: category.name,
      siteName,
      category,
      projects
    });
  } catch (error) {
    next(error);
  }
}
