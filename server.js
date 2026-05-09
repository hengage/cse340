import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT ?? 4000;
const publicPath = path.join(__dirname, 'public');
const viewsPath = path.join(__dirname, 'views');

app.use(express.static(publicPath));
app.set('view engine', 'ejs');
app.set('views', viewsPath);

const siteName = 'Service Impact';
const organizations = [
  {
    name: 'Green Valley Alliance',
    description: 'A volunteer-led nonprofit focused on environmental restoration and community education.',
    image: 'environment.svg'
  },
  {
    name: 'Bright Futures Foundation',
    description: 'Programs that support educational opportunities and mentorship for youth.',
    image: 'education.svg'
  },
  {
    name: 'Community Care Network',
    description: 'Local initiatives designed to strengthen families through service and wellness projects.',
    image: 'community.svg'
  }
];

const serviceProjects = [
  {
    name: 'Neighborhood Cleanup',
    summary: 'Organized volunteer days to refresh parks and public spaces with litter removal and landscaping.'
  },
  {
    name: 'After-School Tutoring',
    summary: 'Supporting student success with tutoring, mentoring, and family engagement activities.'
  },
  {
    name: 'Wellness Walks',
    summary: 'Community health events that promote fitness, friendship, and mental wellness.'
  }
];

const categories = [
  'Environmental',
  'Educational',
  'Community Service',
  'Health and Wellness'
];

const renderPage = (res, view, title, data = {}) => {
  res.render(view, { title, siteName, ...data });
};

app.get('/', (req, res) => {
  renderPage(res, 'index', 'Home', { organizations, serviceProjects });
});

app.get('/organizations', (req, res) => {
  renderPage(res, 'organizations', 'Organizations', { organizations });
});

app.get('/projects', (req, res) => {
  renderPage(res, 'projects', 'Projects', { serviceProjects });
});

app.get('/categories', (req, res) => {
  renderPage(res, 'categories', 'Categories', { categories });
});

const startServer = async () => {
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
      resolve(server);
    });

    server.on('error', reject);
  });
};

startServer().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
