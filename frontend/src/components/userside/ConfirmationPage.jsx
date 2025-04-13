import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const { bookingDetails } = state || {};
  const navigate = useNavigate();

  const generatePDF = () => {
    if (!bookingDetails) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Booking Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Train Name: ${bookingDetails.name}`, 20, 30);
    doc.text(`Train No: ${bookingDetails.no}`, 20, 36);
    doc.text(`From: ${bookingDetails.from}`, 20, 42);
    doc.text(`To: ${bookingDetails.to}`, 20, 48);
    doc.text(`Date: ${new Date(bookingDetails.date).toLocaleDateString()}`, 20, 54);
    doc.text(`Time: ${bookingDetails.time}`, 20, 60);
    doc.text(`Class: ${bookingDetails.Class}`, 20, 66);
    doc.text(`Passenger Name: ${bookingDetails.passengerName}`, 20, 72);
    doc.text(`Phone No: ${bookingDetails.phoneNo}`, 20, 78);
    doc.text(`DOB: ${new Date(bookingDetails.dob).toLocaleDateString()}`, 20, 84);
    doc.text(`Aadhaar No: ${bookingDetails.aadhaar}`, 20, 90);
    doc.text(`Age: ${bookingDetails.gmail}`, 20, 96);
    doc.text(`Gender: ${bookingDetails.gender}`, 20, 102);
    doc.text(`Seat No: ${bookingDetails.seatId}`, 20, 108);
    doc.text(`Amount: ₹${bookingDetails.amount}`, 20, 114);

    doc.save("ticket.pdf");
  };

  const backbutton = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/selecttraveloption");
    } else {
      navigate("/adminselecttraveloption");
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-box">
        <h2>Booking Confirmation</h2>
        {bookingDetails && (
          <>
            <div className="details">
              <p><strong>Train Name:</strong> {bookingDetails.name}</p>
              <p><strong>Train No:</strong> {bookingDetails.no}</p>
              <p><strong>From:</strong> {bookingDetails.from}</p>
              <p><strong>To:</strong> {bookingDetails.to}</p>
              <p><strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {bookingDetails.time}</p>
              <p><strong>Class:</strong> {bookingDetails.Class}</p>
              <p><strong>Passenger Name:</strong> {bookingDetails.passengerName}</p>
              <p><strong>Phone No:</strong> {bookingDetails.phoneNo}</p>
              <p><strong>Seat No:</strong> {bookingDetails.seatId}</p>
              <p><strong>Amount:</strong> ₹{bookingDetails.amount}</p>
            </div>
            <button className="download-btn" onClick={generatePDF}>Download Ticket as PDF</button>
          </>
        )}
        <button className="okay-btn" onClick={backbutton}>Okay</button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
