import { 
  getAllCategories, 
  getCategoryById, 
  getProjectsForCategory,
  createCategory,
  updateCategory 
} from '../models/categories.js';

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

export async function showNewCategoryForm(req, res) {
  res.render('new-category', { title: 'New Category', siteName });
}

export async function processNewCategoryForm(req, res, next) {
  try {
    const name = (req.body.name || '').trim();
    
    // Server-side validation
    if (name.length < 3 || name.length > 100) {
      return res.status(400).render('new-category', {
        title: 'New Category',
        siteName,
        error: 'Category name must be between 3 and 100 characters.'
      });
    }

    await createCategory(name);
    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
}

export async function showEditCategoryForm(req, res, next) {
  try {
    const categoryId = Number(req.params.id);
    if (Number.isNaN(categoryId)) {
      return res.status(400).render('error', { title: 'Invalid Category', siteName, error: 'Invalid ID' });
    }
    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).render('error', { title: 'Category Not Found', siteName, error: 'Not found' });
    }
    res.render('edit-category', { title: 'Edit Category', siteName, category });
  } catch (error) {
    next(error);
  }
}

export async function processEditCategoryForm(req, res, next) {
  try {
    const categoryId = Number(req.params.id);
    if (Number.isNaN(categoryId)) {
      return res.status(400).render('error', { title: 'Invalid Category', siteName, error: 'Invalid ID' });
    }
    const name = req.body.name ? req.body.name.trim() : '';

    // Server-side validation
    if (name.length < 3 || name.length > 100) {
      const category = await getCategoryById(categoryId);
      if (!category) {
        return res.status(404).render('error', {
          title: 'Category Not Found',
          siteName,
          error: 'The category you are trying to update no longer exists.'
        });
      }
      return res.status(400).render('edit-category', {
        title: 'Edit Category',
        siteName,
        category,
        error: 'Category name must be between 3 and 100 characters.'
      });
    }

    await updateCategory(categoryId, name);
    res.redirect('/categories');
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).render('error', { title: 'Category Not Found', siteName, error: 'Not found' });
    }
    next(error);
  }
}

      return res.status(400).render('edit-category', {
        title: 'Edit Category',
        siteName,
        category,
        error: 'Category name must be between 3 and 100 characters.'
      });
    }

    await updateCategory(categoryId, name);
    res.redirect('/categories');
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).render('error', { title: 'Category Not Found', siteName, error: 'Not found' });
    }
    next(error);
  }
}
