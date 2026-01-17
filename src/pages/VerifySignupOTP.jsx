import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const VerifySignupOTP = () => {
  const nav = useNavigate();
  const email = localStorage.getItem("signupEmail");

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const resendLock = useRef(false);

  const showTempInfo = (msg) => {
    setInfo(msg);
    setTimeout(() => setInfo(""), 3000);
  };

  const showTempError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const loadExpiry = async () => {
    try {
      const res = await fetch(
        `https://task-pilot-backend-sigma.vercel.app/auth/otp-expiry?email=${email}`
      );
      const data = await res.json();

      if (!res.ok || !data.expiresAt) throw new Error("OTP expired or invalid");

      const remaining = Math.floor(
        (new Date(data.expiresAt) - new Date()) / 1000
      );

      setTimeLeft(remaining);
      showTempInfo("OTP has been sent to your email.");
    } catch (err) {
      showTempError(err.message || "Session expired. Redirecting to signup...");

      setTimeout(() => {
        localStorage.removeItem("signupEmail");
        nav("/signup");
      }, 2500);
    }
  };

  useEffect(() => {
    if (!email) return nav("/signup");

    loadExpiry();

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          showTempInfo("OTP expired. Redirecting to signup...");
          setTimeout(() => nav("/signup"), 2000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 120 && timeLeft > 0) {
      setCanResend(true);
    } else {
      setCanResend(false);
    }
  }, [timeLeft]);

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return showTempError("OTP is required");

    try {
      setLoading(true);
      setError("");
      setInfo("");

      const res = await fetch(
        "https://task-pilot-backend-sigma.vercel.app/auth/verify-signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otp.trim() }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showTempInfo("OTP verified successfully. Redirecting to login...");

      localStorage.removeItem("signupEmail");

      setTimeout(() => nav("/"), 1500);
    } catch (err) {
      showTempError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendLock.current) return;

    if (!canResend) {
      showTempError("Please wait before resending OTP.");
      return;
    }

    resendLock.current = true;
    setCanResend(false);

    try {
      setLoading(true);
      setError("");
      setInfo("");

      const res = await fetch(
        "https://task-pilot-backend-sigma.vercel.app/auth/resend-signup-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showTempInfo("New OTP sent to your email.");

      loadExpiry();
    } catch (err) {
      showTempError(err.message);
    } finally {
      setLoading(false);
      resendLock.current = false;
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="bg-white rounded-4 shadow-lg p-4 p-sm-5">
              <form onSubmit={verifyOTP}>
                <h4 className="text-center mb-3">Verify Email</h4>

                {info && (
                  <div className="alert alert-success text-center small">
                    {info}
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger text-center small">
                    {error}
                  </div>
                )}

                <input
                  className="form-control mb-3 mt-5"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <p className="text-center small mt-4 mb-4">
                  OTP expires in{" "}
                  <b>
                    {Math.floor(timeLeft / 60)}:
                    {String(timeLeft % 60).padStart(2, "0")}
                  </b>
                </p>

                <button
                  className="btn btn-success w-100 mb-2"
                  disabled={loading}
                >
                  Verify OTP
                </button>

                <button
                  type="button"
                  className="btn btn-light w-100 mt-2"
                  disabled={!canResend || loading}
                  onClick={resendOTP}
                >
                  Resend OTP
                </button>

                <p className="text-center small mt-3">
                  Didn’t receive OTP? Resend activates after 1 minute.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifySignupOTP;
