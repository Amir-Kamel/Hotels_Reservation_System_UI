// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels } from "../store/slices/hotels";
import { fetchReviews } from "../store/slices/reviews";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from "../components/Loader";
import { useParams, useNavigate } from 'react-router-dom';
import { userIsAdmin } from "../utils/permissions";
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Selectors for hotels and reviews
  const {
    hotels,
    loading: hotelsLoading,
    error: hotelsError,
  } = useSelector((state) => state.hotels);
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(fetchReviews());
  }, [dispatch]);
  if (hotelsLoading || reviewsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Loader />
      </div>
    );
  }
  const topHotels = hotels.filter((hotel) => hotel.stars === 5);

  return (
    <>
      {/* Transparent Header */}

      {/* Cover Section */}
      <div className="cover-section text-center text-color d-flex align-items-center justify-content-center">
        <div>
          <img
            src="src/assests/HOTEL_LOGO.svg"
            alt=""
            style={{ width: "300px", height: "200px" }}
          />
          <h1 className="display-4 fw-bold animate-fade-in">
            Welcome to Our Hotel Platform
          </h1>
          <p className="lead animate-slide-up">
            Discover luxury hotels and unforgettable experiences
          </p>
          <Link
            to="/hotels"
            className="btn btn-primary btn-lg mt-4 text-light btn-hover-light animate-bounce border-0"
          >
            <i className="bi bi-house-door-fill me-2 text-color"></i>
            <span className="text-light">Explore Hotels</span>
          </Link>
        </div>
      </div>
   
      {userIsAdmin() && (
        <div className="text-center mt-4">
          <Link
            to="/adminpanel"
            className="btn btn-primary btn-lg text-light btn-hover-light border-0"
          >
            <i className="bi bi-person-fill me-2 text-color"></i>
            <span className="text-light">Admin Dashboard</span>
          </Link>
        </div>
      )}
      {/* Admin Dashboard Button */}

      {/* Other Sections */}
      <div className="py-5 top-hotels-section">
        {/* Top Hotels Section */}
        <section className="mb-5 rounded shadow-sm p-4">
          <h2 className="text-center fw-bold mb-4 position-relative section-title text-primary">
            Discover Your Ideal Room In Our Top Hotels
          </h2>
          <div
            style={{
              width: "290px",
              height: "4px",
              backgroundColor: "#CD9A5E",
              margin: "20px auto",
            }}
          ></div>
          {hotelsLoading ? (
            <div className="text-center">Loading hotels...</div>
          ) : hotelsError ? (
            <div className="text-center text-danger">Error: {hotelsError}</div>
          ) : (
            <Swiper
              navigation={true}
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={3}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile
                640: { slidesPerView: 2, spaceBetween: 20 }, // Tablets
                1024: { slidesPerView: 3, spaceBetween: 40 }, // Desktops
              }}
            >
              {topHotels.map((hotel) => (
                <SwiperSlide key={hotel.id}>
                  <div
                    className="card h-100 shadow-sm hotel-card "
                    style={{ backgroundColor: "#CD9A5E" }}
                  >
                    <img
                      src={
                        hotel.image.length > 0
                          ? hotel.image[0].image.startsWith("/media/")
                            ? `http://127.0.0.1:8000${hotel.image[0].image}`
                            : hotel.image[0].image
                          : "https://via.placeholder.com/300x200"
                      }
                      alt={hotel.name}
                      className="card-img-top"
                      style={{
                        objectFit: "cover",
                        height: "400px",
                        backgroundColor: "#E8DFD5",
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-bold text-info">
                        {hotel.name}
                      </h5>
                      <p className="card-text text-light">
                        <i className="bi bi-geo-alt-fill   me-2 text-light"></i>
                        {hotel.address || "No address provided"}
                      </p>
                      <p className="card-text  text-light">
                        <i className="bi bi-star-fill text-warning me-2 text-light"></i>
                        {hotel.stars || "No rating"} Stars
                      </p>

                      <Link
                        to={`/hotels/detail/${hotel.id}`}
                        className="btn btn-color border-0 text-primary btn-hover-light"
                      >
                        <i className="bi bi-eye-fill me-2 text-primary"></i>
                        <span className="text-primary"> View Details</span>{" "}
                      </Link>

                      {/* <p className="card-text text-muted">
                        <i className="bi bi-currency-dollar text-success me-2"></i>
                        {hotel.price || "Price not available"}
                      </p> */}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>
      </div>
      <section className="whyusSection">
        <div className="container">
          <h2 className="text-center fw-bold mb-4 position-relative section-title text-primary">
            Why Choose Us?
          </h2>
          <div
            style={{
              width: "290px",
              height: "4px",
              backgroundColor: "#CD9A5E",
              margin: "20px auto",
            }}
          ></div>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="feature-card p-4 shadow-sm rounded bg-primary">
                <div className="icon-circle bg-light text-white mx-auto mb-3">
                  <i className="bi bi-star-fill fs-1 text-primary"></i>
                </div>
                <h3 className="mt-3 text-light">Luxury Experience</h3>
                <p className="text-light">
                  Experience the best in luxury and comfort.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-card p-4 shadow-sm rounded  bg-primary">
                <div className="icon-circle bg-light text-white mx-auto mb-3">
                  <i className="bi bi-shield-lock-fill fs-1 text-primary"></i>
                </div>
                <h3 className="mt-3 text-light">Secure Booking</h3>
                <p className="text-light">
                  Your data is safe with us. Book with confidence.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center ">
              <div className="feature-card p-4 shadow-sm rounded bg-primary">
                <div className="icon-circle bg-light text-white mx-auto mb-3">
                  <i className="bi bi-chat-dots-fill fs-1 text-primary"></i>
                </div>
                <h3 className="mt-3 text-light">24/7 Support</h3>
                <p className="text-light">
                  Our team is here to assist you at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="customer-reviews-section py-5 bottom-0">
        <div className="container">
          <h2 className="text-center fw-bold mb-4 position-relative section-title text-primary">
            What Our Customers Say
          </h2>
          <div
            style={{
              width: "290px",
              height: "4px",
              backgroundColor: "#CD9A5E",
              margin: "20px auto",
            }}
          ></div>
          {reviewsLoading ? (
            <div className="text-center">Loading reviews...</div>
          ) : reviewsError ? (
            <div className="text-center text-danger">Error: {reviewsError}</div>
          ) : (
            <Swiper
              navigation={true}
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={3}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile
                640: { slidesPerView: 2, spaceBetween: 20 }, // Tablets
                1024: { slidesPerView: 3, spaceBetween: 40 }, // Desktops
              }}
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="card h-100 shadow-sm review-card p-4 bg-primary">
                    <div className="text-center mb-3">
                      <img
                        src={
                          review.user?.image
                            ? review.user.image.startsWith("/media/")
                              ? "src/assests/user.png"
                              : "src/assests/user.png"
                            : "src/assests/user.png"
                        }
                        alt={review.user?.name || "User"}
                        className="rounded-circle"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="card-body text-center">
                      <p
                        className="card-text  text-light "
                        style={{ fontSize: "1.3rem" }}
                      >
                        "{review.comment}"
                      </p>
                      {/* <p className="card-text text-warning">
                  <i className="bi bi-star-fill me-1 w-25"></i>
                  {review.rating || "No rating"}
                </p>
                 */}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
