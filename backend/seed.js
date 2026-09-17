const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed]: Connected to MongoDB');

    // Clear existing data
    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed]: Cleared existing database collections');

    // 1. Create Users
    const usersData = [
      {
        name: 'Vaishnavi',
        email: 'vaishnavi@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Vaishnavi&backgroundColor=4f46e5',
      },
      {
        name: 'Rahul',
        email: 'rahul@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rahul&backgroundColor=ef4444',
      },
      {
        name: 'Priya',
        email: 'priya@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya&backgroundColor=10b981',
      },
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex&backgroundColor=8b5cf6',
      },
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const created = await User.create(u);
      createdUsers.push(created);
    }
    console.log(`[Seed]: Created ${createdUsers.length} users`);

    const [vaishnavi, rahul, priya, alex] = createdUsers;

    // 2. Create Projects
    const mainProject = await Project.create({
      name: 'Website Redesign & Launch',
      description: 'Production overhaul of company web app, user dashboard, and checkout flow.',
      owner: vaishnavi._id,
      members: [vaishnavi._id, rahul._id, priya._id, alex._id],
    });

    const mobileProject = await Project.create({
      name: 'Mobile App MVP',
      description: 'Cross-platform mobile application development using React Native.',
      owner: vaishnavi._id,
      members: [vaishnavi._id, rahul._id],
    });

    console.log(`[Seed]: Created 2 projects (Main ID: ${mainProject._id})`);

    // 3. Create Tasks for "Website Redesign & Launch"
    // Requirement Scenario:
    // User A (Vaishnavi): 2 In Progress tasks
    // User B (Priya): 4 In Progress tasks
    // User C (Rahul): 7 In Progress tasks -> CRITICAL OVERLOAD SCENARIO (> 5 tasks in-progress)
    // Plus various To-Do and Done tasks across different priorities

    const sampleTasks = [
      // === RAHUL (7 IN PROGRESS - OVERLOADED!) ===
      {
        title: 'Refactor Authentication Pipeline',
        description: 'Migrate session storage to secure JWT and refresh token cookies.',
        priority: 'High',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 2),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Optimize MongoDB Aggregations',
        description: 'Profile slow queries and add compound indexes for project workloads.',
        priority: 'High',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 3),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Implement Payment Gateway Webhook',
        description: 'Listen to Stripe webhook events for successful subscription activations.',
        priority: 'High',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 4),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Fix Safari WebSocket Connection Glitch',
        description: 'Resolve disconnects on mobile Safari during tab inactivity.',
        priority: 'Medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 5),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Build User Profile Settings Form',
        description: 'Allow changing display name, bio, and notification preferences.',
        priority: 'Medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 6),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Configure Sentry Error Logging',
        description: 'Add error boundary captures and server error notifications.',
        priority: 'Medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 7),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Implement Dark Theme Color Palette',
        description: 'Fine-tune CSS variables for seamless dark mode switching.',
        priority: 'Low',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 8),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },
      // Rahul additional tasks in other statuses
      {
        title: 'Review PR for GraphQL Endpoints',
        description: 'Code review for incoming developer submissions.',
        priority: 'Low',
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000 * 10),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Database Schema Migration Documentation',
        description: 'Document migration scripts for v2 release.',
        priority: 'Medium',
        status: 'done',
        dueDate: new Date(Date.now() - 86400000 * 2),
        project: mainProject._id,
        assignedTo: rahul._id,
        createdBy: vaishnavi._id,
      },

      // === VAISHNAVI (2 IN PROGRESS) ===
      {
        title: 'Design System Typography & Tokens',
        description: 'Update Inter font scale and color palette for SaaS dashboard.',
        priority: 'High',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 3),
        project: mainProject._id,
        assignedTo: vaishnavi._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Drag and Drop Interaction Polish',
        description: 'Smooth spring animations and drop zone highlights on Kanban board.',
        priority: 'Medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 4),
        project: mainProject._id,
        assignedTo: vaishnavi._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Product Roadmap Alignment Meeting',
        description: 'Coordinate Q4 deliverables with executive stakeholders.',
        priority: 'High',
        status: 'done',
        dueDate: new Date(Date.now() - 86400000 * 3),
        project: mainProject._id,
        assignedTo: vaishnavi._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Draft User Onboarding Flow',
        description: 'Wireframe 3-step walkthrough for first-time signups.',
        priority: 'Low',
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000 * 7),
        project: mainProject._id,
        assignedTo: vaishnavi._id,
        createdBy: vaishnavi._id,
      },

      // === PRIYA (4 IN PROGRESS) ===
      {
        title: 'Automated E2E Test Suite',
        description: 'Configure Playwright tests for auth and task creation flows.',
        priority: 'High',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 3),
        project: mainProject._id,
        assignedTo: priya._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'API Rate Limiting & Security Headers',
        description: 'Setup Helmet.js and express-rate-limit protection on auth endpoints.',
        priority: 'High',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 5),
        project: mainProject._id,
        assignedTo: priya._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Email Notification Service',
        description: 'Integrate SendGrid templates for task assignment alerts.',
        priority: 'Medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 6),
        project: mainProject._id,
        assignedTo: priya._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'CSV Export Feature for Completed Tasks',
        description: 'Export monthly task metrics to downloadable CSV file.',
        priority: 'Low',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 8),
        project: mainProject._id,
        assignedTo: priya._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Benchmark Docker Container Build Speed',
        description: 'Multi-stage Docker builds to reduce image footprint.',
        priority: 'Medium',
        status: 'done',
        dueDate: new Date(Date.now() - 86400000 * 1),
        project: mainProject._id,
        assignedTo: priya._id,
        createdBy: vaishnavi._id,
      },

      // === ALEX (1 IN PROGRESS, 2 TODO, 2 DONE) ===
      {
        title: 'Landing Page Hero Graphics',
        description: 'Create high-resolution vector illustrations for the home banner.',
        priority: 'Medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000 * 4),
        project: mainProject._id,
        assignedTo: alex._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Customer Feedback Survey Component',
        description: 'NPS rating widget embedded in project header.',
        priority: 'Low',
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000 * 9),
        project: mainProject._id,
        assignedTo: alex._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'SEO Meta Tags and OpenGraph Images',
        description: 'Audit social preview tags across all marketing pages.',
        priority: 'Medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000 * 11),
        project: mainProject._id,
        assignedTo: alex._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Setup Brand Assets CDN',
        description: 'Deploy logos, brand fonts, and media to Cloudflare R2.',
        priority: 'Low',
        status: 'done',
        dueDate: new Date(Date.now() - 86400000 * 4),
        project: mainProject._id,
        assignedTo: alex._id,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Color Accessibility Audit (WCAG AA)',
        description: 'Verify color contrast on all badges and button states.',
        priority: 'High',
        status: 'done',
        dueDate: new Date(Date.now() - 86400000 * 5),
        project: mainProject._id,
        assignedTo: alex._id,
        createdBy: vaishnavi._id,
      },

      // === UNASSIGNED TASKS (TO-DO) ===
      {
        title: 'Investigate Redis Caching for Project Feed',
        description: 'Benchmark Redis cluster latency vs direct Mongo read queries.',
        priority: 'Medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000 * 12),
        project: mainProject._id,
        assignedTo: null,
        createdBy: vaishnavi._id,
      },
      {
        title: 'Terms of Service & Privacy Policy Updates',
        description: 'Legal compliance review for GDPR and CCPA requirements.',
        priority: 'Low',
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000 * 14),
        project: mainProject._id,
        assignedTo: null,
        createdBy: vaishnavi._id,
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log(`[Seed]: Created ${sampleTasks.length} tasks for project`);

    console.log('\n=============================================');
    console.log(' DATABASE SEEDED SUCCESSFULLY! ');
    console.log('=============================================');
    console.log('Sample Users created:');
    console.log(' 1. Vaishnavi (Owner)  : vaishnavi@example.com / password123 (In Progress: 2)');
    console.log(' 2. Rahul (OVERLOADED!): rahul@example.com     / password123 (In Progress: 7 - PULSES RED)');
    console.log(' 3. Priya              : priya@example.com     / password123 (In Progress: 4)');
    console.log(' 4. Alex Johnson       : alex@example.com      / password123 (In Progress: 1)');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
