# 🚀 TaskPulse — MERN Task Management Application

> A modern, full-stack task management platform with Kanban workflow, drag-and-drop task organization, project-based collaboration, role-based access control, and intelligent workload monitoring.

**TaskPulse** is a production-style task management application built using the **MERN stack** — MongoDB, Express.js, React.js, and Node.js.

It provides teams with a centralized workspace to create, assign, organize, track, and manage tasks through an interactive **Kanban board**.

The application's key differentiating feature is **Workload Balancing**, which automatically detects when a team member has more than **5 tasks in progress** and visually warns the team using a pulsing red avatar indicator.

---

## ✨ Features

### 📋 Interactive Kanban Board

Manage tasks using three workflow stages:

* 📝 **To-Do**
* 🔄 **In Progress**
* ✅ **Done**

Features include:

* Drag-and-drop task movement
* Persistent task status updates
* Dynamic task counters
* Optimistic UI updates
* Automatic synchronization with MongoDB

Example:

```text
┌─────────────────┐
│ TO-DO       4   │
├─────────────────┤
│ Design Login    │
│ Create API      │
│ Fix Navbar      │
│ Write Tests     │
└─────────────────┘

┌─────────────────┐
│ IN PROGRESS  7  │
├─────────────────┤
│ Build Dashboard │
│ Database Setup  │
│ Authentication  │
└─────────────────┘

┌─────────────────┐
│ DONE        12  │
└─────────────────┘
```

---

## 🔥 Workload Balancing

TaskPulse includes an automated workload monitoring system designed to highlight potentially overloaded team members.

For every project member, the system calculates:

```text
In Progress Tasks =
Tasks assigned to user
AND
Task status = "in-progress"
```

### ⚠️ Overload Threshold

If:

```text
In Progress Tasks > 5
```

the user is considered overloaded.

Their avatar automatically:

* 🔴 Pulses with a red warning glow
* ⚠️ Displays an overload indicator
* 📊 Shows the number of In Progress tasks
* 🔄 Updates dynamically whenever task assignments or statuses change

Example:

```text
TEAM

👤 Vaishnavi
   2 In Progress

🔴 Rahul
   ⚠ 7 In Progress

👤 Priya
   4 In Progress
```

The workload calculation is updated when tasks are:

* Created
* Deleted
* Reassigned
* Moved into In Progress
* Moved out of In Progress

---

## 🎯 Priority Management

Every task can have one of three priorities:

* 🟢 **Low**
* 🟡 **Medium**
* 🔴 **High**

Users can instantly filter tasks by:

```text
All | Low | Medium | High
```

The Kanban counters dynamically update according to the currently visible tasks.

---

## 👥 Team & Project Management

TaskPulse supports multiple projects and team collaboration.

### Project Features

* Create projects
* View projects
* Switch between projects
* Add team members
* Remove team members
* Manage project membership
* Assign tasks to project members

### Permission System

Project owners can:

* Add members
* Remove members
* Update project settings
* Delete projects
* Manage project resources

Project members can:

* View projects
* Create tasks
* Edit tasks
* Move tasks
* Manage assigned tasks

Unauthorized users are prevented from accessing projects through backend authorization checks.

---

## ✅ Task Management

Each task contains:

| Property    | Description                 |
| ----------- | --------------------------- |
| Title       | Task name                   |
| Description | Detailed task information   |
| Priority    | Low, Medium, or High        |
| Status      | To-Do, In Progress, or Done |
| Due Date    | Task deadline               |
| Assignee    | Team member responsible     |
| Project     | Associated project          |
| Created By  | User who created the task   |

### Task Operations

* Create
* View
* Edit
* Delete
* Assign
* Reassign
* Change priority
* Change due date
* Change status

Task deletion includes a confirmation dialog to prevent accidental deletion.

---

# 🛠️ Tech Stack

## Frontend

* **React 18**
* **Vite 5**
* **React Router DOM 6**
* **Axios**
* **Lucide React**
* **Vanilla CSS**
* React Context API

## Backend

* **Node.js**
* **Express.js 4**
* **MongoDB**
* **Mongoose 8**
* **JSON Web Token (JWT)**
* **bcryptjs**
* **CORS**
* **dotenv**

The frontend and backend are maintained as separate applications and communicate through REST APIs.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │      Frontend        │
                    │                      │
                    │  Kanban Board        │
                    │  Task Cards          │
                    │  Team Management     │
                    │  Workload UI         │
                    └──────────┬───────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │       Backend        │
                    │                      │
                    │ Authentication       │
                    │ Authorization        │
                    │ Task CRUD             │
                    │ Project Management   │
                    │ Workload Aggregation │
                    └──────────┬───────────┘
                               │
                           Mongoose
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │                      │
                    │ Users                │
                    │ Projects             │
                    │ Tasks                │
                    └──────────────────────┘
