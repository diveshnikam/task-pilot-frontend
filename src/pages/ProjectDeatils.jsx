import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import useFetch from "../customHooks/useFetch";

const getDueDate = (createdAt, days) => {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + Number(days));
  return d.toLocaleDateString();
};

const ProjectDetails = () => {
  const { projectId } = useParams();

  const projectRes = useFetch(
    `https://task-pilot-backend-5sb3.onrender.com/projects/${projectId}`
  );
  const teamRes = useFetch(
    "https://task-pilot-backend-5sb3.onrender.com/teams"
  );
  const userRes = useFetch(
    "https://task-pilot-backend-5sb3.onrender.com/users"
  );
  const tagRes = useFetch("https://task-pilot-backend-5sb3.onrender.com/tags");

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    team: "",
    owner: "",
    tag: "",
  });
  const [sortBy, setSortBy] = useState("");

  const buildUrl = () => {
    let url = `https://task-pilot-backend-5sb3.onrender.com/projects/${projectId}/tasks?`;
    if (filters.status) url += `status=${filters.status}&`;
    if (filters.priority) url += `priority=${filters.priority}&`;
    if (filters.team) url += `team=${filters.team}&`;
    if (filters.owner) url += `owner=${filters.owner}&`;
    if (filters.tag) url += `tag=${filters.tag}&`;
    return url;
  };

  const {
    leadData: taskData,
    loading: taskLoading,
    error: taskError,
  } = useFetch(buildUrl());

  const tasks = taskData?.tasks || [];

  if (
    projectRes.loading ||
    teamRes.loading ||
    userRes.loading ||
    tagRes.loading
  ) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  const error =
    projectRes.error || teamRes.error || userRes.error || tagRes.error;
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-center">
        <div>
          <i className="bi bi-exclamation-triangle-fill fs-1"></i>
          <p className="fw-semibold mt-3">{error}</p>
        </div>
      </div>
    );
  }

  const project = projectRes.leadData;
  const teams = teamRes.leadData;
  const users = userRes.leadData;
  const tags = tagRes.leadData;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "due") {
      const da = new Date(a.createdAt).getTime() + a.timeToComplete * 86400000;
      const db = new Date(b.createdAt).getTime() + b.timeToComplete * 86400000;
      return da - db;
    }
    if (sortBy === "priority") {
      const map = { High: 1, Medium: 2, Low: 3 };
      return map[a.priority] - map[b.priority];
    }
    return 0;
  });

  return (
    <div
      className="container mb-5 px-3 px-md-3"
      style={{ marginTop: "5rem", overflowX: "hidden" }}
    >
      <div className="row justify-content-center g-4 mx-0">
        <div
          className="col-12 col-md-3 text-center text-md-start mb-4 mb-md-0"
          style={{ marginTop: "2.5rem" }}
        >
          <Link to="/app" className="btn btn-outline-dark">
            <i className="bi bi-arrow-left"></i> Back
          </Link>
        </div>

        <div className="col-12 col-md-9">
          <div className="mb-4 text-center text-md-start">
            <h2 className="fw-bold">{project.name}</h2>
            <p className="text-muted">
              {project.description || "No description provided"}
            </p>

            <Link
              to={`/edit-project/${projectId}`}
              className="btn btn-outline-dark btn-sm mt-5 mb-5 me-5"
            >
              <i className="bi bi-pencil-square me-1"></i> Edit Project
            </Link>

            <Link
              to={`/add-task`}
              className="btn btn-outline-dark btn-sm mt-5 mb-5"
            >
              <i className="bi bi-plus-circle  me-1"></i> Add New Task
            </Link>
          </div>

          <div className="row g-2 g-md-3 mb-5">
            <div className="col-12 col-sm-6 col-md-auto">
              <select
                className="form-select w-100"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">Status</option>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Blocked</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-auto">
              <select
                className="form-select w-100"
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
              >
                <option value="">Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-auto">
              <select
                className="form-select w-100"
                value={filters.team}
                onChange={(e) =>
                  setFilters({ ...filters, team: e.target.value })
                }
              >
                <option value="">Team</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-auto">
              <select
                className="form-select w-100"
                value={filters.owner}
                onChange={(e) =>
                  setFilters({ ...filters, owner: e.target.value })
                }
              >
                <option value="">Owner</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-auto">
              <select
                className="form-select w-100"
                value={filters.tag}
                onChange={(e) =>
                  setFilters({ ...filters, tag: e.target.value })
                }
              >
                <option value="">Tag</option>
                {tags.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-auto">
              <select
                className="form-select w-100"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort</option>
                <option value="due">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          {taskError && !taskLoading && (
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{ minHeight: "30vh" }}
            >
              <i className="bi bi-exclamation-triangle-fill fs-1 mb-3"></i>
              <p className="fw-semibold">{taskError}</p>
            </div>
          )}

          {taskLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "30vh" }}
            >
              <div className="spinner-border text-dark"></div>
            </div>
          ) : sortedTasks.length === 0 && !taskError ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: "30vh" }}
            >
              <i className="bi bi-filter-circle fs-1 mb-3"></i>
              <p className="fw-semibold">No tasks found</p>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {sortedTasks.map((t) => (
                <div key={t._id} className="col-12 col-md-6 col-lg-4">
                  <Link
                    to={`/task/${t._id}`}
                    className="text-decoration-none text-dark h-100 d-block"
                  >
                    <div className="card project-card shadow-sm h-100 task-equal-card">
                      <div className="card-body d-flex flex-column">
                        <h6 className="project-title">{t.name}</h6>

                        <div className="mt-3 project-desc">
                          <span className="fw-bold text-dark">Owners:</span>{" "}
                          {t.owners && t.owners.length > 0 ? (
                            <>
                              {t.owners
                                .slice(0, 2)
                                .map((o) => o.name)
                                .join(", ")}
                              {t.owners.length > 2 && (
                                <span className="text-muted">
                                  {" "}
                                  +{t.owners.length - 2} more
                                </span>
                              )}
                            </>
                          ) : (
                            "Unassigned"
                          )}
                        </div>

                        <div className="mt-2 small text-muted">
                          <span className="fw-bold text-dark">Due Date:</span>{" "}
                          {getDueDate(t.createdAt, t.timeToComplete)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
