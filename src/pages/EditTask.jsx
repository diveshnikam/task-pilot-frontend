import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../customHooks/useFetch";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const taskNameRegex = /^[A-Za-z0-9 ._-]+$/;

const validateTaskName = (value) => {
  if (!value || value.trim() === "") return "Task name is required";
  if (!taskNameRegex.test(value))
    return "Task name contains invalid characters";
  if (value.trim().length < 2) return "Task name must be at least 2 characters";
  return "";
};

const validateTimeToComplete = (value) => {
  if (!value) return "Time to complete is required";
  if (!/^[0-9]+$/.test(value)) return "Only numbers allowed";
  if (Number(value) < 1) return "Time must be at least 1 day";
  return "";
};

const validateSelect = (value, label) => {
  if (!value || value === "") return `${label} is required. Please select one.`;
  return "";
};

const validateOwners = (arr) =>
  !arr || arr.length === 0 ? "Select at least one owner" : "";

const validateTags = (arr) =>
  !arr || arr.length === 0 ? "Select at least one tag" : "";

const EditTask = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [nameError, setNameError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [teamError, setTeamError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [priorityError, setPriorityError] = useState("");
  const [ownerError, setOwnerError] = useState("");
  const [tagError, setTagError] = useState("");

  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    leadData: taskData,
    loading,
    error,
  } = useFetch(`https://task-pilot-backend-5sb3.onrender.com/tasks/${taskId}`);

  const {
    leadData: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useFetch("https://task-pilot-backend-5sb3.onrender.com/projects");

  const {
    leadData: teams,
    loading: teamsLoading,
    error: teamsError,
  } = useFetch("https://task-pilot-backend-5sb3.onrender.com/teams");

  const {
    leadData: users,
    loading: usersLoading,
    error: usersError,
  } = useFetch("https://task-pilot-backend-5sb3.onrender.com/users");

  const {
    leadData: tags,
    loading: tagsLoading,
    error: tagsError,
  } = useFetch("https://task-pilot-backend-5sb3.onrender.com/tags");

  const isPageLoading =
    loading || projectsLoading || teamsLoading || usersLoading || tagsLoading;

  const pageError =
    error || projectsError || teamsError || usersError || tagsError;

  useEffect(() => {
    if (taskData?._id) setTask(taskData);
  }, [taskData]);

  if (isPageLoading || !task) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div className="spinner-border text-dark" />
      </div>
    );
  }

  if (pageError) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-danger fw-semibold fs-4"
        style={{ height: "70vh" }}
      >
        <i className="bi bi-exclamation-triangle-fill me-3 fs-2"></i>
        {pageError}
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    const nErr = validateTaskName(task.name);
    const tErr = validateTimeToComplete(task.timeToComplete);
    const pErr = validateSelect(task.project?._id, "Project");
    const tmErr = validateSelect(task.team?._id, "Team");
    const sErr = validateSelect(task.status, "Status");
    const prErr = validateSelect(task.priority, "Priority");
    const oErr = validateOwners(task.owners);
    const tgErr = validateTags(task.tags);

    setNameError(nErr);
    setTimeError(tErr);
    setProjectError(pErr);
    setTeamError(tmErr);
    setStatusError(sErr);
    setPriorityError(prErr);
    setOwnerError(oErr);
    setTagError(tgErr);

    if (nErr || tErr || pErr || tmErr || sErr || prErr || oErr || tgErr) {
      setUpdateError("Please fix all validation errors before submitting.");
      setTimeout(() => setUpdateError(""), 3000);
      return;
    }

    setIsUpdating(true);
    setUpdateMessage("");
    setUpdateError("");

    try {
      const res = await fetch(
        `https://task-pilot-backend-5sb3.onrender.com/tasks/${task._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: task.name,
            project: task.project._id,
            team: task.team._id,
            owners: task.owners.map((o) => o._id),
            tags: task.tags.map((t) => t._id),
            timeToComplete: Number(task.timeToComplete),
            status: task.status,
            priority: task.priority,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update task");
      }

      setUpdateMessage("Task updated successfully!");

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });

      

      setTimeout(() => {
        setUpdateMessage("");
      }, 3000);

    } catch (err) {
      setUpdateError(err.message);
      setTimeout(() => setUpdateError(""), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="container mb-5 px-3 px-md-3"
      style={{ marginTop: "5rem", overflowX: "hidden" }}
    >
      <div className="row justify-content-center g-4 mx-0">
        <div className="col-12 col-md-3 text-center text-md-start mb-5">
          <Link to={`/task/${task._id}`} className="btn btn-outline-dark">
            <i className="bi bi-arrow-left me-2"></i> Back
          </Link>
        </div>

        <div className="col-12 col-md-9 ">
          <h1 className="fw-bold mb-5 text-center text-md-start fs-5 fs-md-1">
            Update Task - {taskData.name}
          </h1>

          <form
            className="border p-4 rounded shadow-sm"
            style={{ maxWidth: "650px" }}
            onSubmit={handleUpdate}
          >
            <label className=" mb-2">
              <b>Task Name:</b>
            </label>
            <input
              className={`form-control ${nameError && "is-invalid"}`}
              value={task.name}
              required
              onChange={(e) => {
                setTask({ ...task, name: e.target.value });
                setNameError(validateTaskName(e.target.value));
              }}
            />
            <div className="invalid-feedback mt-2">{nameError}</div>
            <label className="mt-3 mb-2">
              <b>Time to Complete:</b>
            </label>
            <input
              type="text"
              required
              className={`form-control ${timeError && "is-invalid"}`}
              value={task.timeToComplete}
              onChange={(e) => {
                setTask({ ...task, timeToComplete: e.target.value });
                setTimeError(validateTimeToComplete(e.target.value));
              }}
            />
            <div className="invalid-feedback mt-2">{timeError}</div>
            <label className="mt-3 mb-2">
              <b>Project:</b>
            </label>
            <select
              className={`form-select ${projectError && "is-invalid"}`}
              value={task.project?._id || ""}
              required
              onChange={(e) => {
                const v = e.target.value;
                setTask({ ...task, project: { _id: v } });
                setProjectError(validateSelect(v, "Project"));
              }}
            >
              <option value="">Select Project</option>
              {projects?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback mt-2">{projectError}</div>
            <label className="mt-3 mb-2">
              <b>Team:</b>
            </label>
            <select
              className={`form-select ${teamError && "is-invalid"}`}
              value={task.team?._id || ""}
              required
              onChange={(e) => {
                const v = e.target.value;
                setTask({ ...task, team: { _id: v } });
                setTeamError(validateSelect(v, "Team"));
              }}
            >
              <option value="">Select Team</option>
              {teams?.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback mt-2">{teamError}</div>
            <label className="mt-3 mb-2">
              <b>Status:</b>
            </label>
            <select
              className={`form-select ${statusError && "is-invalid"}`}
              required
              value={task.status || ""}
              onChange={(e) => {
                const v = e.target.value;
                setTask({ ...task, status: v });
                setStatusError(validateSelect(v, "Status"));
              }}
            >
              <option value="">Select Status</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Blocked</option>
            </select>
            <div className="invalid-feedback mt-2">{statusError}</div>
            <label className="mt-3 mb-2">
              <b>Priority:</b>
            </label>
            <select
              className={`form-select ${priorityError && "is-invalid"}`}
              value={task.priority || ""}
              required
              onChange={(e) => {
                const v = e.target.value;
                setTask({ ...task, priority: v });
                setPriorityError(validateSelect(v, "Priority"));
              }}
            >
              <option value="">Select Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <div className="invalid-feedback mt-2">{priorityError}</div>
            <label className="mt-3 mb-2">
              <b>Owners:</b>
            </label>
            {users?.map((u) => {
              const checked = task.owners.some((o) => o._id === u._id);
              const ownerId = `owner-${u._id}`;

              return (
                <div key={u._id} className="form-check ">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={ownerId}
                    checked={checked}
                    onChange={() => {
                      let updated;
                      if (checked) {
                        updated = task.owners.filter((o) => o._id !== u._id);
                      } else {
                        updated = [...task.owners, { _id: u._id }];
                      }

                      setTask({ ...task, owners: updated });
                      setOwnerError(validateOwners(updated));
                    }}
                  />

                  <label className="form-check-label" htmlFor={ownerId}>
                    {u.name}
                  </label>
                </div>
              );
            })}
            <small className="text-danger d-block mt-3 ">{ownerError}</small>{" "}
            <br />
            <label className=" mb-2">
              <b>Tags:</b>
            </label>
            {tags?.map((t) => {
              const checked = task.tags.some((x) => x._id === t._id);
              const tagId = `tag-${t._id}`;

              return (
                <div key={t._id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={tagId}
                    checked={checked}
                    onChange={() => {
                      let updated;
                      if (checked) {
                        updated = task.tags.filter((x) => x._id !== t._id);
                      } else {
                        updated = [...task.tags, { _id: t._id }];
                      }

                      setTask({ ...task, tags: updated });
                      setTagError(validateTags(updated));
                    }}
                  />

                  <label className="form-check-label" htmlFor={tagId}>
                    {t.name}
                  </label>
                </div>
              );
            })}
            <small className="text-danger d-block mt-3 mb-5">{tagError}</small>
            <div className="mt-4">
              <button
                className="btn btn-dark fw-semibold px-4 py-2"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Update Task
                  </>
                )}
              </button>

              {updateMessage && (
                <p className="text-dark mt-3 fw-semibold">
                  <i className="bi bi-check-circle me-2"></i>
                  {updateMessage}
                </p>
              )}

              {updateError && (
                <p className="text-dark mt-3 fw-semibold mb-5">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {updateError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
