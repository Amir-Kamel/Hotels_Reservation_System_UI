import { configureStore } from "@reduxjs/toolkit";
import HotelsReducer from "./slices/hotels";
import RoomsReducer from "./slices/rooms";
import ReviewsReducer from './slices/reviews';
import AuthReducer from './slices/login';
import BookingsReducer from './slices/booking';
import PaymentReducer from './slices/payments';
import ImageReducer from './slices/images';
import AccountReducer from './slices/accounts';
import accountsReducer from "./slices/accounts";
import roomImagesReducer from "./slices/room_images";
// import registerReducer from './slices/register';

const store = configureStore({
  reducer: {
    hotels: HotelsReducer,
    rooms: RoomsReducer,
    reviews: ReviewsReducer,
    auth: AuthReducer,
    bookings: BookingsReducer,
    payments: PaymentReducer,
    images: ImageReducer,
    accounts: AccountReducer,
    roomImages: roomImagesReducer,
    accounts: accountsReducer,
  },
});

export default store;
