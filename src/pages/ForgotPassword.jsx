import { useState } from "react";
import { useNavigate } from "react-router-dom";

const emailRegex =
  /^[A-Za-z0-9]+(\.[A-Za-z0-9]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*\.(com|co|uk|in|org|net|io|co\.uk|co\.in)$/;

const ForgotPassword = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const showTempError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      return showTempError("Please enter a valid email address");
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://task-pilot-backend-sigma.vercel.app/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.toLowerCase().trim() }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      sessionStorage.setItem("forgotEmail", email.toLowerCase().trim());
      nav("/verify-forgot-otp");
    } catch (err) {
      showTempError(err.message);
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
              <h4 className="fw-bold text-center mb-5 mt-3">Forgot Password</h4>

              {error && (
                <div className="alert alert-light d-flex align-items-center mb-3">
                  <i className="bi bi-x-circle-fill me-2 text-danger"></i>
                  <span className="text-danger small">{error}</span>
                </div>
              )}

              <form onSubmit={submit}>
                <input
                  className="form-control mb-3"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button
                  className="btn btn-dark w-100 py-2"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              <div className="text-center small mt-3">
                <span className="text-muted">We’ll send OTP to your email</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
