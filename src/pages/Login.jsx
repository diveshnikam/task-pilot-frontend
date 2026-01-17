import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const emailRegex =
  /^[A-Za-z0-9]+(\.[A-Za-z0-9]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*\.(com|co|uk|in|org|net|io|co\.uk|co\.in)$/;

const Login = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      nav("/app");
    }
  }, []);

  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (v) => {
    if (!v) return "Email is required";
    if (!emailRegex.test(v)) return "Invalid email format";
    return "";
  };

  const isValid = email.trim() && password.trim() && !emailError;

  const submit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setFormError("Please correct all highlighted fields before submitting.");
      setTimeout(() => setFormError(""), 3500);
      return;
    }

    try {
      setLoading(true);
      setServerError("");

      const res = await fetch(
        "https://task-pilot-backend-5sb3.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      nav("/app");
    } catch (err) {
      setServerError(err.message || "Network error. Please try again.");
      setTimeout(() => setServerError(""), 3500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="card shadow border-0 p-4 rounded-4">
              <h3 className="fw-bold mb-4 text-center">Login</h3>

              {formError && (
                <div className="alert alert-light d-flex align-items-center mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-3 text-danger"></i>
                  <span className="text-danger">{formError}</span>
                </div>
              )}

              {serverError && (
                <div className="alert alert-light d-flex align-items-center mb-3">
                  <i className="bi bi-x-circle-fill me-2 text-danger"></i>
                  <span className="text-danger">{serverError}</span>
                </div>
              )}

              <form onSubmit={submit}>
                <input
                  className={`form-control mb-1 ${emailError && "is-invalid"}`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(validateEmail(e.target.value));
                  }}
                  required
                />
                {emailError && (
                  <small className="text-danger">{emailError}</small>
                )}

                <input
                  type="password"
                  className={`form-control mt-3 mb-1`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />

                <button
                  className="btn btn-dark w-100 mt-4 py-2"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="text-center small mt-4">
                <div>
                  Don’t have an account?{" "}
                  <Link to="/signup">Create account</Link>
                </div>
                <div className="mt-2">
                  Forgot password? <Link to="/forgot-password">Reset</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
