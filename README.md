# Team Task Manager 🚀

Welcome to the **Team Task Manager** documentation! This is a complete, full-stack workflow and project management application built with the **MERN** stack (MongoDB, Express.js, React.js, and Node.js).

This documentation covers everything you need to know about the project, including its features, internal structure, environment configuration, and detailed API documentation.

---

## 🌟 Comprehensive Feature List

1. **Authentication & Security**
   - **JWT-Based Auth**: Secure login and signup mechanics using JSON Web Tokens.
   - **Password Strategy**: Passwords are securely hashed before being stored in the database.
   - **Token Refresh**: Ability to refresh expired sessions securely.

2. **Role-Based Access Control (RBAC)**
   - **Admin**: Has full privileges. Can manage all projects, view all users in the system, and upgrade/downgrade roles (Make other users Admin).
   - **Team Member**: Can be added to projects, view project details, and manage tasks assigned to them.
   - **Project Manager level details**: Certain actions on projects (like editing descriptions) require you to be explicitly assigned or be an Admin.

3. **Dynamic Dashboard**
   - A real-time statistical view of your workflow.
   - Shows aggregated counts of tasks organized by status: **To Do**, **In Progress**, **Done**, and **Overdue**.

4. **Project Management**
   - Isolate work into specific Projects.
   - Add detailed descriptions.
   - Invite users to collaborate by adding them to the Project Team.

5. **Task Tracking**
   - Create granular tasks within projects.
   - Assign tasks to specific team members.
   - Track deadlines and current progress statuses.

6. **UI / UX Features**
   - **Light / Dark Mode**: Built-in seamless toggling.
   - Fully responsive design using Bootstrap 5.

---

## 🏗️ Detailed Architecture & Directory Structure

This project uses a monorepo setup with a completely separated frontend and backend.

### 🌐 Frontend (`client/`)

Built with **React 18** and **Vite**. It acts as a Single Page Application (SPA).

- `src/api/`: Contains Axios interceptors and functions mapped to backend endpoints. Ex: `authApi.js` handles login/logout requests.
- `src/components/`: Reusable interface elements. Includes navigation (`Navbar.jsx`) and visual metrics (`StatsCard.jsx`).
- `src/context/`: Global State Management.
  - `AuthContext.jsx`: Keeps track of the currently logged-in user and token states.
  - `ThemeContext.jsx`: Manages the user's preference for Light/Dark mode.
- `src/pages/`: Dedicated React components representing full views/pages (Dashboard, AdminUsers, ProjectDetail, etc.).
- `src/routes/`: Contains logic for protected routes (`ProtectedRoute.jsx`), preventing unauthorized access to internal pages.
- `src/styles/`: Global stylesheets containing CSS variables and theme rules.

### ⚙️ Backend (`server/`)

Built with **Node.js** and **Express.js**. A RESTful API that handles data, logic, and security.

- `src/config/`: Database connection logic (`db.js`) and environment parser (`env.js`).
- `src/models/`: Mongoose schemas defining how data looks in MongoDB.
  - `User.js`: Tracks username, email, password, role.
  - `Project.js`: Tracks project name, description, owner, and team members.
  - `Task.js`: Tracks task title, status, project reference, assignee, and due dates.
- `src/controllers/`: The actual logic and brain of the App. Evaluates incoming request parameters and outputs JSON responses.
- `src/routes/`: Router files tying URLs (like `/api/auth`) to their specific controller methods.
- `src/middleware/`: Security walls.
  - `auth.js`: Verifies the JWT token on a request.
  - `requireRole.js`: Blocks standard members from accessing Admin routes.
  - `projectAccess.js` / `taskAccess.js`: Verifies a user actually belongs to the project they are trying to view/edit.
- `src/validators/`: Uses `express-validator` to ensure users don't send blank, malicious, or poorly formatted data.
- `src/utils/`: Helper functions like error catchers (`asyncHandler.js`), password hashers (`passwords.js`), and token generators (`tokens.js`).
- `src/seed/`: A helpful script to pre-fill an empty database with sample data.

---

## ⚙️ Environment Variables Setup

Before running the application, you must define the following Environment variables.

### 1. Backend variables (`server/.env`)

Create a file named `.env` inside the `/server` folder:

```properties
# The port the Express server will run on (Default usually 4000)
PORT=4000

# MongoDB connection string (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/team_task_manager

# JWT secrets (use long random strings in production)
JWT_ACCESS_SECRET=replace_me_access_secret
JWT_REFRESH_SECRET=replace_me_refresh_secret

# Token expiration settings
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Allowed frontend origin(s) for CORS.
# You can set a single origin OR a comma-separated list.
# Local example:
# CLIENT_ORIGIN=http://localhost:5173
# Production example (Vercel + Railway):
# CLIENT_ORIGIN=https://your-frontend.vercel.app
# Multiple:
# CLIENT_ORIGIN=http://localhost:5173,https://your-frontend.vercel.app
CLIENT_ORIGIN=http://localhost:5173
```

### 2. Frontend variables (`client/.env`)

Create a file named `.env` inside the `/client` folder:

```properties
# Points the React frontend to our Node.js backend URL
VITE_API_URL=http://localhost:4000/api
```

---

## 🔌 Complete API Documentation

Base URL for all backend requests: `http://localhost:4000/api`

### 1. Authentication (`/api/auth`)

- `POST /api/auth/signup`
  - **Desc**: Creates a new user.
  - **Body**: `{ name, email, password }`
