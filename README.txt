Team Task Manager 🚀
================================================================================

Welcome to the Team Task Manager documentation! This is a complete, full-stack workflow and project management application built with the MERN stack (MongoDB, Express.js, React.js, and Node.js). 

This documentation covers everything you need to know about the project, including its features, internal structure, environment configuration, and detailed API documentation.

🌟 Comprehensive Feature List
--------------------------------------------------------------------------------
1. Authentication & Security: JWT-Based secure login/signup. Passwords hashed.
2. Role-Based Access Control (RBAC): 
   - Admin: Manages all projects, views all users, upgrades/downgrades roles.
   - Team Member: Interacts with specific projects and tasks.
3. Dynamic Dashboard: Real-time aggregated counts of tasks organized by status (To Do, In Progress, Done, and Overdue).
4. Project Management: Create discrete projects, add detailed descriptions, and invite specific users to collaborate.
5. Task Tracking: Granular tasks assigned to members, trackable by completion statuses.
6. UI / UX Features: Light / Dark Mode toggling and Bootstrap 5 responsive UI.

🏗️ Detailed Architecture & Directory Structure
--------------------------------------------------------------------------------
🌐 Frontend (`client/`) - React 18, Vite SPA
- src/api/ : Axios interceptors mapped to backend endpoints.
- src/components/ : Reusable elements (Navbar, StatsCard).
- src/context/ : Global Contexts (AuthContext for user state, ThemeContext).
- src/pages/ : Main views (Dashboard, AdminUsers, ProjectDetail, etc.).
- src/routes/ : Protected route barriers.
- src/styles/ : CSS files managing theme states.

⚙️ Backend (`server/`) - Node.js, Express.js API
- src/config/ : DB connection (`db.js`) & Env parser.
- src/models/ : Mongoose Schemas (`User.js`, `Project.js`, `Task.js`).
- src/controllers/ : Application logic evaluating requests & responding via JSON.
- src/routes/ : URL routing hitting specific controllers.
- src/middleware/ : Security layers (`auth.js` for JWT, `requireRole.js` for Admin checks).
- src/validators/ : `express-validator` checking incoming user payloads.
- src/utils/ : Helpers (password hashers, token generators).
- src/seed/ : Seed script for populating fresh DB.

⚙️ Environment Variables Setup
--------------------------------------------------------------------------------
1. Backend variables (Create `server/.env`)
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/team_task_manager
   JWT_ACCESS_SECRET=replace_me_access_secret
   JWT_REFRESH_SECRET=replace_me_refresh_secret
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   # Allowed frontend origin(s). Supports comma-separated list.
   CLIENT_ORIGIN=http://localhost:5173

2. Frontend variables (Create `client/.env`)
   VITE_API_URL=http://localhost:4000/api

🔌 Complete API Documentation
--------------------------------------------------------------------------------
Base URL for all backend requests: `http://localhost:4000/api`

1. Authentication (`/api/auth`)
- POST /api/auth/signup : Create a new user account. Body: { name, email, password }
- POST /api/auth/login : Authenticate and return JWT. Body: { email, password }
- POST /api/auth/refresh : Issue new token.
- POST /api/auth/logout : Destroy session.
- GET /api/auth/me : Get profile details of logged-in user.

2. Dashboard (`/api/dashboard`)
- GET /api/dashboard : Returns task statistic aggregation { toDo, inProgress, done, overdue }.

3. Projects (`/api/projects`)
- GET /api/projects : Get array of authorized projects.
- POST /api/projects : Create new project. Body: { title, description }
- GET /api/projects/:projectId : Return full details & member data of single project.
- PATCH /api/projects/:projectId : Modify metadata.
- POST /api/projects/:projectId/members : Add user to project. Body: { userId }
- DELETE /api/projects/:projectId/members/:userId : Remove user from project.

4. Tasks (`/api/tasks`)
- GET /api/tasks/projects/:projectId : Fetch tasks tied to specific project.
- POST /api/tasks/projects/:projectId : Create a task. Body: { title, description, status, assignedTo, dueDate }
- PATCH /api/tasks/:taskId : Update a task.

5. Users Management (/api/users) - *ADMIN ONLY*
- GET /api/users : Return all registered platform users.
- PATCH /api/users/:userId/role : Elevate or demote permissions.

🚀 Installation & Local Deployment Guide
--------------------------------------------------------------------------------
1. Clone the repository and run `npm install`.
2. Configure `.env` files in both `server/` and `client/`.
3. Run `npm run seed -w server` to fill database with testing dummy data.
4. Run `npm run dev` to start Frontend & Backend simultaneously.