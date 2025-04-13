import React, { useState, useEffect } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const BookingForm = () => {
  const location = useLocation();
  const user = localStorage.getItem("userId") || localStorage.getItem("adminId");
  const user1 = localStorage.getItem("userId");
  const { transport, seatType } = location.state || {};
  const [formData, setFormData] = useState({
    from: transport?.from || "",
    to: transport?.to || "",
    time: transport?.time || "",
    date: transport?.date ? new Date(transport.date).toISOString().split("T")[0] : "",
    amount:
      seatType === "AC"
        ? transport?.acSeatAmount
        : seatType === "Sleeper"
        ? transport?.sleeperSeatAmount
        : seatType === "Business"
        ? transport?.businessSeatAmount
        : transport?.normalSeatAmount || "",
    mode: transport?.mode || "",
    name: transport?.name || "",
    no: transport?.number || "",
    Class: seatType || "",
    passengerName: "",
    phoneNo: "",
    dob: "",
    aadhaar: "",
    gmail: "",
    gender: "",
    bookingDateTime: "",
    seatId: "",
    userId: user,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (transport && seatType) {
      setFormData((prev) => ({ ...prev, seatId: generateSeatNo() }));
    }
  }, [transport, seatType]);

  const navigate = useNavigate();

  const handlePaymentDone = async (e) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const currentDateTime = new Date().toISOString();
    const formattedDate = formData.date ? new Date(formData.date).toISOString().split("T")[0] : "";
    const updatedFormData = { ...formData, date: formattedDate, bookingDateTime: currentDateTime, seatId: generateSeatNo() };

    try {
      const response = await fetch("http://localhost:3000/booking/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit the booking");
      }

      const seatUpdateData = {
        from: transport.from,
        to: transport.to,
        date: transport.date,
        number: transport.number,
        seatType: seatType,
        mode:transport.mode,
      };

      const response1 = await fetch("http://localhost:3000/transport/decreaseseat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seatUpdateData),
      });

      if (!response1.ok) {
        const errorData = await response1.json();
        throw new Error(errorData.error || "Failed to decrease seats");
      }
      if (user1) {
        navigate("/confirmation", { state: { bookingDetails: formData } });
      } else {
        navigate("/adminconfirmation", { state: { bookingDetails: formData } });
      }

    } catch (error) {
      setErrorMessage(`Booking failed! Please try again. Error: ${error.message}`);
    }
  };

  const generateSeatNo = () => {
    let seatId = "";
    if (!transport) return "";

    switch (transport.mode) {
      case "bus":
        seatId = `Bus - Row ${Math.floor(Math.random() * 20) + 1}, Seat ${Math.floor(Math.random() * 2) + 1}`;
        break;
      case "train":
        seatId = `Train - Row ${Math.floor(Math.random() * 15) + 1}, Seat ${Math.floor(Math.random() * 3) + 1}`;
        break;
      case "flight":
        seatId = `Flight - Row ${Math.floor(Math.random() * 30) + 1}, Seat ${Math.floor(Math.random() * 3) + 1}`;
        break;
      default:
        seatId = "Seat not assigned";
    }
    return seatId;
  };
  const validateInput = () => {
    if (!formData.passengerName.trim()) return "Passenger name is required.";
    if (!/^[6-9]\d{9}$/.test(formData.phoneNo)) return "Invalid phone number.";
    if (!formData.dob) return "Date of birth is required.";
    if (!/\d{12}$/.test(formData.aadhaar)) return "Aadhaar number must be 12 digits.";
    if (!formData.gender) return "Gender is required.";
    if (!/\S+@\S+\.\S+/.test(formData.gmail)) return "Invalid Gmail address.";
    const today = new Date();
    const inputDate = new Date(formData.dob);
    if (inputDate > today) return "Date can be in the past.";

    return "";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setShowQR(true); 
  };

  return (
    <div className="booking-form">
      {!showQR ? (
        <form onSubmit={handleSubmit}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <h2>Enter Passenger Details</h2>
          <table>
            <tbody>
              <tr>
                <td><label>From:</label></td>
                <td><input type="text" value={formData.from} readOnly /></td>
                <td><label>To:</label></td>
                <td><input type="text" value={formData.to} readOnly /></td>
              </tr>
              <tr>
                <td><label>Time:</label></td>
                <td><input type="text" value={formData.time} readOnly /></td>
                <td><label>Date:</label></td>
                <td><input type="text" value={formData.date} readOnly /></td>
              </tr>
              <tr>
                <td><label>Class :</label></td>
                <td><input type="text" value={seatType} readOnly /></td>
                <td><label>Amount:</label></td>
                <td><input type="text" value={`₹${formData.amount}`} readOnly /></td>
              </tr>
              <tr>
                <td><label>Passenger Name:</label></td>
                <td><input type="text" name="passengerName" value={formData.passengerName} onChange={handleChange} required /></td>
                <td><label>Phone No:</label></td>
                <td><input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>DOB:</label></td>
                <td><input type="date" name="dob" value={formData.dob} onChange={handleChange} required /></td>
                <td><label>Gmail:</label></td>
                <td><input type="email" name="gmail" value={formData.gmail} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td><label>Aadhaar:</label></td>
                <td><input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} required /></td>
                <td><label>Gender:</label></td>
                <td>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Pay</button>
        </form>
      ) : (
        <form className="qr-section">
          <h3>Scan QR Code to Pay ₹{formData.amount}</h3>
          <QRCode value={`upi://pay?pa=7981108414@ybl&pn=BookNGo&mc=&tid=&tr=&tn=TicketBooking&am=${formData.amount}&cu=INR`} />
          <h4>After completing payment, click on verify</h4>
          <button className="verifybutton" onClick={handlePaymentDone}>
            Payment Done
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
