import React, { useState } from "react";

const ChangeadminPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      setMessage("Admin ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/admin/${adminId}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password.");
      }

      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.message || "Error updating password.");
    }
  };

  return (
    <div className="container">
      <h2>Change Password</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input  type="password" placeholder="Current Password" value={currentPassword}  onChange={(e) => setCurrentPassword(e.target.value)}  required />
        <input  type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}required/>
        <input type="password"  value={confirmPassword} placeholder="Confirm New Password"  onChange={(e) => setConfirmPassword(e.target.value)}  required />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ChangeadminPassword;
