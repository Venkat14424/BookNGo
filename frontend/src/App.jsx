import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/userside/Userlogin";
import SignUp from "./components/userside/Usersignup";
import AdminLogin from './components/adminside/Adminlogin';
import TravelSearchForm from "./components/userside/TravelSearchForm";
import SearchResults from './components/userside/SearchResults';
import BookingForm from './components/userside/BookingForm';
import AddTransport from './components/adminside/AddTransport';
import Layout from './components/Layout';
import SelectOptionPage from './components/userside/Selectoption';
import Profile from './components/userside/Userprofile';
import ChangePassword from './components/userside/Changepassword';
import ConfirmationPage from './components/userside/ConfirmationPage';
import BookedHistory from './components/userside/bookedHistory';
import AdminLayout from './components/adminside/AdminLayout';
import ChangeadminPassword from './components/adminside/changeadminpassword';
import AdminProfile from './components/adminside/adminprofile';
import EditAdmin from './components/adminside/editprofile';
import AddAdmin from './components/adminside/Addadmin';
import Updateuserprofile from './components/userside/updateuserprofile';
import PassengerEnquiry from './components/adminside/PassengerEnquiry';
import ResetPassword from './components/userside/forgetuser';
import ForgotAdminPassword from './components/adminside/forgetadminpassword';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/resetadminpassword' element={<ForgotAdminPassword />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/" element={<AdminLayout />}>
          <Route path="/changeadminpassword" element={<ChangeadminPassword />} />
          <Route path="/AddTransport" element={<AddTransport />} />
          <Route path="/adminprofile" element={<AdminProfile />} />
          <Route path="/editadminprofile" element={<EditAdmin />} />
          <Route path="/adminTravelSearchForm" element={<TravelSearchForm />} />
          <Route path="/adminsearchResults" element={<SearchResults />} />
          <Route path="/adminbooking" element={<BookingForm />} />
          <Route path="/enquiry" element={<PassengerEnquiry />} />
          <Route path='/adminconfirmation' element={<ConfirmationPage />} />
          <Route path='/adminselecttraveloption' element={<SelectOptionPage />} />
          <Route path='/addadmin' element={<AddAdmin />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route path='/Updateuserprofile' element={<Updateuserprofile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/userprofile" element={<Profile />} />
          <Route path="/TravelSearchForm" element={<TravelSearchForm />} />
          <Route path="/searchResults" element={<SearchResults />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/bookedhistory" element={<BookedHistory />} />
          <Route path='/confirmation' element={<ConfirmationPage />} />
          <Route path='/selecttraveloption' element={<SelectOptionPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;