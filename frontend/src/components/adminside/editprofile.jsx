import React, { useState, useEffect } from "react";

const EditAdmin = () => {
  const [adminData, setAdminData] = useState({
    adminId: "",
    adminName: "",
    email: "",
    gender: "",
    aadharNo: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updated, setupdated] = useState(false);

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");

    if (!adminId) {
      setError("No admin ID found. Please log in again.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/admin/${adminId}/profile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setAdminData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch admin data");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { adminName, email, gender, aadharNo } = adminData;

    if (!adminName.trim()) return "Admin Name is required.";
    if (!email.trim() || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email))
      return "Enter a valid email address.";
    if (!gender) return "Please select a gender.";
    if (!/^\d{12}$/.test(aadharNo)) return "Aadhar Number must be 12 digits.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const storedAdminId = localStorage.getItem("adminId");
    if (!storedAdminId) {
      setError("Admin ID missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/admin/${storedAdminId}/editprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newAdminId: adminData.adminId,
          adminName: adminData.adminName,
          email: adminData.email,
          gender: adminData.gender,
          aadharNo: adminData.aadharNo
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }
      if (storedAdminId !== adminData.adminId) {
        localStorage.setItem("adminId", adminData.adminId);
      }
      setupdated(true)
      setTimeout(() => {
        setupdated(false)
      }, 3000);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update profile.");

    }
  };

  if (loading) {
    return <div className="loading-text">Loading...</div>;
  }

  return (
    <div className="edit-admin-container">
      <div className="form-card">
        <h2 className="form-title">Edit Admin Profile</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <table className="admin-table">
            <tbody>
              <tr>
                <td><label>Admin ID:</label></td>
                <td><input type="text" name="adminId" value={adminData.adminId} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>Name:</label></td>
                <td><input type="text" name="adminName" value={adminData.adminName} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>Email:</label></td>
                <td><input type="email" name="email" value={adminData.email} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>Gender:</label></td>
                <td>
                  <select name="gender" value={adminData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><label>Aadhar No:</label></td>
                <td><input type="text" name="aadharNo" value={adminData.aadharNo} onChange={handleChange} required maxLength="12" /></td>
              </tr>

            </tbody>
          </table>
          <button type="submit" className="submit-button">Update Admin</button>
          {updated && <h4 style={{ color: "green" }}>profile update successfully</h4>}
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;
