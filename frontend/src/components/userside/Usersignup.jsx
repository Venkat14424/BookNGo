import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    gmail: "",
    gender: "",
    dob: "",
    aadhaar: "",
    userid: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
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
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail)) {
      setError("Enter a valid Gmail address.");
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setResendDisabled(true);
    setTimer(30);

    try {
      const response = await fetch(`${backendUrl}/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail: formData.gmail, otp }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Failed to send OTP.");
        setOtpSent(false);
      } else {
        setError("");
      }
    } catch {
      setError("Error sending OTP.");
      setOtpSent(false);
    }
  };

  const verifyOtp = () => {
    if (formData.otp.trim() === generatedOtp.trim()) {
      setOtpVerified(true);
      setError("");
    } else {
      setError("Invalid OTP. Try again.");
    }
  };

  const validateForm = () => {
    if (Object.values(formData).some((val) => val.trim() === ""))
      return "All fields are required.";
    if (!otpVerified) return "OTP verification is required.";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail))
      return "Invalid Gmail address.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    if (!/^[0-9]{12}$/.test(formData.aadhaar))
      return "Aadhaar number must be 12 digits.";
    if (new Date(formData.dob) > new Date())
      return "Date of birth cannot be in the future.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        navigate("/login");
      } else {
        setError(result.error || "Signup failed.");
      }
    } catch {
      setError("Error signing up.");
    }
  };

  return (
    <div className="usersignup">
      <Header />
      <div className="container" style={{ width: "320px" }}>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
          <input name="gmail" value={formData.gmail} onChange={handleChange} placeholder="Gmail" required />
          {!otpVerified && (
            <>
              <button type="button" onClick={sendOtp} disabled={otpSent}>{otpSent ? "OTP Sent" : "Send OTP"}</button>
              {otpSent && (
                <>
                  <input name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" required />
                  <button type="button" onClick={verifyOtp}>Verify OTP</button>
                  <p>Resend OTP in {timer}s</p>
                  <button type="button" onClick={sendOtp} disabled={resendDisabled}>Resend OTP</button>
                </>
              )}
            </>
          )}
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} placeholder="Aadhaar Number" required />
          <input name="userid" value={formData.userid} onChange={handleChange} placeholder="User ID" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
          <button type="submit" disabled={!otpVerified}>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
