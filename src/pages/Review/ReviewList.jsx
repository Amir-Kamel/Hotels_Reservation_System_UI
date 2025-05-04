import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../store/slices/reviews";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const ReviewList = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.reviews);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const sortedReviews = [...(reviews || [])].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "highest") {
      return b.rating - a.rating;
    } else if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < rating ? "#CD9A5E" : "#E8DFD5" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // if (loading) return <Loader />;

  return (
    <div style={{ backgroundColor: '#F9F5F1', minHeight: '100vh' }}>
   
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ 
          color: '#1A1A1A', 
          marginBottom: '1.5rem',
          borderBottom: '2px solid #CD9A5E',
          paddingBottom: '0.5rem'
        }}>
          Guest Reviews
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <p style={{ color: "#8A8A8A" }}>
            {reviews?.length || 0} reviews from our guests
          </p>
          <div>
            <label
              htmlFor="sortBy"
              style={{ color: "#1A1A1A", marginRight: "0.5rem" }}
            >
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #E8DFD5",
                backgroundColor: "white",
                color: "#1A1A1A",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

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

        <div>
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                  borderLeft: `4px solid #CD9A5E`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3 style={{ color: "#1A1A1A", marginBottom: "0.5rem" }}>
                      {review.hotel_details.name || "Hotel Name"}
                    </h3>
                    <div
                      style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
                    >
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#8A8A8A", fontSize: "0.875rem" }}>
                      {formatDate(review.created_at || new Date())}
                    </p>
                    <p style={{ color: "#1A1A1A", fontWeight: "bold" }}>
                      {review.user_details.username || "Guest"}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    color: "#1A1A1A",
                    lineHeight: "1.6",
                    marginBottom: "1rem",
                  }}
                >
                  {review.comment || "No comment provided."}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                  }}
                >
                  <Link
                    to={`/hotels/detail/${review.hotel_id}`}
                    style={{
                      color: "#B45F3A",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    View Hotel →
                  </Link>

                  <Link
                    to={`/reviews/${review.id}`}
                    style={{
                      color: "#CD9A5E",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    View Review Details →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                backgroundColor: "white",
                borderRadius: "8px",
                color: "#8A8A8A",
              }}
            >
              <p>No reviews available yet.</p>
              <Link
                to="/hotels"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#CD9A5E",
                  color: "white",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Browse Hotels
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default ReviewList;
