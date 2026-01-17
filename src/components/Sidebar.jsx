import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
  <div className="bg-light text-dark p-4 sidebar-wrapper
     d-flex flex-column align-items-center align-items-md-start
     text-center text-md-start">


      <h4 className="fw-bold mb-5 mt-2   backgrnd">
        <Link to = "/app" className="text-decoration-none text-dark "><i className="bi bi-rocket-takeoff me-2"></i> TaskPilot</Link>
      </h4>

     

      <Link
        to="/teams"
        className="d-flex align-items-center gap-3 text-decoration-none text-dark mb-3 p-2 rounded sidebar-item sidebar-hover"
      >
        <i className="bi bi-people fs-5"></i> Teams
      </Link>

      <Link
        to="/projects"
        className="d-flex align-items-center gap-3 sidebar-hover text-decoration-none text-dark mb-3 p-2 rounded sidebar-item"
      >
        <i className="bi bi-folder fs-5"></i> Projects
      </Link>

      <Link
        to="/report"
        className="d-flex align-items-center gap-3 sidebar-hover text-decoration-none text-dark mb-3 p-2 rounded sidebar-item"
      >
        <i className="bi bi-bar-chart fs-5"></i> Reports
      </Link>

      <Link
        to="/setting"
        className="d-flex align-items-center sidebar-hover gap-3 text-decoration-none text-dark mb-3 p-2 rounded sidebar-item"
      >
        <i className="bi bi-gear fs-5"></i> Settings
      </Link>

       <Link
        to="/profile"
        className="d-flex align-items-center sidebar-hover gap-3 text-decoration-none text-dark mb-3 p-2 rounded sidebar-item"
      >
        <i className="bi bi-person  fs-5"></i> Profile
      </Link>
    </div>
  );
};

export default Sidebar;
