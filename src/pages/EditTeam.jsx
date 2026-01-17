import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../customHooks/useFetch";

const teamNameRegex = /^[A-Za-z0-9 _-]+$/;

const validateTeamName = (value) => {
  if (!value || value.trim() === "") return "Team name is required";
  if (!teamNameRegex.test(value)) return "Invalid characters in team name";
  if (value.trim().length < 2) return "Team name must be at least 2 characters";
  return "";
};

const EditTeam = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { leadData, loading, error } = useFetch(
    `https://task-pilot-backend-5sb3.onrender.com/teams/${teamId}/details`
  );

  const [team, setTeam] = useState({ name: "", description: "" });
  const [nameError, setNameError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (leadData) {
      setTeam({
        name: leadData.name || "",
        description: leadData.description || "",
      });
    }
  }, [leadData]);

  const handleUpdate = async (e) => {
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
        `https://task-pilot-backend-5sb3.onrender.com/teams/${teamId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: team.name,
            description:
              team.description.trim() === "" ? " " : team.description,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.errorMessage || "Failed to update team");

      setUpdateMessage("Team updated successfully!");
      setTimeout(() => setUpdateMessage(""), 3000);
      setTeam({ name: "", description: "" });
    } catch (err) {
      setUpdateError(err.message);
      setTimeout(() => setUpdateError(""), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-dark"></div>
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-center">
        <div>
          <i className="bi bi-exclamation-triangle-fill fs-1"></i>
          <p className="fw-semibold mt-3">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="container mb-5 px-3" style={{ marginTop: "5rem" }}>
      <div className="row justify-content-center g-4 mx-0">
        <div className="col-12 col-md-3 text-center text-md-start mb-5">
          <Link to={`/team/${teamId}`} className="btn btn-outline-dark">
            <i className="bi bi-arrow-left me-2"></i> Back
          </Link>
        </div>

        <div className="col-12 col-md-9">
          <h1 className="fw-bold mb-5 text-center text-md-start fs-5 fs-md-1">
            Edit Team
          </h1>

          <form
            className="border p-4 rounded shadow-sm"
            style={{ maxWidth: "550px" }}
            onSubmit={handleUpdate}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Update Team
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

export default EditTeam;
