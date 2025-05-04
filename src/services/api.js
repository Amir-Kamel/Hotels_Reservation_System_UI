import axiosInstance from "../config/axios_conf";
// Hotel APIs
export const getAllHotels = () => axiosInstance.get("/hotels/");
export const createHotel = (data) => {
  return axiosInstance.post("/hotels/create/", data);
};
export const updateHotel = (id, data) => {
  console.log(`Updating Hotel with ID ${id} and Data:`, data);
  return axiosInstance.put(`/hotels/update/${id}/`, data);
};
export const getHotelDetail = (id) =>
  axiosInstance.get(`/hotels/detail/${id}/`); // pre
export const deleteHotel = (id) =>
  axiosInstance.delete(`/hotels/delete/${id}/`);
export const filterHotelsByStars = (stars) =>
  axiosInstance.get(`/hotels/hotelfilter/${stars}/`);
export const getOwnerHotelDetails = () =>
  axiosInstance.get("/hotels/details/ownerhoteldetails/");
export const getOwnerHotelBookings = () =>
  axiosInstance.get(`/bookings/owner/hotels/`);
export const createRoom = (data) =>
  axiosInstance.post("/hotels/roomcreate/", data); //done
export const hotelRoomstype = (id) =>
  axiosInstance.get(`/hotels/hotelroometype/${id}/`); //done
export const createRoomType = (data) =>
  axiosInstance.post("/hotels/roomcreatetype/", data); //done
export const updateRoom = (id, data) =>
  axiosInstance.put(`/hotels/roomupdate/${id}/`, data);
export const deleteRoom = (id) =>
  axiosInstance.delete(`/hotels/roomdelete/${id}/`);
export const getRoomDetail = (id) =>
  axiosInstance.get(`/hotels/roomdetail/${id}/`);
export const filterRoomsByType = (roomType) =>
  axiosInstance.get(`/hotels/roomfilter/${roomType}/`);
export const getRoomsByHotel = (hotelId) =>
  axiosInstance.get(`/hotels/rooms/${hotelId}/`); //dn
//ROom Images APIS
export const createRoomImage = (data) => axiosInstance.post("/hotels/roomcreateimage/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateRoomImage = (id, formData) => axiosInstance.put(`/hotels/roomupdateimage/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteRoomImage = (id) => axiosInstance.delete(`/hotels/roomdeleteimage/${id}/`);
export const listRoomImages = (id) => axiosInstance.get(`/hotels/roomlistimages/${id}/`);
// Image APIs
export const createHotelImage = (formData) => axiosInstance.post("/hotels/createimage/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateHotelImage = (id, formData) => axiosInstance.put(`/hotels/updateimage/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteHotelImage = (id) => axiosInstance.delete(`/hotels/deleteimage/${id}/`);
export const listHotelImages = () => axiosInstance.get(`/hotels/listimages/`);
// Notification APIs
export const getNotifications = () => axiosInstance.get("/hotels/notifications/");
export const markNotificationAsRead = (id) => axiosInstance.put(`/hotels/notifications/mark-read/${id}/`);
export const deleteNotification = (id) => axiosInstance.delete(`/hotels/notifications/delete/${id}/`);
// Email APIs
export const sendConfirmEmail = (data) => axiosInstance.post("/hotels/send-email/", data);
// Reviews APIs
export const getAllReviews = () => axiosInstance.get("/reviews/getall/");
export const createReview = (data) => axiosInstance.post("/reviews/create/", data);
export const getReviewDetail = (id) => axiosInstance.get(`/reviews/details/${id}/`);
export const getHotelReviews = (hotelId) => axiosInstance.get(`/reviews/hotels/${hotelId}/reviews/`);
// Create a new booking
export const createBooking = (data) => axiosInstance.post("/bookings/create/", data);
// Get all bookings
export const getAllBookings = () => axiosInstance.get("/bookings/");
// Get booking detail
export const getBookingDetail = (id) => axiosInstance.get(`/bookings/${id}/`);
// Get current user's bookings
export const getCurrentUserBookings = () => axiosInstance.get("/bookings/userbookings/");
// Get hotel's bookings
export const getHotelBookings = () => axiosInstance.get("/bookings/hotelbookings/");
// Update a booking
export const updateBooking = (id, data) => axiosInstance.put(`/bookings/${id}/`, data);
// Delete a booking
export const deleteBooking = (id) => axiosInstance.delete(`/bookings/${id}/`);
// get all payments for a specific booking
export const paymentData = (id) => axiosInstance.get(`/bookings/booking/payment/${id}/`);
// Get all payments
export const getAllPayments = () => axiosInstance.get("/payments/create");
// Get single payment by id
export const getPayment = (id) => axiosInstance.get(`/payments/${id}/`);
// Add this to your api.js file
export const getUserBookings = () => axiosInstance.get('/bookings/userbookings/');
// Update payment by id
export const updatePayment = (id, data) => axiosInstance.put(`/payments/${id}/`, data);
// Delete payment by id
export const deletePayment = (id) => axiosInstance.delete(`/payments/${id}/`);
// Process a specific payment
export const processPayment = (id) =>
  axiosInstance.post(`/payments/${id}/`, { process_payment: true });
// Get all payment settings
export const getAllPaymentSettings = () => axiosInstance.get("/payment-settings/");
// Update payment settings (Create if not exists)
export const updatePaymentSetting = (data) => axiosInstance.put("/payment-settings/", data);
// Delete payment setting by id
export const deletePaymentSetting = (id) => axiosInstance.delete(`/payment-settings/${id}/`);
// USER functions
export const getAllUsers = () => axiosInstance.get("/accounts/user/");
export const getCurrentAdmin = () => axiosInstance.get("/accounts/user/admin/");
export const editCurrentAdmin = (data) => axiosInstance.patch("/accounts/user/admin/", data);
export const getUserDetail = (id) => axiosInstance.get(`/accounts/user/${id}/`);
export const getCurrentUser = () => axiosInstance.get("/accounts/user/data");
export const updateUser = (id, data) => axiosInstance.put(`/accounts/user/${id}/`, data);
export const deleteUser = (id) => axiosInstance.delete(`/accounts/user/${id}/`);
// Register user (hotel owner or customer)
export const registerUser = (data) => axiosInstance.post("/accounts/user/register/", data);
// register user (admin)
export const registerUserForAdmin = (data) => axiosInstance.post("/accounts/user/", data);
// Update current logged-in user's data
export const updateCurrentUser = (data) => axiosInstance.patch("/accounts/user/data", data);
// AUTH functions (Login, Refresh, Logout)
export const refreshToken = (data) => axiosInstance.post("/accounts/login/refresh/", data); // data = { refresh: "token" }
export const logoutUser = (data) =>
 axiosInstance.post("/accounts/logout/", data); // data = { refresh: "token" }
export const sendQuestion = (question, model = 'gemini') => axiosInstance.post('/chat/query/', { question, model });
export const fetchQueryHistory = (modelFilter = null) => {
  const url = modelFilter ? `/chat/history/?model=${modelFilter}` : '/history/';
  return axiosInstance.get(url);
};
