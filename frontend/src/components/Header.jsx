import React from "react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate =useNavigate();
  return (
    <>
      <header className="welcomepageheader">
        <h1 onClick={()=>{navigate('/')}} style={{cursor:'pointer'}}>BOOKNGO</h1>
        <div style={{marginTop:'10px',marginRight:'70px'}}>
          <button onClick={() => navigate("/signup")}>SIGN&nbsp;UP</button>
          <button onClick={() => navigate("/login")}>USER</button>
          <button onClick={() => navigate("/AdminLogin")}>ADMIN</button>
        </div>
      </header>
    </>
  );
};


export default Header;
