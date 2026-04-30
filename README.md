# Team Task Manager 🚀

A comprehensive full-stack workflow and project management application built with the MERN stack. Designed to help teams organize projects, manage tasks, and track their pipeline efficiently with role-based access control.

## ✨ Key Features

- **🔐 Authentication & Authorization:** Secure JWT-based login and signup.
- **🛡️ Role-Based Access Control (RBAC):** Distinct privileges for Admins and Team Members.
- **📊 Real-time Dashboard:** Track project status, task counts (To Do, In Progress, Done, Overdue) at a glance.
- **📁 Project Management:** Create and manage distinct projects, view details, and monitor overall progress.
- **✅ Task Tracking:** Add tasks to projects, assign them, and update statuses fluidly.
- **👥 Team Management:** Admin-only views to overview team members and user details.
- **🌗 Theming:** Built-in Light and Dark mode toggle for better accessibility and user experience.

## 🛠️ Tech Stack

### Frontend (Client)

- **Framework:** React 18 with Vite
- **Styling:** Bootstrap 5, Custom CSS Variables (Light/Dark themes)
- **Routing:** React Router v6
- **State Management:** React Context API (AuthContext, ThemeContext)
- **Network:** Axios

### Backend (Server)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose
- **Security:** Helmet, CORS, bcryptjs, jsonwebtoken
- **Validation:** express-validator

## 📂 Project Structure

```text
TeamTaskManager/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── api/      # Axios API clients
│   │   ├── components/# Reusable UI elements (Navbar, StatsCard)
│   │   ├── context/  # React Context (Auth, Theme)
│   │   ├── pages/    # Route components (Dashboard, Projects)
│   │   └── styles/   # Global styles and theme definitions
├── server/           # Node.js/Express backend
│   ├── src/
│   │   ├── config/   # DB and environment configuration
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/# Auth, RBAC, and error handling
│   │   ├── models/   # Mongoose schemas (User, Project, Task)
│   │   ├── routes/   # Express routers
│   │   └── validators/# Validation logic
└── package.json      # Monorepo root package & script definitions
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### Installation & Setup

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <your-repository-url>
   cd TeamTaskManager
   ```

2. **Install dependencies** (installs for both client and server via npm workspaces):

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy `server/.env.example` to `server/.env` and update variables (`PORT`, `MONGO_URI`, `JWT_SECRET`).
   - Copy `client/.env.example` to `client/.env` and set `VITE_API_URL`.

4. **Seed Initial Data (Optional but recommended for testing):**

   ```bash
   npm run seed -w server
   ```

5. **Start the Development Servers:**
   Runs both the React frontend and Node API simultaneously:
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

From the root directory, you can run:

- `npm run dev` - Start concurrently both the Client (Vite) and the Server (nodemon)
- `npm run build` - Build the production-ready client application
- `npm run start` - Start the backend API server
- `npm run seed -w server` - Seed the database with initial user and task data

## 🔗 API Endpoints

### 🔐 Authentication API (`/api/auth`)

| Method | Endpoint            | Description                                    | Access        |
| :----- | :------------------ | :--------------------------------------------- | :------------ |
| `POST` | `/api/auth/signup`  | Register a new user account                    | Public        |
| `POST` | `/api/auth/login`   | Authenticate user & receive tokens             | Public        |
| `POST` | `/api/auth/refresh` | Refresh expired authentication token           | Public        |
| `POST` | `/api/auth/logout`  | Clear authentication cookies/tokens            | Public        |
| `GET`  | `/api/auth/me`      | Get the currently authenticated user's details | Authenticated |

### 📊 Dashboard API (`/api/dashboard`)

| Method | Endpoint         | Description                                                       | Access        |
| :----- | :--------------- | :---------------------------------------------------------------- | :------------ |
| `GET`  | `/api/dashboard` | Fetch aggregated task metrics (To Do, In Progress, Done, Overdue) | Authenticated |

### 📁 Projects API (`/api/projects`)

| Method   | Endpoint                                   | Description                                  | Access         |
| :------- | :----------------------------------------- | :------------------------------------------- | :------------- |
| `GET`    | `/api/projects`                            | List all projects accessible by the user     | Authenticated  |
| `POST`   | `/api/projects`                            | Create a new project                         | Authenticated  |
| `GET`    | `/api/projects/:projectId`                 | Get specific project details and its members | Members/Admin  |
| `PATCH`  | `/api/projects/:projectId`                 | Update project details (name, description)   | Managers/Admin |
| `POST`   | `/api/projects/:projectId/members`         | Add a new user to the project team           | Managers/Admin |
| `DELETE` | `/api/projects/:projectId/members/:userId` | Remove a user from the project               | Managers/Admin |

### ✅ Tasks API (`/api/tasks`)

| Method  | Endpoint                         | Description                              | Access                  |
| :------ | :------------------------------- | :--------------------------------------- | :---------------------- |
| `GET`   | `/api/tasks/projects/:projectId` | List all tasks for a specific project    | Members/Admin           |
| `POST`  | `/api/tasks/projects/:projectId` | Create a new task within a project       | Members/Admin           |
| `PATCH` | `/api/tasks/:taskId`             | Update task status, assignee, or details | Assignee/Managers/Admin |

### 👥 Users API (`/api/users`)

| Method  | Endpoint                  | Description                            | Access     |
| :------ | :------------------------ | :------------------------------------- | :--------- |
| `GET`   | `/api/users`              | List all users in the system           | Admin only |
| `PATCH` | `/api/users/:userId/role` | Update user system role (admin/member) | Admin only |
