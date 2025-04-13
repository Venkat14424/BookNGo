import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    navigate("/");
  };
  return (
    <div className="layout">
      <header className="header">
        <h1>BOOKNGO</h1>
      </header>
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link to="/adminselecttraveloption">HOME</Link></li>
            <li><Link to="/adminprofile">PROFILE</Link></li>
            <li><Link to="/adminTravelSearchForm" state={{ selectedOption: "bus" }}>BOOK BUS</Link></li>
            <li><Link to="/adminTravelSearchForm" state={{ selectedOption: "train" }}>BOOK TRAIN</Link></li>
            <li><Link to="/adminTravelSearchForm" state={{ selectedOption: "flight" }}>BOOK FLIGHT</Link></li>
            <li><Link to="/AddTransport" state={{ selectedOption: "train" }}>ADD TRAIN</Link></li>
            <li><Link to="/AddTransport" state={{ selectedOption: "bus" }}>ADD BUS</Link></li>
            <li><Link to="/AddTransport" state={{ selectedOption: "flight" }}>ADD FLIGHT</Link></li>
            <li><Link to="/enquiry">PASSENGER ENQUIRY</Link></li>
            <li><Link to="/addadmin">ADD NEW ADMIN</Link></li>
            <li><Link to="/editadminprofile">EDIT PROFILE</Link></li>
            <li><Link to="/changeadminpassword">CHANGE PASSWORD</Link></li>
            <li onClick={() => setShowLogoutModal(true)}><a href="#">LOGOUT</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
      {showLogoutModal && (
        <div className="popup1" onClick={() => setShowLogoutModal(false)}>
          <div className="popup-con1">
            <h2>Are you sure you want to logout?</h2>
            <div className="yesnobuttton">
              <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
