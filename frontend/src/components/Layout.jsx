import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import './userside/userstyles.css'
const Layout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
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
            <li><Link to="/selecttraveloption">HOME</Link></li>
            <li><Link to="/userprofile">PROFILE</Link></li>
            <li><Link to="/TravelSearchForm" state={{ selectedOption: "bus" }}>BOOK BUS</Link></li>
            <li><Link to="/TravelSearchForm" state={{ selectedOption: "train" }}>BOOK TRAIN</Link></li>
            <li><Link to="/TravelSearchForm" state={{ selectedOption: "flight" }}>BOOK FLIGHT</Link></li>
            <li><Link to="/bookedhistory">BOOKED HISTORY</Link></li>
            <li><Link to="/Updateuserprofile">UPDATE PROFILE</Link></li>
            <li><Link to="/changepassword">CHANGE PASSWORD</Link></li>
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

export default Layout;
