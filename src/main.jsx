import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifySignupOTP from "./pages/VerifySignupOTP.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyForgotOTP from "./pages/VerifyForgotOTP.jsx";
import Projects from "./pages/Projects.jsx";
import Report from "./pages/Report.jsx";
import Setting from "./pages/Setting.jsx";
import Teams from "./pages/Teams.jsx";
import ProjectDetails from "./pages/ProjectDeatils.jsx";
import Addproject from "./pages/AddProject.jsx";
import AddTask from "./pages/AddTask.jsx";
import TaskDetails from "./pages/TaskDetails.jsx";
import EditTask from "./pages/EditTask.jsx";
import EditProject from "./pages/EditProject.jsx";
import AddTeam from "./pages/AddTeam.jsx";
import TeamDeatails from "./pages/TeamDetails.jsx";
import EditTeam from "./pages/EditTeam.jsx";  
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile.jsx";



const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verify-signup-otp", element: <VerifySignupOTP /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  { path: "/verify-forgot-otp", element: <VerifyForgotOTP /> },
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/report",
    element: (
      <ProtectedRoute>
        <Report />
      </ProtectedRoute>
    ),
  },
  {
    path: "/setting",
    element: (
      <ProtectedRoute>
        <Setting />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teams",
    element: (
      <ProtectedRoute>
        <Teams />
      </ProtectedRoute>
    ),
  },

  {
    path: "/project/:projectId",
    element: (
      <ProtectedRoute>
        <ProjectDetails />
      </ProtectedRoute>
    ),
  },

  {
    path: "/add-project",
    element: (
      <ProtectedRoute>
        <Addproject />
      </ProtectedRoute>
    ),
  },

  {
    path: "/add-task",
    element: (
      <ProtectedRoute>
        <AddTask />
      </ProtectedRoute>
    ),
  },

  {
    path: "/task/:taskId",
    element: (
      <ProtectedRoute>
        <TaskDetails />
      </ProtectedRoute>
    ),
  },

  {
    path: "/edit-task/:taskId",
    element: (
      <ProtectedRoute>
        <EditTask />
      </ProtectedRoute>
    ),
  },

  {
    path: "/edit-project/:projectId", 
    element: (
      <ProtectedRoute>
        <EditProject />
      </ProtectedRoute>
    ),
  },

  {
    path: "/add-team",
    element: (
      <ProtectedRoute>  
        <AddTeam />
      </ProtectedRoute>
    ),
  },

  {
    path: "/team/:teamId",
    element: (
      <ProtectedRoute>
        <TeamDeatails />
      </ProtectedRoute>
    ),
  },

  {
    path: "/edit-team/:teamId",
    element: (
      <ProtectedRoute>
        <EditTeam />
      </ProtectedRoute>
    ),
  },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),  
  }

]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover={false}
      />
    <RouterProvider router={router} />
  </StrictMode>
);
