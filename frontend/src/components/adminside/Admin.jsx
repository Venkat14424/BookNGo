import { useNavigate } from "react-router-dom";

function AdminEnquiry() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h1>Admin Enquiry</h1>
      <button onClick={() => navigate("/passengerEnquiry")}>Passenger Enquiry</button>
      <button onClick={() => navigate("/TravelSearchForm")}>Train, Bus, Flight Enquiry</button>
    </div>
  );
}

export default AdminEnquiry;
