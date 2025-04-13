import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId || !password) {
      setError("Please enter both User ID and Password.");
      return;
    }
    setError("");
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userId, password }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("userId", userId);
        navigate("/selecttraveloption");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("Error logging in.");
    }
  };

  return (
    <div className="useradminlogin">
      <Header />
      <div className="container">
        <h2>User Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="User ID" onChange={(e) => setUserId(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <a style={{ marginLeft: "120px", fontSize: "13px", color: "blue" }} onClick={() => navigate("/resetpassword")}>Forgot Password?</a>
          <button type="submit" style={{marginBottom:"20px"}}>Login</button>
        </form>
        <a>
          <a style={{ color: "blue" }} onClick={() => navigate("/signup")}><u>Signup</u></a>
        </a>
      </div>
    </div>
  );
};

export default Login;
