import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const UseradminHeader = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <div className="mainheader">
        <h1>BOOKNGO</h1>
        <svg fill="#ededed" width="64px" height="64px" viewBox="-3.06 -3.06 36.71 36.71" xmlns="http://www.w3.org/2000/svg" stroke="#ededed" stroke-width="0.5505479999999999"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(-546.269 -195.397)"> <path d="M572.138,221.245a15.738,15.738,0,0,0-21.065-.253l-1.322-1.5a17.738,17.738,0,0,1,23.741.28Z"></path> <path d="M561.464,204.152a4.96,4.96,0,1,1-4.96,4.96,4.966,4.966,0,0,1,4.96-4.96m0-2a6.96,6.96,0,1,0,6.96,6.96,6.96,6.96,0,0,0-6.96-6.96Z"></path> <path d="M561.562,197.4a13.293,13.293,0,1,1-13.293,13.293A13.308,13.308,0,0,1,561.562,197.4m0-2a15.293,15.293,0,1,0,15.293,15.293A15.293,15.293,0,0,0,561.562,195.4Z"></path> </g> </g></svg></div>
      <div className="homepage">
        <nav className="userlinks">
          <Link to={'/SelectOptionPage'}>home</Link>
          <Link>profile</Link>
          <Link to="/TravelSearchForm" state={{ selectedOption: "flight" }}>book flight</Link>
          <Link to="/TravelSearchForm" state={{ selectedOption: "bus" }}>book bus</Link>
          <Link to="/TravelSearchForm" state={{ selectedOption: "train" }}>book train</Link>
          <Link>change password</Link>
          <Link> history</Link>
          <Link onClick={() => setShowPopup(!showPopup)}>logout</Link>
        </nav>
      </div>
    </>
  );
}
export default UseradminHeader;