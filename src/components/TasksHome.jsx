import useTaskFetch from "../customHooks/useTaskFetch";
import { Link } from "react-router-dom";
import { useState } from "react";

const getDueDate = (createdAt, days) => {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + Number(days));
  return d.toLocaleDateString();
};

const TasksHome = () => {
  const [status, setStatus] = useState("");

  const url = status
    ? `https://task-pilot-backend-5sb3.onrender.com/tasks/?status=${status}`
    : `https://task-pilot-backend-5sb3.onrender.com/tasks`;

  const { tasks, loading, error } = useTaskFetch(url);

  return (
    <div className="container-fluid p-4 mb-5">
      <div className="d-flex justify-content-center justify-content-md-between align-items-center mb-5">
        <h2 className="fw-bold mb-3 mt-5 text-center text-md-start">Tasks</h2>
      </div>

      {!loading && !error && tasks.length > 0 && (
        <div className="mb-5 mt-5 d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
          {["", "To Do", "In Progress", "Completed", "Blocked"].map((s) => (
            <button
              key={s}
              className={`btn btn-sm task-filter-btn ${
                status === s ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setStatus(s)}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="d-flex justify-content-center justify-content-md-start mb-5">
          <Link to="/add-task">
            <button className="btn btn-outline-dark fw-semibold px-3 px-md-4 py-1 py-md-2 fs-6 fs-md-5 mt-3">
              Add New Task
            </button>
          </Link>
        </div>
      )}

      {loading && !error && (
        <div className="text-center my-5">
          <div className="spinner-border text-dark"></div>
          <p className="small mt-2 text-muted">Loading tasks...</p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center my-5">
          <i className="bi bi-exclamation-triangle-fill fs-2"></i>
          <p className="mt-2 fw-semibold">{error}</p>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="text-center text-muted my-5">
          <i className="bi bi-folder-x fs-2"></i>
          <p className="mt-2 fw-semibold">No tasks found</p>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="row g-4">
          {tasks.map((t) => (
            <div key={t._id} className="col-12 col-md-6 col-lg-4">
              <Link
                to={`/task/${t._id}`}
                className="text-decoration-none text-dark h-100 d-block"
              >
                <div className="card project-card shadow-sm h-100">
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

                    <div className="mt-2 small text-muted ">
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
  );
};

export default TasksHome;
