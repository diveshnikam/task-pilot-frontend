import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <div className="spinner-border text-dark" />
      </div>
    );
  }

  return (
    <div
      className="container mb-5 px-3 px-md-3"
      style={{ marginTop: "5rem", overflowX: "hidden" }}
    >
      <div className="row justify-content-center g-4 mx-0">

        {/* LEFT COLUMN — BACK */}
        <div className="col-12 col-md-3 text-center text-md-start mb-4 mb-md-0">
          <Link to="/app" className="btn btn-outline-dark">
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
        </div>

        {/* RIGHT COLUMN — CONTENT */}
        <div className="col-12 col-md-9">
          <h2 className="fw-bold mb-5 text-center text-md-start">
            Profile
          </h2>

          <div
            className="border p-4 rounded shadow-sm"
            style={{ maxWidth: "600px" }}
          >
            {/* Name */}
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-person fs-4 me-3"></i>
              <div>
                <div className="text-muted small">Name</div>
                <div className="fw-semibold">{user.name}</div>
              </div>
            </div>

            {/* Email */}
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-envelope fs-4 me-3"></i>
              <div>
                <div className="text-muted small">Email</div>
                <div className="fw-semibold">{user.email}</div>
              </div>
            </div>

            {/* Logout */}
            <button
              className="btn btn-outline-dark w-100 py-2"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