- `POST /api/auth/login`
  - **Desc**: Authenticates a user and returns a token.
  - **Body**: `{ email, password }`
- `POST /api/auth/refresh`
  - **Desc**: Issues a new auth token to keep the user logged in.
- `POST /api/auth/logout`
  - **Desc**: Destroys the current secure session/cookie.
- `GET /api/auth/me`
  - **Desc**: Retrieves the profile details of the current logged-in user. (Headers: `Authorization: Bearer <token>`)

### 2. Dashboard (`/api/dashboard`)

- `GET /api/dashboard`
  - **Desc**: Returns an aggregated set of task counts for the dashboard overview.
  - **Returns**: `{ toDo: 5, inProgress: 2, done: 10, overdue: 1 }`

### 3. Projects (`/api/projects`)

- `GET /api/projects`
  - **Desc**: Gets an array of all projects the user is authorized to see.
- `POST /api/projects`
  - **Desc**: Creates a new project structure.
  - **Body**: `{ title, description }`
- `GET /api/projects/:projectId`
  - **Desc**: Returns full details of a single project, populating member details.
- `PATCH /api/projects/:projectId`
  - **Desc**: Modifies project metadata. (Admin/Manager only)
- `POST /api/projects/:projectId/members`
  - **Desc**: Adds an existing user to the project team.
  - **Body**: `{ userId }`
- `DELETE /api/projects/:projectId/members/:userId`
  - **Desc**: Kicks a user out of a project.

### 4. Tasks (`/api/tasks`)

- `GET /api/tasks/projects/:projectId`
  - **Desc**: Fetches all tasks strictly belonging to the given project.
- `POST /api/tasks/projects/:projectId`
  - **Desc**: Creates a task under that project.
  - **Body**: `{ title, description, status, assignedTo, dueDate }`
- `PATCH /api/tasks/:taskId`
  - **Desc**: Updates a task (e.g., shifts status from "To Do" to "Done").

### 5. Users Management (`/api/users`) - _ADMIN ONLY_

- `GET /api/users`
  - **Desc**: Returns all registered users on the system platform.
- `PATCH /api/users/:userId/role`
  - **Desc**: Elevates a normal member to Admin, or demotes an Admin.
  - **Body**: `{ role: "admin" | "member" }`

---

## 🚀 Installation & Local Deployment Guide

Follow these sequential steps to run the platform locally on your machine.

**1. Clone the repository and install dependencies**

```bash
git clone <repository_url>
cd TeamTaskManager
npm install  # This installs dependencies for BOTH client and server
```

**2. Configure Environment Setup**
Set up your `.env` files in `server/` and `client/` as detailed in the "Environment Variables Setup" section above.

**3. Seed the Database with Dummy Data**
Instead of starting from zero, you can generate temporary projects, tasks, and an admin user.

```bash
npm run seed -w server
```

**4. Start the Application**
Run the backend and frontend simultaneously with one command from the root folder:

```bash
npm run dev
```

Your React app will normally be opened at `http://localhost:5173` and it will securely communicate with your backend at `http://localhost:4000`.

---

## 🚆 Deploy on Railway (Deploy the `add` branch)

This repo is a monorepo (`client/` + `server/`). On Railway, the cleanest setup is **2 services**:

- **Backend Service** (Express API) from `server/`
- **Frontend Service** (Vite preview hosting) from `client/`

### Step 0 — Make sure you deploy the correct branch

1. Open the GitHub repo.
2. Confirm branch is **`add`**.
3. In Railway, choose **branch: `add`** while creating the service.

### Step 1 — Deploy Backend (server)

1. Railway → **New Project** → **Deploy from GitHub Repo**
2. Select repo: `swayam03275/TaskManager`
3. Select **Branch**: `add`
4. Service settings:

- **Root Directory**: `server`
- **Start Command**: use package script `npm start` (Railway auto-detects) OR explicitly `npm run start`

#### Backend Variables (Railway → Service → Variables)

Add these variables (same names as `server/src/config/env.js` and `server/.env.example`):

```properties
NODE_ENV=production

MONGODB_URI=<your MongoDB connection string>

JWT_ACCESS_SECRET=<long random string>
JWT_REFRESH_SECRET=<long random string>

JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# IMPORTANT:
# Set this to your FRONTEND URL (after frontend deploy, update it).
# You can also give multiple origins separated by commas.
CLIENT_ORIGIN=http://localhost:5173
```

#### Backend verification

After deploy completes, open the backend URL and test:

- `GET /health` → should return `{ "status": "ok" }`

### Step 2 — Deploy Frontend (client)

1. In the same Railway project → **New Service** → **Deploy from GitHub Repo**
2. Select repo: `swayam03275/TaskManager`
3. Select **Branch**: `add`
4. Service settings:

- **Root Directory**: `client`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`

#### Frontend Variables

```properties
# Use your Railway backend public URL here.
VITE_API_URL=https://<your-backend-service>.up.railway.app/api
```

### Step 3 — Fix CORS for production (must-do)

Once the frontend is deployed, copy its Railway URL and update the backend variable:

```properties
CLIENT_ORIGIN=https://<your-frontend-service>.up.railway.app
```

Then redeploy the backend service.

### Common issues (quick fixes)

- **CORS error**: `CLIENT_ORIGIN` must match the exact frontend domain.
- **Login works but refresh fails**: Ensure `NODE_ENV=production` is set on backend.
- **Mongo error**: Check `MONGODB_URI` is correct and IP access allowed (Atlas Network Access).
