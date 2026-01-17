import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../customHooks/useFetch";
import useTaskFetch from "../customHooks/useTaskFetch";
import { toast } from "react-toastify";

const Settings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    leadData: teamsData,
    loading: tLoad,
    error: tErr,
  } = useFetch("https://task-pilot-backend-5sb3.onrender.com/teams");

  const {
    leadData: projectsData,
    loading: pLoad,
    error: pErr,
  } = useFetch("https://task-pilot-backend-5sb3.onrender.com/projects");

  const {
    tasks: tasksData,
    loading: taskLoad,
    error: taskErr,
  } = useTaskFetch("https://task-pilot-backend-5sb3.onrender.com/tasks");

  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (Array.isArray(teamsData)) setTeams(teamsData);
    if (Array.isArray(projectsData)) setProjects(projectsData);
    if (Array.isArray(tasksData)) setTasks(tasksData);
  }, [teamsData, projectsData, tasksData]);

  const isLoading = tLoad || pLoad || taskLoad;
  const hasError = tErr || pErr || taskErr;

  const handleDelete = async (type, id) => {
    setDeletingId(id);

    try {
      const res = await fetch(
        `https://task-pilot-backend-5sb3.onrender.com/${type}/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      // ===== FRONTEND FILTERING (UNCHANGED) =====
      if (type === "teams") {
        setTeams((prev) => prev.filter((x) => x._id !== id));
      }

      if (type === "projects") {
        setProjects((prev) => prev.filter((x) => x._id !== id));
        setTasks((prev) => prev.filter((t) => t.project?._id !== id));
      }

      if (type === "tasks") {
        setTasks((prev) => prev.filter((x) => x._id !== id));
      }

      toast.success(`${type.slice(0, -1)} deleted successfully`);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-dark"></div>
        <p className="text-muted mt-2">Loading settings...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <i className="bi bi-exclamation-triangle-fill fs-1"></i>
        <p className="mt-2">{tErr || pErr || taskErr}</p>
      </div>
    );
  }

  return (
    <div className="container mb-5 px-3" style={{ marginTop: "5rem" }}>
      <div className="row justify-content-center g-4 mx-0">

        {/* BACK BUTTON COLUMN */}
        <div className="col-12 col-md-3 text-center text-md-start mb-5">
          <Link to="/app" className="btn btn-outline-dark">
            <i className="bi bi-arrow-left me-2"></i> Back
          </Link>
        </div>

        {/* MAIN CONTENT COLUMN */}
        <div className="col-12 col-md-9">

          <h2 className="fw-bold mb-5 text-center text-md-start">Settings</h2>

          {/* TEAMS */}
          <h4 className="fw-bold mb-5 mt-5">Teams</h4>
          <div className="row g-4 mb-5">
            {teams.map((t) => (
              <div key={t._id} className="col-12 col-md-6 col-lg-4">
                <div className="card project-card shadow-sm h-100">
                  <div
                    className="card-body d-flex flex-column"
                    onClick={() => navigate(`/team/${t._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <h5 className="project-title">{t.name}</h5>
                    <p className="project-desc mt-2">
                      {t.description || "No description"}
                    </p>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-dark m-3"
                    disabled={deletingId === t._id}
                    onClick={() => handleDelete("teams", t._id)}
                  >
                    {deletingId === t._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PROJECTS */}
          <h4 className="fw-bold mb-5 mt-5  text-center text-md-start">Projects</h4>
          <div className="row g-4 mb-5">
            {projects.map((p) => (
              <div key={p._id} className="col-12 col-md-6 col-lg-4">
                <div className="card project-card shadow-sm h-100">
                  <div
                    className="card-body d-flex flex-column"
                    onClick={() => navigate(`/project/${p._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <h5 className="project-title">{p.name}</h5>
                    <p className="project-desc mt-2">
                      {p.description || "No description"}
                    </p>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-dark m-3"
                    disabled={deletingId === p._id}
                    onClick={() => handleDelete("projects", p._id)}
                  >
                    {deletingId === p._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TASKS */}
          <h4 className="fw-bold mb-5 mt-5  text-center text-md-start">Tasks</h4>
          <div className="row g-4">
            {tasks.map((t) => (
              <div key={t._id} className="col-12 col-md-6 col-lg-4">
                <div className="card project-card shadow-sm h-100">
                  <div
                    className="card-body d-flex flex-column"
                    onClick={() => navigate(`/task/${t._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <h6 className="project-title">{t.name}</h6>
                    <p className="project-desc mt-2">
                      Status: {t.status} | Priority: {t.priority}
                    </p>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-dark m-3"
                    disabled={deletingId === t._id}
                    onClick={() => handleDelete("tasks", t._id)}
                  >
                    {deletingId === t._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
