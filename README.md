# TaskPulse — Production MERN Task Management Application

A full-stack, responsive, production-quality Task Management Application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) featuring a 3-column Kanban board, live Drag & Drop with database persistence, project membership & permission controls, and an **Automated Workload Balancing Engine** that dynamically detects overloaded team members.

---

## 🌟 Key Features

- **Interactive Kanban Board**:
  - Three distinct status columns: **TO-DO**, **IN PROGRESS**, and **DONE**.
  - Dynamic task count badges for every column (e.g. `TO-DO (4)`, `IN PROGRESS (7)`, `DONE (12)`).
  - Native HTML5 Drag and Drop with instant optimistic UI update and MongoDB persistence via `PATCH /api/tasks/:id/status`.
- **Special Feature — Dynamic Workload Balancing**:
  - Automatically calculates `inProgressCount` for each project team member directly from MongoDB.
  - If **ANY** user has **more than 5 tasks** assigned to them in the **"In Progress"** state:
    - Their avatar in the team panel **pulses continuously** with a vivid red warning glow (`@keyframes workloadPulse`).
    - An alert badge `⚠ X In Progress` is displayed next to their name.
    - An overload warning banner alerts the team.
  - Recalculates dynamically whenever tasks are moved, reassigned, created, or deleted.
- **Priority Filtering**:
  - Instant live filtering by `All`, `Low`, `Medium`, and `High` without page reload.
  - Column counter badges dynamically update to reflect the currently visible filtered tasks.
- **Project Management & Access Control**:
  - Multi-project support with Project Switcher and Dashboard overview.
  - Role-based permissions: Project Owners can add/remove members and manage project settings; members can view, create, edit, and move tasks.
  - Non-members are strictly forbidden with HTTP 403.
- **Full Task CRUD**:
  - Create, view, edit, and delete tasks with titles, descriptions, priorities, due dates, and assignee selection.
  - Confirmation modals for safe deletions.
- **Secure Authentication**:
  - JWT (JSON Web Tokens) authentication with Bearer tokens stored in localStorage.
  - Passwords hashed using `bcryptjs` with 10 salt rounds. Passwords are never returned in JSON responses.
- **Production UI/UX**:
  - Modern SaaS aesthetic with custom dark/slate palette, glassmorphism accents, smooth micro-interactions, responsive drawer sidebar, and empty/loading states.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - Vite 5
  - React Router DOM 6
  - Axios (with request/response interceptors)
  - Lucide React (clean SaaS iconography)
  - Pure Vanilla CSS design system with CSS custom variables
- **Backend**:
  - Node.js (v22+)
  - Express.js 4
  - MongoDB & Mongoose 8
  - JSON Web Tokens (`jsonwebtoken`)
  - Password Hashing (`bcryptjs`)
  - CORS & Dotenv

---

## 📁 Folder Structure

```
task-management-app/
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation bar with user profile & quick action
│   │   │   ├── Sidebar.jsx              # Navigation drawer & projects switcher
│   │   │   ├── KanbanBoard.jsx          # 3-column Kanban container
│   │   │   ├── KanbanColumn.jsx         # Column with drop-target handling & task counters
│   │   │   ├── TaskCard.jsx             # Draggable task card with priority badge & assignee
│   │   │   ├── CreateTaskModal.jsx      # Task creation modal with validation
│   │   │   ├── EditTaskModal.jsx        # Task update modal
│   │   │   ├── AddUserModal.jsx         # Invite member modal
│   │   │   ├── CreateProjectModal.jsx   # New project creation modal
│   │   │   ├── DeleteConfirmModal.jsx   # Deletion confirmation dialog
│   │   │   ├── TeamList.jsx             # Team workload sidebar panel
│   │   │   ├── TeamMember.jsx           # Member avatar with pulsing red overload effect
│   │   │   ├── PriorityFilter.jsx       # Filter pills (All, Low, Medium, High)
│   │   │   ├── ProjectSelector.jsx      # Active project selector
│   │   │   ├── WorkloadIndicator.jsx    # Workload health summary badge
│   │   │   └── LoadingSpinner.jsx       # SaaS loading spinner
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Login page with demo account quick-fill buttons
│   │   │   ├── Register.jsx             # Registration page
│   │   │   ├── Dashboard.jsx            # Project overview & workspace metrics
│   │   │   └── ProjectPage.jsx          # Main Kanban board & team workload view
│   │   ├── services/
│   │   │   ├── api.js                   # Axios client with auth interceptor
│   │   │   ├── authService.js           # Authentication API calls
│   │   │   ├── projectService.js        # Project and workload API calls
│   │   │   ├── taskService.js           # Task CRUD & patch API calls
│   │   │   └── userService.js           # Users search API calls
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Authentication state provider
│   │   │   └── ProjectContext.jsx       # Projects state provider
│   │   ├── hooks/
│   │   │   └── useTasks.js              # Hook managing tasks, drag & drop, and workload
│   │   ├── utils/
│   │   │   └── constants.js             # Priorities, statuses, threshold constants
│   │   ├── App.jsx                      # App routing with Protected & Guest routes
│   │   ├── main.jsx                     # Vite React root mount
│   │   └── index.css                    # Design tokens & workloadPulse keyframes
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env
│   └── .env.example
│
├── backend/
│   ├── config/
│   │   └── db.js                        # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js            # Register, Login, GetMe
│   │   ├── userController.js            # User listing & search
│   │   ├── projectController.js         # Project CRUD, Members, Workload aggregation
│   │   └── taskController.js            # Task CRUD, Status patch, Assign patch
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT verification & req.user attachment
│   │   ├── errorMiddleware.js           # Centralized JSON error handling
│   │   └── projectPermissionMiddleware.js# Project access authorization
│   ├── models/
│   │   ├── User.js                      # User schema with bcrypt pre-save hook
│   │   ├── Project.js                   # Project schema (owner, members refs)
│   │   └── Task.js                      # Task schema (title, priority, status, assignee)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js             # JWT token signer
│   ├── seed.js                          # Database seeder with overloaded user scenario
│   ├── server.js                        # Express server entry point
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=super_secret_jwt_key_task_manager_2026_secure
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://127.0.0.1:5000/api
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js (v18 or v20 or v22+)
- MongoDB running locally on port 27017 (e.g. `mongodb://127.0.0.1:27017`)

