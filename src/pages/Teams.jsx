import { Link } from "react-router-dom";
import TeamsHome from "../components/TeamsHome";

const Teams = () => {
  return (
    <div className="container mt-4">
      <div className="row align-items-start">

     
        <div className="col-12 col-md-2 text-center text-md-start mb-3 mb-md-0">
          <Link to="/app" className="btn btn-outline-dark w-md-auto" style={{ marginTop: "2rem" }}>
            <i className="bi bi-arrow-left me-2"></i> Back
          </Link>
        </div>

    
        <div className="col-12 col-md-10">
          <TeamsHome />
        </div>

      </div>
    </div>
  );
};

export default Teams;
