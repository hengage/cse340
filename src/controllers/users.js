import bcrypt from 'bcrypt';
import { createUser, getUserByEmail, authenticateUser, getAllUsers } from '../models/users.js';

const siteName = 'Service Impact';

export async function showUserRegistrationForm(req, res) {
  res.render('register', { title: 'Register', siteName });
}

export async function processUserRegistrationForm(req, res, next) {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    
    // Server-side validation
    if (!name || name.length < 3) {
      return res.status(400).render('register', {
        title: 'Register',
        siteName,
        error: 'Name must be at least 3 characters long.'
      });
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).render('register', {
        title: 'Register',
        siteName,
        error: 'Please provide a valid email address.'
      });
    }
    
    if (!password || password.length < 8) {
      return res.status(400).render('register', {
        title: 'Register',
        siteName,
        error: 'Password must be at least 8 characters long.'
      });
    }
    
    if (password !== passwordConfirm) {
      return res.status(400).render('register', {
        title: 'Register',
        siteName,
        error: 'Passwords do not match.'
      });
    }
    
    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).render('register', {
        title: 'Register',
        siteName,
        error: 'Email is already registered.'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    await createUser(name, email, passwordHash);
    
    req.flash('message', 'Registration successful! You can now log in.');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}

export async function showLoginForm(req, res) {
  res.render('login', { title: 'Login', siteName });
}

export async function processLoginForm(req, res, next) {
  try {
    const { email, password } = req.body;
    
    const user = await authenticateUser(email, password);
    
    if (user) {
      req.session.user = user;
      req.flash('message', 'Login successful!');
      console.log('User logged in:', user);
      res.redirect('/dashboard');
    } else {
      req.flash('error', 'Login failed. Please check your email and password.');
      res.redirect('/login');
    }
  } catch (error) {
    next(error);
  }
}

export async function processLogout(req, res, next) {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      req.flash('message', 'You have been logged out.');
      res.redirect('/login');
    });
  } catch (error) {
    next(error);
  }
}

export function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/login');
  }
  next();
}

export async function showDashboard(req, res) {
  const { name, email, role_id } = req.session.user;
  res.render('dashboard', { title: 'Dashboard', siteName, name, email, role_id });
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash('error', 'You must be logged in to access that page.');
      return res.redirect('/login');
    }
    
    if (req.session.user.role_id !== 2) { // role_id 2 is admin
      req.flash('error', 'You do not have permission to access that page.');
      return res.redirect('/dashboard');
    }
    
    next();
  };
}

export async function showUsersList(req, res) {
  try {
    const users = await getAllUsers();
    res.render('users', { title: 'Users', siteName, users });
  } catch (error) {
    req.flash('error', 'Error retrieving users.');
    res.redirect('/dashboard');
  }
}
