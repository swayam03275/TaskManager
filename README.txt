Team Task Manager 🚀
================================================================================

A comprehensive full-stack workflow and project management application built with the MERN stack. Designed to help teams organize projects, manage tasks, and track their pipeline efficiently with role-based access control.

✨ Key Features
--------------------------------------------------------------------------------
- Authentication & Authorization: Secure JWT-based login and signup.
- Role-Based Access Control (RBAC): Distinct privileges for Admins and Team Members.
- Real-time Dashboard: Track project status, task counts (To Do, In Progress, Done, Overdue) at a glance.
- Project Management: Create and manage distinct projects, view details, and monitor overall progress.
- Task Tracking: Add tasks to projects, assign them, and update statuses fluidly.
- Team Management: Admin-only views to overview team members and user details.
- Theming: Built-in Light and Dark mode toggle for better accessibility and user experience.

🛠️ Tech Stack
--------------------------------------------------------------------------------
Frontend (Client):
- Framework: React 18 with Vite
- Styling: Bootstrap 5, Custom CSS Variables (Light/Dark themes)
- Routing: React Router v6
- State Management: React Context API (AuthContext, ThemeContext)
- Network: Axios

Backend (Server):
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB via Mongoose
- Security: Helmet, CORS, bcryptjs, jsonwebtoken
- Validation: express-validator

🚀 Getting Started
--------------------------------------------------------------------------------

Prerequisites:
- Node.js (v20 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas URI)

Installation & Setup:
1. Clone the repository
2. Install dependencies (installs for both client and server via npm workspaces):
   npm install

3. Configure Environment Variables:
   - Copy server/.env.example to server/.env and update variables (PORT, MONGO_URI, JWT_SECRET).
   - Copy client/.env.example to client/.env and set VITE_API_URL.

4. Seed Initial Data (Optional but recommended for testing):
   npm run seed -w server

5. Start the Development Servers:
   npm run dev

📜 Available Scripts
--------------------------------------------------------------------------------
- npm run dev : Start concurrently both the Client (Vite) and the Server (nodemon)
- npm run build : Build the production-ready client application
- npm run start : Start the backend API server
- npm run seed -w server : Seed the database with initial user and task data

🔗 API Endpoints
--------------------------------------------------------------------------------
Base URL: http://localhost:4000/api

Authentication API (/api/auth)
- POST /api/auth/signup : Register a new user account (Public)
- POST /api/auth/login : Authenticate user & receive tokens (Public)
- POST /api/auth/refresh : Refresh expired authentication token (Public)
- POST /api/auth/logout : Clear authentication cookies/tokens (Public)
- GET /api/auth/me : Get the currently authenticated user's details (Authenticated)

Dashboard API (/api/dashboard)
- GET /api/dashboard : Fetch aggregated task metrics (Authenticated)

Projects API (/api/projects)
- GET /api/projects : List all projects accessible by the user (Authenticated)
- POST /api/projects : Create a new project (Authenticated)
- GET /api/projects/:projectId : Get specific project details and its members (Members/Admin)
- PATCH /api/projects/:projectId : Update project details (Managers/Admin)
- POST /api/projects/:projectId/members : Add a new user to the project team (Managers/Admin)
- DELETE /api/projects/:projectId/members/:userId : Remove a user from the project (Managers/Admin)

Tasks API (/api/tasks)
- GET /api/tasks/projects/:projectId : List all tasks for a specific project (Members/Admin)
- POST /api/tasks/projects/:projectId : Create a new task within a project (Members/Admin)
- PATCH /api/tasks/:taskId : Update task status, assignee, or details (Assignee/Managers/Admin)

Users API (/api/users)
- GET /api/users : List all users in the system (Admin only)
- PATCH /api/users/:userId/role : Update user system role (Admin only)