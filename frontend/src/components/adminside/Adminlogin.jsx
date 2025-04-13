import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

function AdminLogin() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  localStorage.setItem("adminId", adminId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: adminId,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        navigate("/adminselecttraveloption");
      } else {
        setError(data.error || "An error occurred during login.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="useradminlogin">
      <Header />
      <div className="container">
        <h2>admin login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" id="adminId" value={adminId} onChange={(e) => setAdminId(e.target.value)} placeholder="AdminId" required />
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <a style={{ marginLeft: "120px", fontSize: "13px", color: "blue" }} onClick={() => navigate("/resetadminpassword")}>Forgot Password?</a>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
