import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminName: '',
    email: '',
    gender: '',
    aadharNo: '',
    adminId: '',
    password: '',
    confirmPassword: '',
    otp: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOtp = async () => {
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
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
        body: JSON.stringify({ gmail: formData.email, otp }),
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

  const validateInput = () => {
    if (!/^[a-zA-Z\s]+$/.test(formData.adminName)) return "Admin name should only contain letters.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Invalid email format.";
    if (!["Male", "Female", "Other"].includes(formData.gender)) return "Please select a valid gender.";
    if (!/^\d{12}$/.test(formData.aadharNo)) return "Aadhaar number must be 12 digits.";
    if (!/^[a-zA-Z0-9]+$/.test(formData.adminId)) return "Admin ID should be alphanumeric.";
    if (formData.password.length < 6) return "Password should be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      setSuccessMessage(null);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setFormData({
          adminName: '',
          email: '',
          gender: '',
          aadharNo: '',
          adminId: '',
          password: '',
          confirmPassword: '',
          otp: "",
        });
        setGeneratedOtp("");
        setOtpVerified(false);
        setOtpSent(false);
        setError(null);
      } else {
        setError(data.error || 'Failed to add new admin');
        setSuccessMessage(null);
      }
    } catch (err) {
      setError('Failed to add new admin');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="add-admin-container">
      <div className="form-card">
        <h2 className="form-title">Add New Admin</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div style={{ textAlign: "center", color: "green" }}>{successMessage}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <table className="admin-table">
            <tbody>
              <tr>
                <td><label>Admin Name</label></td>
                <td><input type="text" name="adminName" value={formData.adminName} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>Email</label></td>
                <td><input type="email" name="email" value={formData.email} onChange={handleChange} required /></td>
              </tr>
              {!otpVerified && (
                <tr>
                  <td colSpan="2" className="button-row" style={{ textAlign: "center" }}>
                    <button type="button" onClick={sendOtp} disabled={otpSent}>
                      {otpSent ? "OTP Sent" : "Send OTP"}
                    </button>

                    {otpSent && (
                      < div >
                        <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" style={{ width: "150px" }} required />
                        <button type="button" onClick={verifyOtp}>Verify OTP</button>
                        <p>Resend OTP in {timer}s</p>
                        <button type="button" onClick={sendOtp} disabled={resendDisabled}>
                          Resend OTP
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}

              <tr>
                <td><label>Gender</label></td>
                <td>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><label>Aadhaar No</label></td>
                <td><input type="text" name="aadharNo" value={formData.aadharNo} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>Admin ID</label></td>
                <td><input type="text" name="adminId" value={formData.adminId} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>Password</label></td>
                <td><input type="password" name="password" value={formData.password} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>Confirm Password</label></td>
                <td><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td colSpan="2" className="button-row" style={{ textAlign: "center" }}>
                  <button type="submit" className="submit-button">Add Admin</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
