-- Drop existing tables so the setup script can be re-run during development.
DROP TABLE IF EXISTS user_projects;
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  website TEXT
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE project_categories (
  project_id INTEGER REFERENCES projects(id),
  category_id INTEGER REFERENCES categories(id),
  PRIMARY KEY (project_id, category_id)
);

CREATE TABLE user_projects (
  user_id INTEGER REFERENCES users(user_id),
  project_id INTEGER REFERENCES projects(id),
  PRIMARY KEY (user_id, project_id)
);

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO organizations (name, description, image, website) VALUES
  ('Green Valley Alliance', 'A volunteer-led nonprofit focused on environmental restoration and community education.', 'environment.svg', 'https://green-valley.example.org'),
  ('Bright Futures Foundation', 'Programs that support educational opportunities and mentorship for youth.', 'education.svg', 'https://bright-futures.example.org'),
  ('Community Care Network', 'Local initiatives designed to strengthen families through service and wellness projects.', 'community.svg', 'https://community-care.example.org');

INSERT INTO projects (organization_id, title, description, location, date) VALUES
  (1, 'Neighborhood Cleanup', 'Organized volunteer days to refresh parks and public spaces with litter removal and landscaping.', 'Green Valley Park', '2026-06-05'),
  (1, 'River Restoration', 'Working with volunteers to plant native trees along the riverbank and remove invasive weeds.', 'Riverbend Preserve', '2026-06-18'),
  (1, 'Garden Build Day', 'Creating community gardens to improve access to fresh produce and teach sustainable gardening.', 'Meadow Community Garden', '2026-07-02'),
  (1, 'Recycling Awareness', 'Educating local families about recycling options, composting, and proper waste sorting.', 'Green Valley Community Center', '2026-07-16'),
  (1, 'Trail Repair Crew', 'Restoring hiking trails and building erosion control for safer outdoor access.', 'Hillside Trail System', '2026-07-30'),
  (2, 'After-School Tutoring', 'Supporting student success with tutoring, mentoring, and family engagement activities.', 'Northside Elementary', '2026-06-09'),
  (2, 'Book Drive', 'Collecting and distributing school supplies, books, and learning kits for underserved youth.', 'Bright Futures HQ', '2026-06-23'),
  (2, 'STEM Exploration Night', 'Hosting a hands-on science and math event to inspire middle school students.', 'Sunset Middle School', '2026-07-07'),
  (2, 'Scholarship Workshop', 'Helping students complete scholarship applications and college essays.', 'City Library', '2026-07-21'),
  (2, 'Mentor Match Launch', 'Pairing community mentors with at-risk youth for sustained academic support.', 'Bright Futures Center', '2026-08-04'),
  (3, 'Wellness Walks', 'Community health events that promote fitness, friendship, and mental wellness.', 'Lakeside Trail', '2026-06-12'),
  (3, 'Food Pantry Support', 'Sorting donations and distributing groceries to families in need.', 'Community Care Warehouse', '2026-06-26'),
  (3, 'Family Resource Fair', 'Connecting families with local health, housing, and education resources.', 'Downtown Pavilion', '2026-07-10'),
  (3, 'Senior Outreach', 'Visiting seniors to provide companionship, wellness checks, and essential supplies.', 'Riverbend Senior Center', '2026-07-24'),
  (3, 'Neighborhood Wellness Day', 'Offering free health screenings, fitness classes, and support services.', 'Community Care Field', '2026-08-07');

INSERT INTO categories (name, description) VALUES
  ('Environmental', 'Projects focused on environment and conservation.'),
  ('Educational', 'Programs supporting learning and mentoring.'),
  ('Community Service', 'Local community support and volunteer events.'),
  ('Health and Wellness', 'Events promoting health and wellbeing');

INSERT INTO project_categories (project_id, category_id) VALUES
  (1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
  (6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
  (11, 4), (12, 3), (13, 3), (14, 3), (15, 3);

INSERT INTO roles (role_name, role_description) VALUES
  ('user', 'Standard user with basic access'),
  ('admin', 'Administrator with full system access');
