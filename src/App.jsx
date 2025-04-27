import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
 
import React, {useEffect} from 'react'
import Home from './pages/Home'
import All_hotels from  './pages/Hotel/All_hotels'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ReviewList from './pages/Review/ReviewList';
import ReviewDetail from './pages/Review/ReviewDetail';
import HotelReviews from './pages/Review/HotelReviews';
import AddReview from './pages/Review/AddReview';
import Login from './components/login';
// import RegisterUserForm from './pages/register';
// import BookingForm from './pages/booking/create';
// import PaymentsList from './pages/payment/paymentList';
// import PaymentSettings from './pages/payment/paymentSettings';
import AddBooking from './pages/booking/AddBooking';
import BookingsList from './pages/booking/BookingList';
import BookingDetails from './pages/booking/BookingDetails.jsx';
import EditBooking from './pages/booking/EditingBooking';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import RoomsPage from './pages/Hotel/Rooms';
import ImageForm from './components/ImageForm.jsx';
import Header from './components/Header';
import Star from './pages/Hotel/star';
import HotelDetails from './pages/Hotel/hoteldetails';
import AddRoom from './components/addroom';
import AddType from './components/addtype';
import AddRoomImage from './components/addroomimage';
import RoomDetails from './components/roomdetails';

function App() {

      
  return (

    <div className="d-flex flex-column min-vh-100">
    <BrowserRouter>
      <Header />
      <main className="flex-grow-1 mb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path='/register' element={<RegisterUserForm />} /> */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/reviews/:reviewId" element={<ReviewDetail />} />
          <Route path="/hotels/:hotelId/reviews" element={<HotelReviews />} />
          <Route path="/hotels/:hotelId/add-review" element={<AddReview />} />
          <Route path="/bookings" element={<AddBooking />} />
          <Route path="/my-bookings" element={<BookingsList />} />
          <Route path="/my-bookings/:id" element={<BookingDetails />} />
          <Route path="/my-bookings/:id/edit" element={<EditBooking />} />
          <Route path="/hotels" element={<All_hotels />} />
          <Route path="/hotels/:id" element={<RoomsPage />} />
          <Route path="/createImage/:Id" element={<ImageForm />} />
          <Route path="/star" element= { <Star />} />
          <Route path="/star/detail/:id" element={<HotelDetails />} />
          <Route path="/addroom/:HotelId" element={<AddRoom />} />
          <Route path="/addtype/:hotel_id" element={< AddType />} />
          <Route path="/addroomimage/:room_id" element={<AddRoomImage />} />
          <Route path="/roomdetails/:_id" element={<RoomDetails />} />
          <Route path="/editroom/:roomId/" element={<AddRoom />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  </div>
 

  )
}

export default App
