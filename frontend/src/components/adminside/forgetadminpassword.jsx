import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const ForgotAdminPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ userid: "", otp: "", password: "", confirmPassword: "" });
  const [generatedOtp, setGeneratedOtp] = useState(""); // Store generated OTP for verification
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      setResendDisabled(false);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOtp = async () => {
    if (!formData.userid.trim()) {
      setError("User ID is required.");
      return;
    }

    setError("");
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setResendDisabled(true);
    setTimer(30);

    try {
      const response = await fetch("http://localhost:3000/admin/sendotpforresetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: formData.userid, otp }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Failed to send OTP.");
        setOtpSent(false);
        return;
      }

      setMessage(`OTP sent successfully!`);
    } catch (err) {
      setError("Error sending OTP.");
      setOtpSent(false);
    }
  };

  const verifyOtp = () => {
    if (formData.otp.trim() === generatedOtp.trim()) {
      setOtpVerified(true);
      setError("");
      setMessage("OTP verified successfully.");
    } else {
      setError("Invalid OTP. Try again.");
    }
  };

  const resetPassword = async () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/admin/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: formData.userid, password: formData.password }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully.");
        navigate("/AdminLogin");
      } else {
        setError(result.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("Error resetting password.");
    }
  };

  return (
    <div className="usersignup">
      <Header />
      <div className="container" style={{ marginTop: "160px", width: "320px" }}>
        <h2>Forgot Password</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" name="userid" onChange={handleChange} placeholder="Enter User ID" required />

          {!otpVerified && (
            <>
              <button type="button" onClick={sendOtp} disabled={otpSent}>
                {otpSent ? "OTP Sent" : "Send OTP"}
              </button>
              {otpSent && (
                <>
                  <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" required />
                  <button type="button" onClick={verifyOtp}>Verify OTP</button>
                  <p>Resend OTP in {timer}s</p>
                  <button type="button" onClick={sendOtp} disabled={resendDisabled}>
                    Resend OTP
                  </button>
                </>
              )}
            </>
          )}

          {otpVerified && (
            <>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter new password" required />
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" required />
              <button type="button" onClick={resetPassword}>Reset Password</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotAdminPassword;
