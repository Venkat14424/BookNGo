import React, { useState } from 'react';

const PassengerEnquiry = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState(null);

  const handleSearch = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      setBookings(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/booking/search/${phone}`);

      if (!response.ok) {
        throw new Error("No bookings found for this phone number.");
      }

      const data = await response.json();
      if (data.length === 0) {
        throw new Error("No bookings available.");
      }

      setBookings(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setBookings(null);
    }
  };

  return (
    <>
      <div className="container">
        <h2>Passenger Enquiry</h2>

        {error && <p className="error-message">{error}</p>}

        <div>
          <input type="text" name="phone-number" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/, ""))} className="input-phone" placeholder="Enter 10-digit phone number" maxLength="10" required />
        </div>

        <button onClick={handleSearch} className="button-search">
          Search
        </button>
      </div>

      {bookings && bookings.length > 0 && (
        <div className="allTickets">
          <div className="booking-tickets">
            {bookings.map((booking, index) => (
              <div key={booking._id} className="booking-detail-item">
                <h2>Ticket {index + 1}</h2>
                <p><strong>From:</strong> {booking.from}</p>
                <p><strong>To:</strong> {booking.to}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Amount:</strong> {booking.amount}</p>
                <p><strong>Mode:</strong> {booking.mode}</p>
                <p><strong>Seat:</strong> {booking.seatId}</p>
                <p><strong>Class:</strong> {booking.Class}</p>
                <p><strong>Passenger Name:</strong> {booking.passengerName}</p>
                <p><strong>Phone No:</strong> {booking.phoneNo}</p>
                <p><strong>Date of Birth:</strong> {new Date(booking.dob).toLocaleDateString()}</p>
                <p><strong>Aadhaar:</strong> {booking.aadhaar}</p>
                <p><strong>gmail:</strong> {booking.gmail}</p>
                <p><strong>Gender:</strong> {booking.gender}</p>
                <p><strong>Booked Date:</strong> {new Date(booking.bookingDateTime).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PassengerEnquiry;
