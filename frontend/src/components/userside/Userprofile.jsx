import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/details/${userId}`);
        const result = await response.json();

        if (response.ok) {
          setUserDetails(result);
        } else {
          setError(result.error || "Error fetching user details.");
        }
      } catch (err) {
        setError("Error fetching user details.");
      }
    };

    fetchUserDetails();
  }, [navigate, userId]);

  return (
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {userDetails ? (
        <table className="profile-table">
          <tbody>
            <tr>
              <td><strong>Username:</strong></td>
              <td>{userDetails.username}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{userDetails.gmail}</td>
            </tr>
            <tr>
              <td><strong>Gender:</strong></td>
              <td>{userDetails.gender}</td>
            </tr>
            <tr>
              <td><strong>Date of Birth:</strong></td>
              <td>{new Date(userDetails.dob).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td><strong>Aadhaar:</strong></td>
              <td>{userDetails.aadhaar}</td>
            </tr>
            <tr>
              <td><strong>User ID:</strong></td>
              <td>{userDetails.userid}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default Profile;
