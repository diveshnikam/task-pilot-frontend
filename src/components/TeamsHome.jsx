import useFetch from "../customHooks/useFetch";
import { Link } from "react-router-dom";

const TeamsHome = () => {
  const { leadData, loading, error } = useFetch(
    "https://task-pilot-backend-5sb3.onrender.com/teams"
  );

  const teams = Array.isArray(leadData)
    ? leadData
    : Array.isArray(leadData?.data)
    ? leadData.data
    : [];

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-5 text-center text-md-start mt-1">Teams</h2>

     
      {loading && !error && (
        <div className="text-center my-5 mt-5">
          <div className="spinner-border text-dark mt-5"></div>
          <p className="small mt-2 text-muted">Loading teams...</p>
        </div>
      )}

      
      {!loading && error && (
        <div className="text-center text-dark my-5">
          <i className="bi bi-exclamation-triangle-fill fs-2 mt-5"></i>
          <p className="mt-2 fw-semibold">{error}</p>
        </div>
      )}

    
      {!loading && !error && teams.length === 0 && (
        <div className="text-center text-muted my-5">
          <i className="bi bi-people fs-2"></i>
          <p className="mt-2 fw-semibold">No teams found</p>
        </div>
      )}

     
      {!loading && !error && teams.length > 0 && (
        <div className="d-flex justify-content-center justify-content-md-start mb-5">
          <Link to="/add-team">
            <button className="btn btn-outline-dark fw-semibold px-3 px-md-4 py-1 py-md-2 fs-6 fs-md-5">
              Add New Team
            </button>
          </Link>
        </div>
      )}

     
      {!loading && !error && teams.length > 0 && (
        <div className="row g-4 justify-content-center justify-content-md-start">
          {teams.map((t) => (
            <div key={t._id} className="col-12 col-md-6 col-lg-4">
              <Link
                to={`/team/${t._id}`}
                className="text-decoration-none text-dark h-100 d-block"
              >
                <div className="card project-card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="project-title">{t.name}</h5>
                    <p className="project-desc mt-2">
                      {t.description || "No description"}
                    </p>
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

export default TeamsHome;