```

---

# 📁 Project Structure

```text
task-management-app/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── KanbanColumn.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── CreateTaskModal.jsx
│   │   │   ├── EditTaskModal.jsx
│   │   │   ├── AddUserModal.jsx
│   │   │   ├── CreateProjectModal.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── TeamList.jsx
│   │   │   ├── TeamMember.jsx
│   │   │   ├── PriorityFilter.jsx
│   │   │   ├── ProjectSelector.jsx
│   │   │   ├── WorkloadIndicator.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ProjectPage.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── projectService.js
│   │   │   ├── taskService.js
│   │   │   └── userService.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ProjectContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   │
│   │   ├── utils/
│   │   │   └── constants.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── .env.example
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── projectPermissionMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

# 🔐 Authentication & Security

TaskPulse uses JWT-based authentication.

### Registration

```text
User
 ↓
Registration Form
 ↓
Express API
 ↓
Validate Input
 ↓
Hash Password using bcryptjs
 ↓
Store User in MongoDB
 ↓
Generate JWT
 ↓
Authenticated Session
```

### Login

```text
Email + Password
       ↓
Express API
       ↓
Find User
       ↓
Verify bcrypt Hash
       ↓
Generate JWT
       ↓
Return Authentication Data
```

Passwords are hashed using **bcryptjs with 10 salt rounds**, and password fields are excluded from API responses.

Protected routes require a valid Bearer token.

---

# 🗄️ Database Models

## User

```javascript
{
  name: String,
  email: String,
  password: String,
  avatar: String,
  createdAt: Date
}
```

## Project

