
---

# TaskPilot – Frontend

TaskPilot is a modern, responsive **task management web application** built using React.
It enables users to securely manage **projects, tasks, teams, tags, and productivity reports** with a clean UI, advanced filtering, and real-time insights.

The frontend integrates with **two backend deployments**:

* **Render** for core application APIs
* **Vercel** for email-based OTP authentication flows

---

## 🚀 Live Demo

```
https://task-pilot-frontend.vercel.app/
```

---

## 📌 Overview

TaskPilot allows users to:

* Create an account using **email OTP verification**
* Log in securely using **JWT authentication**
* Recover passwords using **OTP-based reset**
* Create, update, and manage **projects**
* Create, update, assign, and track **tasks**
* Create and manage **teams**
* Filter and sort tasks across projects and teams
* View productivity and workload **analytics reports**
* Manage data centrally using **Settings**
* Access profile and logout securely
* Use the app seamlessly across **mobile, tablet, and desktop**

---

## 🎯 Key Features

### 🔐 Authentication & Security

* Signup with email OTP verification
* Resend signup OTP with cooldown
* Forgot password with OTP reset
* OTP expiry countdown and resend locking
* Secure JWT-based login
* Protected routes with auto-logout on session expiry

---

### 📝 Task Management

* Add, edit, delete tasks
* Assign tasks to:

  * Projects
  * Teams
  * Owners (users)
* Set:

  * Status (To Do / In Progress / Completed / Blocked)
  * Priority (Low / Medium / High)
  * Time to complete
  * Tags
* Task due date and time-remaining calculation
* Task detail view with full metadata

---

### 📁 Project Management

* Create, edit, and delete projects
* View project-specific tasks
* Filter project tasks by:

  * Status
  * Priority
  * Team
  * Owner
  * Tag
* Sort by due date or priority

---

### 👥 Team Management

* Create, edit, and delete teams
* View team details
* View team-specific tasks
* Filter team tasks by:

  * Status
  * Priority
  * Project
  * Owner
  * Tag
* Sort by due date or priority

---

### 🏷 Filters & Sorting

* Global and context-specific filters
* Multi-level filtering support
* Sorting by:

  * Due date
  * Priority
* Clean handling of empty and error states

---

### 📊 Analytics & Reports (Chart.js)

* Pending workload summary
* Tasks closed in the last 7 days
* Closed tasks distribution by:

  * Team
  * Owner
  * Project
* Intelligent empty-state handling
* Fully responsive chart layout

---

### ⚙️ Settings

* Central management screen
* Delete:

  * Teams
  * Projects
  * Tasks
* Frontend state updates after delete
* Toast notifications for success and failure

---

### 👤 Profile

* View logged-in user details
* Secure logout
* Session cleanup on logout

---

### 📱 Responsive UI

* Fully responsive Bootstrap 5 layout
* Optimized for:

  * Mobile
  * Tablet
  * Desktop
* Sidebar-based navigation
* Accessible icons using Bootstrap Icons

---

### 🧠 Smart Form Validation

* Regex-based validation for:

  * Name
  * Email
  * Password strength
* Required field enforcement
* Clean error messaging
* Prevents invalid data submission

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Bootstrap 5
* Bootstrap Icons
* Custom CSS
* Chart.js + react-chartjs-2
* Fetch API
* ES6 JavaScript
* HTML5 + CSS3

---

## 🌐 Backend API Usage

TaskPilot frontend uses **two backend deployments**:

### 🔹 Core APIs (Render)

Used for all application data and protected routes:

```
https://task-pilot-backend-5sb3.onrender.com
```

Includes:

* Login
* Profile
* Tasks
* Projects
* Teams
* Tags
* Reports
* Settings delete actions

---

### 🔹 OTP & Email APIs (Vercel)

Used **only for authentication flows**:

```
https://task-pilot-backend-sigma.vercel.app
```

Includes:

* Signup OTP
* Verify signup OTP
* Resend signup OTP
* Forgot password OTP
* Verify forgot password OTP
* Reset password
* OTP expiry checks

---

## 📂 Folder Structure

```
task-pilot-frontend/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── ProjectsHome.jsx
│   │   ├── TasksHome.jsx
│   │   ├── TeamsHome.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── customHooks/
│   │   ├── useFetch.js
│   │   └── useTaskFetch.js
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── VerifySignupOTP.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── VerifyForgotOTP.jsx
│   │   ├── Profile.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── AddProject.jsx
│   │   ├── EditProject.jsx
│   │   ├── Tasks.jsx
│   │   ├── TaskDetails.jsx
│   │   ├── AddTask.jsx
│   │   ├── EditTask.jsx
│   │   ├── Teams.jsx
│   │   ├── TeamDetails.jsx
│   │   ├── AddTeam.jsx
│   │   ├── EditTeam.jsx
│   │   ├── Report.jsx
│   │   └── Setting.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
│
└── package.json
```

---

## ⚙️ How to Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/task-pilot-frontend.git
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start the development server

```bash
npm run dev
```

### 4️⃣ Open in browser

```
http://localhost:5173
```

---

## 🚀 Future Enhancements

* Role-based access control
* Task comments and activity logs
* File attachments
* Global search
* Dark mode
* Notifications system

---


