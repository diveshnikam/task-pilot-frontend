import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const emailRegex =
  /^[A-Za-z0-9]+(\.[A-Za-z0-9]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*\.(com|co|uk|in|org|net|io|co\.uk|co\.in)$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const nameRegex = /^[A-Za-z ]{2,}$/;

const Signup = () => {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateName = (v) => {
    if (!v.trim()) return "Name is required";
    if (!nameRegex.test(v)) return "Only letters allowed (min 2)";
    return "";
  };

  const validateEmail = (v) => {
    if (!v) return "Email is required";
    if (!emailRegex.test(v)) return "Invalid email format";
    return "";
  };

  const validatePassword = (v) => {
    if (!v) return "Password is required";
    if (!passwordRegex.test(v))
      return "Min 8 chars, 1 uppercase, 1 number, 1 special";
    return "";
  };

  const isValid =
    name && email && password && !nameError && !emailError && !passwordError;

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
        "https://task-pilot-backend-sigma.vercel.app/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.error || "Server error. Please try again.");
      }

      localStorage.setItem("signupEmail", email.toLowerCase().trim());
      nav("/verify-signup-otp");
    } catch (err) {
      setLoading(false);
      setServerError(err.message || "Network error. Please check connection.");
      setTimeout(() => setServerError(""), 3500);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="bg-white rounded-4 shadow-lg p-4 p-sm-5">
              <h3 className="fw-bold mb-5 mt-5 text-center">Create Account</h3>

              {formError && (
                <div
                  className="alert alert-light d-flex align-items-center mb-5"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-3 text-dark"></i>
                  <span className="text-dark">{formError}</span>
                </div>
              )}

              {serverError && (
                <div
                  className="alert alert-light d-flex align-items-center mb-5"
                  role="alert"
                >
                  <i className="bi bi-x-circle-fill me-2 text-dark"></i>
                  <span className="text-dark">{serverError}</span>
                </div>
              )}

              <form onSubmit={submit}>
                <input
                  className={`form-control mb-1 ${nameError && "is-invalid"}`}
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(validateName(e.target.value));
                  }}
                  required
                />
                {nameError && (
                  <small className="text-danger">{nameError}</small>
                )}

                <input
                  className={`form-control mt-3 mb-1 ${
                    emailError && "is-invalid"
                  }`}
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
                  className={`form-control mt-3 mb-1 ${
                    passwordError && "is-invalid"
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(validatePassword(e.target.value));
                  }}
                  required
                />
                {passwordError && (
                  <small className="text-danger">{passwordError}</small>
                )}

                <button className="btn btn-dark w-100 mt-4" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              <p className="text-center mt-3 small">
                Already have an account? <Link to="/">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
