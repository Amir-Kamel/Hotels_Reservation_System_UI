import axiosInstance from "../config/axios_conf";

// Hotel APIs
export const getAllHotels = () => axiosInstance.get("/hotels/");
export const createHotel = (data) => {
  console.log("Creating Hotel with Data:", data);
  return axiosInstance.post("/hotels/create/", data);
};
export const updateHotel = (id, data) => {
  console.log(`Updating Hotel with ID ${id} and Data:`, data);
  return axiosInstance.put(`/hotels/update/${id}/`, data);
};
export const getHotelDetail = (id) => axiosInstance.get(`/hotels/detail/${id}/`);  // pre
export const deleteHotel = (id) => axiosInstance.delete(`/hotels/delete/${id}/`);
export const filterHotelsByStars = (stars) => axiosInstance.get(`/hotels/hotelfilter/${stars}/`);

// Room APIs
// export const getAllRooms = () => axiosInstance.get("/hotels/roomlist/"); 
export const createRoom = (data) => axiosInstance.post("/hotels/roomcreate/", data);//done
export const hotelRoomstype = (id) => axiosInstance.get(`/hotels/hotelroometype/${id}/`); //done
export const createRoomType = (data) => axiosInstance.post("/hotels/roomcreatetype/", data);//done
export const updateRoom = (id, data) => axiosInstance.put(`/hotels/roomupdate/${id}/`, data);
export const deleteRoom = (id) => axiosInstance.delete(`/hotels/roomdelete/${id}/`);
export const getRoomDetail = (id) => axiosInstance.get(`/hotels/roomdetail/${id}/`);
export const filterRoomsByType = (roomType) => axiosInstance.get(`/hotels/roomfilter/${roomType}/`);
export const getRoomsByHotel = (hotelId) => axiosInstance.get(`/hotels/rooms/${hotelId}/`); //dn

//ROom Images APIS

export const createRoomImage = (data) => axiosInstance.post("/hotels/roomcreateimage/", data, {
  headers: { "Content-Type": "multipart/form-data" }
}); 
export const updateRoomImage = (id, formData) => axiosInstance.put(`/hotels/roomupdateimage/${id}/`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteRoomImage = (id) => axiosInstance.delete(`/hotels/roomdeleteimage/${id}/`);
export const listRoomImages = (id) => axiosInstance.get(`/hotels/roomlistimages/${id}/`);

  
// Image APIs
export const createHotelImage = (formData) => axiosInstance.post("/hotels/createimage/", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const updateHotelImage = (id, formData) => axiosInstance.put(`/hotels/updateimage/${id}/`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
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
export const getHotelReviews = (hotelId) => 
  axiosInstance.get(`/reviews/hotels/${hotelId}/reviews/`);


// Bookings APIs
// Create a new booking
export const createBooking = (data) => axiosInstance.post("/bookings/", data);

// Get all bookings
export const getAllBookings = () => axiosInstance.get("/bookings/");

// Get booking detail
export const getBookingDetail = (id) => axiosInstance.get(`/bookings/${id}/`);

// Update a booking
export const updateBooking = (id, data) => axiosInstance.put(`/bookings/${id}/`, data);

// Delete a booking
export const deleteBooking = (id) => axiosInstance.delete(`/bookings/${id}/`);



// Get all payments
export const getAllPayments = () => axiosInstance.get("/payments/create");

// Create a new payment
export const createPayment = (data) => axiosInstance.post("/payments/create", data);

// Get single payment by id
export const getPayment = (id) => axiosInstance.get(`/payments/${id}/`);

// Process a specific payment
export const processPayment = (id) => axiosInstance.post(`/payments/${id}/`, { process_payment: true });

// Refund a specific payment
export const refundPayment = (id) => axiosInstance.post(`/payments/${id}/`, { refund_payment: true });

// Create a payment for a reservation (reservation_id + payment_method + is_deposit)
export const createPaymentForReservation = (data) => axiosInstance.post("/payments/create_payment_for_reservation/", data);

// ------ Payment Settings APIs ------

// Get all payment settings
export const getAllPaymentSettings = () => axiosInstance.get("/payment-settings/");

// Update payment settings (Create if not exists)
export const updatePaymentSetting = (data) => axiosInstance.put("/payment-settings/", data);

// // ------ User APIs ------
// export const getAllUsers = () => axiosInstance.get("/users/");
// export const registerUser = (data) => axiosInstance.post("/users/register/", data);
