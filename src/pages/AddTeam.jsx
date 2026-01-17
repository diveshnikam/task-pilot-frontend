import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const teamNameRegex = /^[A-Za-z0-9 _-]+$/;

const validateTeamName = (value) => {
  if (!value || value.trim() === "") return "Team name is required";
  if (!teamNameRegex.test(value)) return "Invalid characters in team name";
  if (value.trim().length < 2) return "Team name must be at least 2 characters";
  return "";
};

const AddTeam = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [team, setTeam] = useState({
    name: "",
    description: "",
  });

  const [nameError, setNameError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    const nErr = validateTeamName(team.name);
    setNameError(nErr);

    if (nErr) {
      setUpdateError("Please fix validation errors before submitting.");
      setTimeout(() => setUpdateError(""), 3000);
      return;
    }

    setIsUpdating(true);
    setUpdateMessage("");
    setUpdateError("");

    try {
      const res = await fetch(
        "https://task-pilot-backend-5sb3.onrender.com/teams",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: team.name,
            description: team.description,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.errorMessage || "Failed to create team");

      setUpdateMessage("Team created successfully!");
      setTimeout(() => setUpdateMessage(""), 3000);
      setTeam({ name: "", description: "" });
    } catch (err) {
      setUpdateError(err.message);
      setTimeout(() => setUpdateError(""), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mb-5 px-3" style={{ marginTop: "5rem" }}>
      <div className="row justify-content-center g-4 mx-0">
        <div className="col-12 col-md-3 text-center text-md-start mb-5">
          <Link to="/teams" className="btn btn-outline-dark">
            <i className="bi bi-arrow-left me-2"></i> Back
          </Link>
        </div>

        <div className="col-12 col-md-9">
          <h1 className="fw-bold mb-5 text-center text-md-start fs-5 fs-md-1">
            Add New Team
          </h1>

          <form
            className="border p-4 rounded shadow-sm"
            style={{ maxWidth: "550px" }}
            onSubmit={handleAdd}
          >
            <label className="mb-2">
              <b>Team Name:</b>
            </label>
            <input
              className={`form-control ${nameError && "is-invalid"}`}
              value={team.name}
              onChange={(e) => {
                setTeam({ ...team, name: e.target.value });
                setNameError(validateTeamName(e.target.value));
              }}
              required
            />
            <div className="invalid-feedback mt-2">{nameError}</div>

            <label className="mt-3 mb-2">
              <b>Description (optional):</b>
            </label>
            <textarea
              className="form-control"
              rows="3"
              value={team.description}
              onChange={(e) =>
                setTeam({ ...team, description: e.target.value })
              }
            />

            <div className="mt-4">
              <button
                className="btn btn-dark fw-semibold px-4 py-2"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Create Team
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
                <p className="text-dark mt-3 fw-semibold">
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

export default AddTeam;