```javascript
{
  name: String,
  description: String,
  owner: ObjectId,
  members: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## Task

```javascript
{
  title: String,
  description: String,
  priority: String,
  status: String,
  dueDate: Date,
  project: ObjectId,
  assignedTo: ObjectId,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

# 📡 REST API

## Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/me`       | Get current user |

## Users

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/users`     | List/search users |
| GET    | `/api/users/:id` | Get user          |

## Projects

| Method | Endpoint                            | Description         |
| ------ | ----------------------------------- | ------------------- |
| POST   | `/api/projects`                     | Create project      |
| GET    | `/api/projects`                     | Get user's projects |
| GET    | `/api/projects/:id`                 | Get project         |
| PUT    | `/api/projects/:id`                 | Update project      |
| DELETE | `/api/projects/:id`                 | Delete project      |
| POST   | `/api/projects/:id/members`         | Add member          |
| DELETE | `/api/projects/:id/members/:userId` | Remove member       |
| GET    | `/api/projects/:projectId/workload` | Get workload data   |

## Tasks

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| POST   | `/api/tasks`            | Create task        |
| GET    | `/api/tasks`            | Get project tasks  |
| GET    | `/api/tasks/:id`        | Get task           |
| PUT    | `/api/tasks/:id`        | Update task        |
| DELETE | `/api/tasks/:id`        | Delete task        |
| PATCH  | `/api/tasks/:id/status` | Update task status |
| PATCH  | `/api/tasks/:id/assign` | Reassign task      |

The status endpoint is used by the Kanban drag-and-drop functionality, while the workload endpoint returns the calculated `inProgressCount`, total task count, and overload status.

---

# ⚙️ Environment Variables

## Backend

Create:

```text
backend/.env
```

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=your_secure_jwt_secret
```

## Frontend

Create:

```text
frontend/.env
```

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

> Never commit real `.env` files or production secrets to GitHub.

The repository includes `.env.example` files to document the required configuration.

---

# 🚀 Installation & Setup

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB
* Git

The project supports modern Node.js versions; the documented implementation uses Node.js 22+.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/task-management-app.git
```

```bash
cd task-management-app
```

---

## 2️⃣ Setup Backend

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure your `.env` file.

Then seed the database:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://127.0.0.1:5000
```

---

## 3️⃣ Setup Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure:

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Demo Accounts

The database seed script creates demo users for testing.

All demo accounts use:

```text
Password: password123
```

| User         | Email                   | Role          | In Progress |
| ------------ | ----------------------- | ------------- | ----------: |
| Vaishnavi    | `vaishnavi@example.com` | Project Owner |           2 |
| Rahul        | `rahul@example.com`     | Team Member   |    **7 ⚠️** |
| Priya        | `priya@example.com`     | Team Member   |           4 |
| Alex Johnson | `alex@example.com`      | Team Member   |           1 |

Rahul is intentionally seeded with **7 In Progress tasks** to demonstrate the Workload Balancing feature.

The login page also provides quick-login options for the demo accounts.

---

# 🧠 Workload Balancing Logic

The core workload calculation follows:

```javascript
inProgressCount =
    number of tasks assigned to user
    where status === "in-progress";
```

Then:

```javascript
if (inProgressCount > 5) {
    overloaded = true;
} else {
    overloaded = false;
}
```

### Example

```text
Rahul

Task 1 → In Progress
Task 2 → In Progress
Task 3 → In Progress
Task 4 → In Progress
Task 5 → In Progress
Task 6 → In Progress
Task 7 → In Progress

inProgressCount = 7

7 > 5
    ↓
OVERLOADED
    ↓
🔴 Pulsing Avatar
```

If Rahul completes two tasks:

```text
7 → 6 → 5
```

At exactly **5 tasks**, the warning disappears because:

```text
5 > 5 = false
```

The threshold behavior and verification scenarios are implemented around this rule.

---

# 🧪 Feature Verification

The application can be tested using the following scenarios:

### Test 1 — Initial Workload

Rahul starts with:

```text
7 In Progress
```

Expected:

```text
🔴 Avatar pulses
⚠ 7 In Progress
```

### Test 2 — Move Task to Done

```text
7 → 6
```

Expected:

```text
🔴 Still overloaded
```

### Test 3 — Reach Threshold

```text
6 → 5
```

Expected:

```text
Normal avatar
No overload warning
```

### Test 4 — Move Back to In Progress

```text
5 → 6
```

Expected:

```text
🔴 Pulse starts again
```

### Test 5 — Reassignment

```text
User A: 6 → 5
User B: 4 → 5
```

Expected:

```text
User A → No overload
User B → No overload
```

### Test 6 — Task Creation/Deletion

Creating or deleting an In Progress task automatically recalculates the affected workload.

---

# 🎨 UI/UX

TaskPulse follows a modern SaaS-style design with:

* Dark/slate visual theme
* Glassmorphism-inspired elements
* Responsive sidebar
* Responsive Kanban layout
* Smooth transitions
* Interactive task cards
* Priority indicators
* Loading states
* Empty states
* Confirmation modals
* Workload warning animations

The frontend uses a custom CSS design system with reusable design variables and workload animation styles.

---

# 📱 Responsive Design

TaskPulse is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

On smaller screens, the navigation and Kanban layout adapt to preserve usability.

---

# 🛡️ Security Considerations

The application implements:

* JWT authentication
* Password hashing
* Protected API routes
* Project-level authorization
* Input validation
* Environment-based configuration
* CORS configuration
* Centralized backend error handling
* Password exclusion from API responses

Never commit:

```text
.env
```

or production credentials to GitHub.

---

# 🔄 Application Flow

```text
              LOGIN / REGISTER
                     │
                     ▼
              JWT Authentication
                     │
                     ▼
                 Dashboard
                     │
                     ▼
              Select Project
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
      Kanban Board           Team Panel
          │                     │
          ▼                     ▼
    Create / Edit /       Workload Calculation
    Delete / Assign             │
          │                     ▼
          ▼              inProgressCount > 5
      Drag & Drop               │
          │                     ▼
          ▼                🔴 Warning Pulse
       MongoDB
```

---

# 📈 Future Enhancements

Potential future improvements include:

* Real-time collaboration using Socket.IO
* Email notifications
* Task comments
* File attachments
* Activity/audit history
* Advanced analytics dashboard
* Calendar view
* Recurring tasks
* Team workload charts
* Dark/light theme switcher
* Search across tasks
* Task labels/tags
* Due-date notifications
* Cloud deployment
* Docker support

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Commit your changes

```bash
git commit -m "Add your feature"
```

### 4. Push the branch

```bash
git push origin feature/your-feature
```

### 5. Open a Pull Request

---

# 🐛 Troubleshooting

### MongoDB connection error

Make sure MongoDB is running and your connection string uses:

```env
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
```

Using `127.0.0.1` can help avoid IPv6 `::1` resolution issues on some Windows setups.

### CORS error

Verify that:

* Backend is running on port `5000`
* Frontend is running on port `5173`
* `VITE_API_URL` points to the backend API

### npm command issue on Windows

If PowerShell blocks `npm.ps1`, you can use:

```bash
npm.cmd install
```

or run the command through:

```bash
cmd.exe /c npm install
```

---

# 📊 Project Highlights

| Area               | Implementation     |
| ------------------ | ------------------ |
| Architecture       | MERN               |
| Frontend           | React + Vite       |
| Backend            | Node + Express     |
| Database           | MongoDB            |
| Authentication     | JWT                |
| Password Security  | bcryptjs           |
| API                | REST               |
| Task Organization  | Kanban             |
| Drag & Drop        | HTML5              |
| Workload Detection | Dynamic            |
| Priority Filter    | Yes                |
| Project Management | Yes                |
| Team Management    | Yes                |
| Authorization      | Role/Project based |
| Responsive UI      | Yes                |

---

# 👩‍💻 Author

**Vaishnavi A Hachadad**

Computer Science & Engineering — AI & ML

Siddaganga Institute of Technology, Tumakuru

---

# ⭐ If You Like This Project

If you found **TaskPulse** useful or interesting, consider giving the repository a ⭐ on GitHub!

---

## 📄 License

This project is intended for educational, portfolio, and demonstration purposes.
