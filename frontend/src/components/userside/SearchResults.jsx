import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TransportCard = ({ transport, onBook }) => {
  const handleBook = (seatType) => {
    if (transport[`${seatType.toLowerCase()}Seats`] > 0) {
      onBook(transport, seatType);
    }
  };

  return (
    <div className="transport-card">
      <div className="transport-header">
        <h3 className="transport-name">
          {transport.number} {transport.name}
        </h3>
        <span className="time">{transport.time}</span>
      </div>
      <div className="transport-timing">
        <div className="station-info">
          <p className="station">{transport.from}</p>
        </div>
        <div className="duration">
          <p className="date">{new Date(transport.date).toLocaleDateString()}</p>
        </div>
        <div className="station-info">
          <p className="station">{transport.to}</p>
        </div>
      </div>
      <div className="transport-class">
        <div className={`class-card ${transport.normalSeats === 0 ? "unavailable-card" : ""}`}>
          <p className="class-name">Normal Seats</p>
          <p className={`status ${transport.normalSeats > 0 ? "available" : "unavailable"}`}>
            {transport.normalSeats > 0 ? `${transport.normalSeats} Available` : "Not Available"}
          </p>
          <p className="price">₹{transport.normalSeatAmount || "-"}</p>
          <button disabled={transport.normalSeats === 0} onClick={() => handleBook("Normal")}>Book Normal</button>
        </div>
        {transport.mode === "bus" && (
          <div className={`class-card ${transport.sleeperSeats === 0 ? "unavailable-card" : ""}`}>
            <p className="class-name">Sleeper Seats</p>
            <p className={`status ${transport.sleeperSeats > 0 ? "available" : "unavailable"}`}>{transport.sleeperSeats > 0 ? `${transport.sleeperSeats} Available` : "Not Available"}</p>
            <p className="price">₹{transport.sleeperSeatAmount || "-"}</p>
            <button disabled={transport.sleeperSeats === 0} onClick={() => handleBook("Sleeper")}>Book Sleeper</button>
          </div>
        )}

        {transport.mode === "train" && (
          <div className={`class-card ${transport.acSeats === 0 ? "unavailable-card" : ""}`}>
            <p className="class-name">AC Seats</p>
            <p className={`status ${transport.acSeats > 0 ? "available" : "unavailable"}`}>{transport.acSeats > 0 ? `${transport.acSeats} Available` : "Not Available"}</p>
            <p className="price">₹{transport.acSeatAmount || "-"}</p>
            <button disabled={transport.acSeats === 0} onClick={() => handleBook("AC")}>Book AC</button>
          </div>
        )}

        {transport.mode === "flight" && (
          <div className={`class-card ${transport.businessSeats === 0 ? "unavailable-card" : ""}`}>
            <p className="class-name">Business Class</p>
            <p className={`status ${transport.businessSeats > 0 ? "available" : "unavailable"}`}>{transport.businessSeats > 0 ? `${transport.businessSeats} Available` : "Not Available"}</p>
            <p className="price">₹{transport.businessSeatAmount || "-"}</p>
            <button disabled={transport.businessSeats === 0} onClick={() => handleBook("Business")}>Book Business</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  const userId = localStorage.getItem("userId");

  const handleBook = (transport, seatType) => {
    navigate(userId ? "/booking" : "/adminbooking", { state: { transport, seatType } });
  };

  return (
    <div className="search-results">
      <h2 className="search-title">Search Results</h2>
      <div className="results-container">
        {results.length > 0 ? (
          results.map((transport) => (
            <TransportCard key={transport._id} transport={transport} onBook={handleBook} />
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
