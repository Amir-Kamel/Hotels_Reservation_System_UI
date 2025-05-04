import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addReview } from "../../store/slices/reviews";
import { getHotelDetail } from "../../services/api";
import Header from "../../components/Header";
import { userIsOwner  , userIsCustomer , userIsAdmin} from "../../utils/permissions"; // Import the userIsOwner function

const AddReview = () => {
  const { hotelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.reviews);

  const [hotel, setHotel] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [formData, setFormData] = useState({
    hotel: hotelId,
    rating: 5,
    title: "",
    comment: "",
    user_name: "",
    stay_date: "",
  });

  useEffect(() => {
    if (hotelId) {
      const fetchHotelData = async () => {
        try {
          const hotelData = await getHotelDetail(hotelId);
          console.log("Hotel data received:", hotelData);
          setHotel(hotelData);
        } catch (err) {
          console.error("Error fetching hotel:", err);
        } finally {
          setHotelLoading(false);
        }
      };

      fetchHotelData();
    }
  }, [hotelId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.user_name ||
      !formData.title ||
      !formData.comment ||
      !formData.stay_date
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      ...formData,
      hotel: hotelId,
    };

    try {
      await dispatch(addReview(payload)).unwrap();
      navigate(`/hotels/${hotelId}/reviews`);
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to submit review. Please try again later.");
    }
  };

  const renderRatingSelect = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <label
          key={i}
          style={{ cursor: "pointer", fontSize: "2rem", margin: "0 0.25rem" }}
        >
          <input
            type="radio"
            name="rating"
            value={i}
            checked={formData.rating === i}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <span style={{ color: formData.rating >= i ? "#CD9A5E" : "#E8DFD5" }}>
            ★
          </span>
        </label>
      );
    }
    return stars;
  };

  // if (hotelLoading) return <Loader />;

  return (
    <div style={{ backgroundColor: '#F9F5F1', minHeight: '100vh' }}>
    
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          color: '#1A1A1A', 
          marginBottom: '1.5rem',
          borderBottom: '2px solid #CD9A5E',
          paddingBottom: '0.5rem'
        }}>
          Write a Review
        </h1>

        {hotel && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#E8DFD5",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "1rem",
                overflow: "hidden",
              }}
            >
              {hotel.image_url ? (
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#8A8A8A" }}>No Image</span>
              )}
            </div>
            <div>
              <h2 style={{ color: "#1A1A1A", marginBottom: "0.25rem" }}>
                {hotel.name}
              </h2>
              <p style={{ color: "#8A8A8A" }}>{hotel.address}</p>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "1rem",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#1A1A1A",
                  fontWeight: "bold",
                }}
              >
                Your Rating
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                {renderRatingSelect()}
                <span style={{ marginLeft: "1rem", color: "#8A8A8A" }}>
                  {formData.rating === 1 && "Poor"}
                  {formData.rating === 2 && "Fair"}
                  {formData.rating === 3 && "Average"}
                  {formData.rating === 4 && "Good"}
                  {formData.rating === 5 && "Excellent"}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="user_name"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#1A1A1A",
                  fontWeight: "bold",
                }}
              >
                Your Name
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #E8DFD5",
                  fontSize: "1rem",
                }}
                placeholder="Enter your name"
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="stay_date"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#1A1A1A",
                  fontWeight: "bold",
                }}
              >
                Date of Stay
              </label>
              <input
                type="date"
                id="stay_date"
                name="stay_date"
                value={formData.stay_date}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #E8DFD5",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="title"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#1A1A1A",
                  fontWeight: "bold",
                }}
              >
                Review Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #E8DFD5",
                  fontSize: "1rem",
                }}
                placeholder="Summarize your experience"
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                htmlFor="comment"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#1A1A1A",
                  fontWeight: "bold",
                }}
              >
                Your Review
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
                rows={6}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #E8DFD5",
                  fontSize: "1rem",
                  resize: "vertical",
                }}
                placeholder="Tell us about your experience at this hotel"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => navigate(`/hotels/${hotelId}/reviews`)}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#E8DFD5",
                  color: "#1A1A1A",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#B45F3A",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
