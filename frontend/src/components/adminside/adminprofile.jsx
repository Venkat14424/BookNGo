import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      setError("No admin found");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/admin/${adminId}/profile`)
      .then((response) =>
        response.json())
      .then((data) => {
        console.log(data);
        setAdminProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch admin profile");
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Admin Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {adminProfile ? (
        <table className="profile-table">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{adminProfile.adminName}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{adminProfile.email}</td>
            </tr>
            <tr>
              <td><strong>Gender:</strong></td>
              <td>{adminProfile.gender}</td>
            </tr>
            <tr>
              <td><strong>Aadhaar:</strong></td>
              <td>{adminProfile.aadharNo}</td>
            </tr>
            <tr>
              <td><strong>Admin ID:</strong></td>
              <td>{adminProfile.adminId}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>

  );
};

export default AdminProfile;