### 1. Backend Setup
In your first terminal:
```bash
cd backend
npm install
npm run seed       # Seeds demo projects, tasks, and overloaded user scenario
npm run dev        # Starts Express server on http://127.0.0.1:5000
```

### 2. Frontend Setup
In your second terminal:
```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Open your browser to: **`http://localhost:5173`**

---

## 🔑 Demo Login Credentials

The seed script automatically provisions the following demo accounts (all with password: `password123`):

| User | Email | Role | Initial In-Progress Tasks | Status / Visual Behavior |
|---|---|---|:---:|---|
| **Vaishnavi** | `vaishnavi@example.com` | Project Owner | 2 | Normal Avatar |
| **Rahul** | `rahul@example.com` | Team Member | **7** | **OVERLOADED! Pulses Red continuously with `⚠ 7 In Progress`** |
| **Priya** | `priya@example.com` | Team Member | 4 | Normal Avatar |
| **Alex Johnson** | `alex@example.com` | Team Member | 1 | Normal Avatar |

> **Tip**: The login page contains 1-click **Quick-Login Demo Accounts** buttons to instantly log into any of the above personas without typing!

---

## ⚡ Workload Balancing Logic & Verification

### The Rule
- For every project member, calculate the number of tasks where `assignedTo == member.id` and `status == "in-progress"`.
- If `inProgressCount > 5`, the user is **Overloaded**:
  - Their avatar applies the `@keyframes workloadPulse` animation.
  - A red warning glow surrounds their avatar.
  - An overload warning pill `⚠ X In Progress` is displayed.
- If `inProgressCount <= 5`, the avatar renders normally.

### Verification Scenarios Tested:
1. **Initial State**: Rahul has 7 In Progress tasks -> Avatar **pulses red**.
2. **Move 1 task to Done (7 → 6)**: In-progress count drops to 6 -> Count is still > 5 -> Avatar **still pulses red**.
3. **Move 2nd task to Done (6 → 5)**: In-progress count drops to 5 -> Count is <= 5 -> Red pulse **disappears immediately**!
4. **Move task back to In Progress (5 → 6)**: In-progress count increments to 6 -> Red pulse **re-triggers immediately**!
5. **Reassignment / Creation / Deletion**: Any change to tasks automatically updates the workload data and re-evaluates the threshold.

---

## 📡 REST API Documentation

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` — Register new user (returns user data and JWT)
- `POST /api/auth/login` — Login user (returns user data and JWT)
- `GET /api/auth/me` — Get profile of authenticated user

### User Routes (`/api/users`)
- `GET /api/users` — List registered users (supports `?search=` query)
- `GET /api/users/:id` — Get user by ID

### Project Routes (`/api/projects`)
- `POST /api/projects` — Create project (user becomes owner & member)
- `GET /api/projects` — Get all projects where user is owner or member
- `GET /api/projects/:id` — Get project details
- `PUT /api/projects/:id` — Update project (Owner only)
- `DELETE /api/projects/:id` — Delete project and its tasks (Owner only)
- `POST /api/projects/:id/members` — Add member to project (Owner only)
- `DELETE /api/projects/:id/members/:userId` — Remove member (Owner only)
- `GET /api/projects/:projectId/workload` — **Workload Aggregation Endpoint** (returns `inProgressCount`, `totalTaskCount`, `overloaded`)

### Task Routes (`/api/tasks`)
- `POST /api/tasks` — Create new task
- `GET /api/tasks?project=:projectId&priority=&status=` — Get tasks for project with filters
- `GET /api/tasks/:id` — Get single task
- `PUT /api/tasks/:id` — Update task details
- `DELETE /api/tasks/:id` — Delete task
- `PATCH /api/tasks/:id/status` — Move task status (**drag & drop endpoint**)
- `PATCH /api/tasks/:id/assign` — Reassign task to user

---

## 🛡️ Database Models

### User
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed with bcrypt
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
}
```

### Project
```javascript
{
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: ObjectId, ref: 'User', required: true },
  members: [{ type: ObjectId, ref: 'User' }],
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  dueDate: Date,
  project: { type: ObjectId, ref: 'Project', required: true },
  assignedTo: { type: ObjectId, ref: 'User' },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💡 Troubleshooting

- **MongoDB Connection**: If MongoDB is running on IPv4, ensure `MONGO_URI=mongodb://127.0.0.1:27017/taskmanager` is used to prevent Windows Node 18+ IPv6 `::1` resolution conflicts.
- **PowerShell Script Policy on Windows**: If `npm` commands report that `npm.ps1 cannot be loaded`, run `npm.cmd <command>` or `cmd.exe /c npm <command>`.
- **CORS Errors**: The backend server is configured with CORS enabled for `*` with credentials support.
#   Q u n a t i p h i  
 