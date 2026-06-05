import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '../models/users.js';

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
