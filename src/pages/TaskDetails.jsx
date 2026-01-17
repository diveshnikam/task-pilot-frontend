import { useParams, Link } from "react-router-dom";
import useFetch from "../customHooks/useFetch";

const TaskDetails = () => {
  const { taskId } = useParams();

  const {
    loading,
    error,
    leadData: task,
  } = useFetch(`https://task-pilot-backend-5sb3.onrender.com/tasks/${taskId}`);

  if (loading && !error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div
          className="spinner-border text-dark"
          style={{ width: "3rem", height: "3rem" }}
        />
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-dark fw-semibold fs-4"
        style={{ height: "70vh" }}
      >
        <i className="bi bi-exclamation-triangle-fill me-3 fs-2"></i>
        {error}
      </div>
    );
  }

  if (!task?._id) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-secondary fw-semibold fs-4"
        style={{ height: "70vh" }}
      >
        <i className="bi bi-emoji-frown fs-2 me-3"></i>
        Task Not Found
      </div>
    );
  }

  const getTimeRemaining = () => {
    if (!task.createdAt || !task.timeToComplete) return "-";
    const created = new Date(task.createdAt);
    const due = new Date(created);
    due.setDate(due.getDate() + task.timeToComplete);
    const diff = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
    return diff <= 0 ? "Overdue" : `${diff} days`;
  };

  const Row = ({ label, value }) => (
    <>
      <div className="row align-items-start">
        <div className="col-5 col-md-3 fw-semibold">{label}</div>
        <div className="col-7 col-md-9">{value || "Not Assigned"}</div>
      </div>
      <hr className="my-2 mt-3 mb-3" />
    </>
  );

  return (
    <div
      className="container"
      style={{ marginTop: "", marginBottom: "3rem" }}
    >
      <div className="row mt-3 justify-content-center g-4 px-3 px-md-0">
        <div className="col-12 col-md-3 text-center text-md-start mt-4"></div>
        <div className="col-12 col-md-9">
          <h3 className="fw-bold text-center text-md-start ">
            Task Details - {task.name || "-"}
          </h3>
        </div>
      </div>

      

      <div className="row mt-5 justify-content-center g-4 px-3 px-md-0">
       
        <div className="col-12 col-md-3 text-center text-md-start mt-4">
          <Link to = "/app"
            
            className="btn btn-outline-dark mb-4 mt-2"
          >
            <i className="bi bi-arrow-left me-2"></i> Back
          </Link>
        </div>

       
        <div className="col-12 col-md-9">
          <h4 className="fw-bold mb-5 mt-2 text-center text-md-start">
            Task Information
          </h4>

          <div className="p-4 border rounded shadow-sm mx-auto w-100 w-md-75 w-xl-50">
            <Row label="Task Name:" value={task.name} />
            <Row label="Project:" value={task.project?.name} />
            <Row label="Team:" value={task.team?.name} />
            <Row
              label="Owners:"
              value={
                Array.isArray(task.owners) && task.owners.length
                  ? task.owners.map((o) => o?.name).join(", ")
                  : "-"
              }
            />
            <Row label="Status:" value={task.status} />
            <Row label="Priority:" value={task.priority} />
            <Row label="Time Remaining:" value={getTimeRemaining()} />
            <Row
              label="Tags:"
              value={
                Array.isArray(task.tags) && task.tags.length
                  ? task.tags.map((t) => t?.name).join(", ")
                  : "-"
              }
            />
          </div>

          <div className="text-center text-md-start">
            <Link
              to={`/edit-task/${task._id}`}
              state={{ task }}
              className="mt-4 btn btn-outline-dark fw-semibold border p-2"
            >
              <i className="bi bi-pencil-square me-2 fs-5 fw-bold"></i>
              Edit Task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
