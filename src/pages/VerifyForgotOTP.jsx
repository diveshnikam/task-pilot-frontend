import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const VerifyForgotOTP = () => {
  const nav = useNavigate();
  const email = sessionStorage.getItem("forgotEmail");

  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [success, setSuccess] = useState(false);

  const resendLock = useRef(false);

  const showTempInfo = (msg) => {
    setInfo(msg);
    setTimeout(() => setInfo(""), 3000);
  };

  const showTempError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  const validatePassword = (v) => {
    if (!v) return "Password is required";
    if (!passwordRegex.test(v))
      return "Min 8 chars, 1 uppercase, 1 number, 1 special";
    return "";
  };

  const loadExpiry = async () => {
    try {
      const res = await fetch(
        `https://task-pilot-backend-sigma.vercel.app/auth/forgot-otp-expiry?email=${email}`
      );
      const data = await res.json();

      if (!res.ok || !data.expiresAt) throw new Error("OTP expired or invalid");

      setTimeLeft(Math.floor((new Date(data.expiresAt) - new Date()) / 1000));
      showTempInfo("OTP has been sent to your email.");
    } catch (err) {
      showTempError(
        err.message || "Something went wrong. Redirecting to login..."
      );

      setTimeout(() => {
        sessionStorage.clear();
        nav("/");
      }, 2500);
    }
  };

  useEffect(() => {
    if (!email) return nav("/");
    loadExpiry();

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          sessionStorage.clear();
          nav("/");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCanResend(timeLeft <= 120 && timeLeft > 0);
  }, [timeLeft]);

  const verifyOTP = async () => {
    if (!otp) return showTempError("OTP is required");

    try {
      setLoading(true);
      const res = await fetch(
        "https://task-pilot-backend-sigma.vercel.app/auth/verify-forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otp.trim() }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setVerified(true);
      showTempInfo("OTP verified. Set your new password.");
    } catch (err) {
      showTempError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (passwordError) return showTempError(passwordError);
    if (newPassword !== confirm) return showTempError("Passwords do not match");

    try {
      setLoading(true);
      const res = await fetch(
        "https://task-pilot-backend-sigma.vercel.app/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      sessionStorage.clear();
      setSuccess(true);
      showTempInfo("Password reset successful. Redirecting to login...");
      setTimeout(() => nav("/"), 2000);
    } catch (err) {
      showTempError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendLock.current) return;
    if (!canResend) return showTempError("Please wait before resending OTP.");

    resendLock.current = true;
    setCanResend(false);

    try {
      setLoading(true);
      const res = await fetch(
        "https://task-pilot-backend-sigma.vercel.app/auth/resend-forgot-password-otp",
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
      <div className="w-100 px-2 px-sm-0" style={{ maxWidth: 400 }}>
        <div className="card shadow border-0 p-3 p-sm-4 rounded-4">
          {!verified && <h4 className="text-center mb-3">Verify OTP</h4>}

          {info && <div className="alert alert-success small">{info}</div>}
          {error && <div className="alert alert-danger small">{error}</div>}

          {!verified && (
            <>
              <input
                className="form-control mb-3"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                className="btn btn-success w-100 mb-2"
                onClick={verifyOTP}
                disabled={loading}
              >
                Verify OTP
              </button>

              <p className="text-center small mb-3">
                OTP expires in{" "}
                <b>
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </b>
              </p>

              <button
                className="btn btn-light w-100"
                disabled={!canResend || loading}
                onClick={resendOTP}
              >
                Resend OTP
              </button>

              <p className="text-center small mt-3">
                Didn’t receive OTP? Resend activates after 1 minute.
              </p>
            </>
          )}

          {verified && !success && (
            <div className=" pt-3 mt-3">
              <h5 className="text-center mb-5">Reset Password</h5>

              <input
                type="password"
                className={`form-control mb-1 ${passwordError && "is-invalid"}`}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError(validatePassword(e.target.value));
                }}
              />
              {passwordError && (
                <small className="text-danger">{passwordError}</small>
              )}

              <input
                type="password"
                className="form-control mb-3 mt-3"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <button
                className="btn btn-dark w-100 mt-2"
                onClick={resetPassword}
                disabled={loading}
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyForgotOTP;
