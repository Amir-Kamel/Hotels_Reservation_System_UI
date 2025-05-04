import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchHotelReviews } from "../../store/slices/reviews";
import { getHotelDetail } from "../../services/api";
import Header from "../../components/Header";
import { userIsCustomer } from "../../utils/permissions";
const HotelReviews = () => {
  const { hotelId } = useParams();
  const dispatch = useDispatch();
  const { hotelReviews, loading, error } = useSelector(
    (state) => state.reviews
  );
  const [hotel, setHotel] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    console.log("Current hotel ID from params:", hotelId);
    if (hotelId) {
      dispatch(fetchHotelReviews(hotelId));

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
  }, [dispatch, hotelId]);

  const calculateAverageRating = () => {
    if (!hotelReviews || hotelReviews.length === 0) return 0;
    const sum = hotelReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / hotelReviews.length).toFixed(1);
  };

  const sortedReviews = [...(hotelReviews || [])].sort((a, b) => {
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

  const getRatingDistribution = () => {
    if (!hotelReviews || hotelReviews.length === 0) return [];

    const distribution = [0, 0, 0, 0, 0];

    hotelReviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[5 - review.rating]++;
      }
    });

    return distribution;
  };

  //   if (loading || hotelLoading) return <Loader />;

  return (
    <div style={{ backgroundColor: '#F9F5F1', minHeight: '100vh' }}>
     
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {hotel && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <Link
                to={`/hotels/detail/${hotelId}`}
                style={{
                  color: "#B45F3A",
                  textDecoration: "none",
                  marginRight: "0.5rem",
                }}
              >
                {hotel.data.name || "Hotel"}
              </Link>
              <span style={{ color: "#8A8A8A" }}> / Reviews</span>
            </div>

            <h1
              style={{
                color: "#1A1A1A",
                marginBottom: "1.5rem",
                borderBottom: "2px solid #CD9A5E",
                paddingBottom: "0.5rem",
              }}
            >
              Guest Reviews
            </h1>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "2rem",
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "2rem",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div style={{ flex: "1" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    color: "#1A1A1A",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {calculateAverageRating()}
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "#8A8A8A",
                      marginLeft: "0.5rem",
                    }}
                  >
                    / 5
                  </span>
                </div>

                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  {renderStars(Math.round(calculateAverageRating()))}
                </div>

                <p style={{ color: "#8A8A8A" }}>
                  Based on {hotelReviews?.length || 0} reviews
                </p>
              </div>

              <div style={{ flex: "2" }}>
                <h3 style={{ marginBottom: "1rem", color: "#1A1A1A" }}>
                  Rating Distribution
                </h3>
                {getRatingDistribution().map((count, index) => {
                  const starNumber = 5 - index;
                  const percentage = hotelReviews.length
                    ? (count / hotelReviews.length) * 100
                    : 0;

                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          textAlign: "right",
                          marginRight: "0.5rem",
                        }}
                      >
                        <span>{starNumber} stars</span>
                      </div>
                      <div
                        style={{
                          flex: "1",
                          height: "12px",
                          backgroundColor: "#E8DFD5",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            backgroundColor: "#CD9A5E",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          width: "40px",
                          marginLeft: "0.5rem",
                          color: "#8A8A8A",
                        }}
                      >
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ color: "#1A1A1A" }}>
            All Reviews ({hotelReviews?.length || 0})
          </h2>
          <div>
                {userIsCustomer() && (
            <Link
              to={`/hotels/${hotelId}/add-review`}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#B45F3A",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
                marginRight: "1rem",
              }}
            >
              Write a Review
            </Link>
                )}
            <select
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
                    <div
                      style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
                    >
                      {renderStars(review.rating)}
                    </div>
                    <h3
                      style={{
                        color: "#1A1A1A",
                        marginBottom: "0.25rem",
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        borderLeft: "3px solid #CD9A5E",
                        paddingLeft: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ marginRight: "8px" }}>
                        {review.rating}-Star
                      </span>
                      <span style={{ color: "#555" }}>
                        Review by {review.user_details.username}
                      </span>
                    </h3>
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
                  }}
                >
                  {review.comment || "No comment provided."}
                </p>
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
              <p>No reviews available for this hotel yet.</p>
                  {userIsCustomer() && (
              <Link
                to={`/hotels/${hotelId}/add-review`}
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
                Be the First to Review
              </Link>
                  )}
            </div>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default HotelReviews;
