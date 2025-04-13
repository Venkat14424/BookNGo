import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

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
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail)) {
      setError("Enter a valid Gmail address.");
      return;
    }

    setError("");
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setResendDisabled(true);
    setTimer(30);

    try {
      const response = await fetch("http://localhost:3000/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail: formData.gmail, otp }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Failed to send OTP.");
        setOtpSent(false);
        return;
      }
    } catch (err) {
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
    if (Object.values(formData).some((value) => value.trim() === "")) {
      return "All fields are required.";
    }
    if (!otpVerified) {
      return "OTP verification is required.";
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail)) {
      return "Enter a valid Gmail address.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    if (!/^[0-9]{12}$/.test(formData.aadhaar)) {
      return "Aadhaar number must be exactly 12 digits.";
    }
    
    const today = new Date();
    const inputDate = new Date(formData.dob);
    if (inputDate > today) return "Date cannot be in the past.";
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
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        setError(result.error || "Signup failed.");
      }
    } catch (err) {
      setError("Error signing up.");
    }
  };

  return (
    <div className="usersignup">
      <Header />
      <div className="container" style={{ width: "320px" }}>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} >
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
          <input type="text" name="gmail" value={formData.gmail} onChange={handleChange} placeholder="Gmail" required />

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
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} placeholder="Aadhaar Number" required />
          <input type="text" name="userid" value={formData.userid} onChange={handleChange} placeholder="User ID" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />

          <button type="submit" disabled={!otpVerified}>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
