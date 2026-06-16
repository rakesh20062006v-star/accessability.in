import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Fpass.css";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

// ─── Step indicators ───────────────────────────────────────────────────────
function StepDots({ step }) {
  return (
    <div className="fpass-steps">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`fpass-step-dot ${s === step ? "active" : s < step ? "done" : ""}`}
        />
      ))}
    </div>
  );
}

// ─── Step 1: Enter Email ───────────────────────────────────────────────────
function StepEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email");

    setLoading(true);
    try {
      await axios.post(`${API}/forgot-password`, { email });
      toast.success("OTP sent! Check your email 📬");
      onNext(email);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fpass-icon">🔐</div>
      <h1 className="fpass-title">Forgot Password?</h1>
      <p className="fpass-subtitle">
        Enter your registered email and we'll send you a 6-digit OTP.
      </p>

      <StepDots step={1} />

      <form onSubmit={handleSubmit}>
        <input
          id="fp-email"
          className="fpass-input"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <button id="fp-send-otp" className="fpass-btn" type="submit" disabled={loading}>
          {loading ? "Sending OTP…" : "Send OTP"}
        </button>
      </form>
    </>
  );
}

// ─── Step 2: Verify OTP ────────────────────────────────────────────────────
function StepOTP({ email, onNext, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) return toast.error("Please enter the full 6-digit OTP");

    setLoading(true);
    try {
      await axios.post(`${API}/verify-otp`, { email, otp: otpString });
      toast.success("OTP verified ✅");
      onNext();
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await axios.post(`${API}/forgot-password`, { email });
      toast.info("New OTP sent 📬");
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to resend OTP");
    }
  };

  return (
    <>
      <div className="fpass-icon">📨</div>
      <h1 className="fpass-title">Check Your Email</h1>
      <p className="fpass-subtitle">
        We sent a 6-digit OTP to <strong style={{ color: "#fcd34d" }}>{email}</strong>
      </p>

      <StepDots step={2} />

      <div className="otp-row" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-box-${i}`}
            ref={(el) => (inputRefs.current[i] = el)}
            className="otp-box"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            autoFocus={i === 0}
          />
        ))}
      </div>

      {resendCooldown > 0 && (
        <p className="fpass-timer">Resend OTP in {resendCooldown}s</p>
      )}

      <button id="fp-verify-otp" className="fpass-btn" onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying…" : "Verify OTP"}
      </button>

      <button
        className="fpass-resend"
        onClick={handleResend}
        disabled={resendCooldown > 0}
      >
        Resend OTP
      </button>

      <button className="fpass-back" onClick={onBack}>
        ← Back
      </button>
    </>
  );
}

// ─── Step 3: Reset Password ────────────────────────────────────────────────
function StepReset({ email, onDone }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirm)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await axios.post(`${API}/reset-password`, { email, newPassword });
      toast.success("Password reset successful 🎉");
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fpass-icon">🔑</div>
      <h1 className="fpass-title">New Password</h1>
      <p className="fpass-subtitle">
        Choose a strong password for your account.
      </p>

      <StepDots step={3} />

      <form onSubmit={handleReset}>
        <input
          id="fp-new-password"
          className="fpass-input"
          type={showPw ? "text" : "password"}
          placeholder="New password (min 6 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoFocus
        />
        <input
          id="fp-confirm-password"
          className="fpass-input"
          type={showPw ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "white",
            marginBottom: 16,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          <input
            type="checkbox"
            checked={showPw}
            onChange={() => setShowPw(!showPw)}
          />
          Show Password
        </label>

        <button id="fp-reset-submit" className="fpass-btn" type="submit" disabled={loading}>
          {loading ? "Resetting…" : "Reset Password"}
        </button>
      </form>
    </>
  );
}

// ─── Step 4: Success Screen ────────────────────────────────────────────────
function StepSuccess({ navigate }) {
  useEffect(() => {
    const t = setTimeout(() => navigate("/auth/login"), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="fpass-success">
      <span className="fpass-success-icon">✅</span>
      <h1 className="fpass-title">All Done!</h1>
      <p className="fpass-subtitle">
        Your password has been reset successfully.
        <br />
        Redirecting you to login…
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
function Fpass() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <div className="fpass-wrapper">
      <div className="fpass-card">
        {step === 1 && (
          <StepEmail
            onNext={(mail) => {
              setEmail(mail);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StepOTP
            email={email}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepReset
            email={email}
            onDone={() => setStep(4)}
          />
        )}

        {step === 4 && <StepSuccess navigate={navigate} />}

        {step !== 4 && step !== 2 && (
          <button className="fpass-back" onClick={() => navigate("/auth/login")}>
            ← Back to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Fpass;