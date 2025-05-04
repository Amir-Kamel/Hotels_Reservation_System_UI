import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomsByHotel } from "../../store/slices/rooms";
import { useParams, useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination"; // Import the Pagination component
import { userIsOwner  , userIsCustomer , userIsAdmin} from "../../utils/permissions"; // Import the userIsOwner function
export default function RoomsPage() {
  const navigate = useNavigate();
  const { ID } = useParams();
  const dispatch = useDispatch();
  const { rooms, loading, error } = useSelector((state) => state.rooms);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of rooms per page

  useEffect(() => {
    dispatch(fetchRoomsByHotel(ID));
  }, [dispatch, ID]);
  const formatAmenities = (amenities) => {
    if (!amenities) return ["No amenities listed"];
    return amenities.split(",").map((item) => item.trim());
  };

  // Calculate paginated rooms
  const indexOfLastRoom = currentPage * itemsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#F9F5F1" }}
      >
        
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#CD9A5E" }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      
      <div className="container py-5" style={{ backgroundColor: "#F9F5F1" }}>
        <div
          className="alert"
          style={{
            backgroundColor: "#E8DFD5",
            color: "#1A1A1A",
            border: "1px solid #B45E3A",
          }}
        >
          <p>We encountered an error: {error}</p>
          <button
            className="btn mt-2"
            style={{ backgroundColor: "#CD9A5E", color: "#F9F5F1" }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
     {/* Breadcrumb Navigation */}
     <nav aria-label="breadcrumb" className="bg-light py-2 px-3 rounded mt-4">
  <ol className="breadcrumb mb-0">
    <li className="breadcrumb-item">
      <a href="/hotels" className="text-decoration-none text-primary">
        Hotels
      </a>
    </li>
    <li className="breadcrumb-item">
      <a href={`/hotels/${ID}`} className="text-decoration-none text-primary">
        All Rooms
      </a>
    </li>
  </ol>
</nav>

            <div
      style={{
        backgroundColor: "#F9F5F1",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <div className="container">
        <h1
          style={{
            color: "#1A1A1A",
            fontWeight: "bold",
            marginBottom: "40px",
            textAlign: "center",
            fontSize: "2.5rem",
            letterSpacing: "0.5px",
          }}
        >
          Available Accommodations
        </h1>

        {!rooms || rooms.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              backgroundColor: "#E8DFD5",
              borderRadius: "12px",
              padding: "40px",
            }}
          >
            <h2 style={{ color: "#8A8A8A" }}>No rooms available at this time</h2>
            <p style={{ color: "#8A8A8A" }}>
              Please check back later or contact us for assistance
            </p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {currentRooms.map((room) => (
                <div key={room.id} className="col-md-6 col-lg-4 mb-4">
                  <div
                    className="card h-100 border-0"
                    style={{
                      boxShadow:
                        hoveredRoom === room.id
                          ? "0 15px 35px rgba(205, 154, 94, 0.15)"
                          : "0 5px 15px rgba(0, 0, 0, 0.05)",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      transform:
                        hoveredRoom === room.id ? "translateY(-5px)" : "none",
                      backgroundColor: "#FFFFFF",
                      overflow: "hidden",
                    }}
                    onMouseEnter={() => setHoveredRoom(room.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    <div
                      style={{
                        height: "180px",
                        background:
                          "linear-gradient(45deg, #CD9A5E 0%, #B45E3A 100%)",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        borderBottom: "1px solid rgba(26, 26, 26, 0.05)",
                      }}
                    >
                      <div
                        className="position-absolute w-100 h-100"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                          opacity: 0.4,
                        }}
                      ></div>

                      <div
                        style={{
                          zIndex: 2,
                          color: "#FFFFFF",
                          padding: "20px",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "40px",
                            fontWeight: "300",
                            lineHeight: "1",
                            marginBottom: "8px",
                            fontFamily: "serif",
                          }}
                        >
                          {room.price_per_night}
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "500",
                              verticalAlign: "top",
                              marginLeft: "2px",
                            }}
                          >
                            EGP
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            opacity: 0.9,
                          }}
                        >
                          per night
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-4">
                      <div
                        style={{
                          padding: "12px 0",
                          borderBottom: "1px solid #E8DFD5",
                          marginBottom: "16px",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div style={{ fontSize: "0.9rem", color: "#8A8A8A" }}>
                            Room count
                          </div>
                          <div
                            style={{
                              fontSize: "0.95rem",
                              color: "#1A1A1A",
                              fontWeight: "500",
                            }}
                          >
                            {room.total_rooms} rooms
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: "20px" }}>
                        <h6
                          style={{
                            color: "#1A1A1A",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            marginBottom: "12px",
                            letterSpacing: "0.3px",
                          }}
                        >
                          Amenities
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                          {formatAmenities(room.amenities).map(
                            (amenity, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-pill"
                                style={{
                                  backgroundColor: "#E8DFD5",
                                  color: "#1A1A1A",
                                  fontSize: "0.8rem",
                                  fontWeight: "500",
                                }}
                              >
                                {amenity}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="d-flex gap-3 mt-auto">
                        <button
                          className="btn flex-grow-1 py-2"
                          style={{
                            backgroundColor: "#1A1A1A",
                            color: "#F9F5F1",
                            fontWeight: "500",
                            borderRadius: "6px",
                            transition: "all 0.2s ease",
                            border: "none",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          }}
                          onClick={() => navigate(`/roomdetails/${room.id}/`)}
                        >
                          View Details

                        </button>
                          {userIsOwner() && ( 
                        <button
                          className="btn py-2 px-3"
                          style={{
                            backgroundColor: "#CD9A5E",
                            color: "#F9F5F1",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            border: "none",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          }}
                          onClick={() => navigate(`/addroomimage/${room.id}/`)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            style={{ marginRight: "6px" }}
                          >
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                          </svg>
                          Add
                        </button>
                          )}
                                   {userIsOwner() && ( 
                        <button
                          onClick={() =>
                            navigate(`/editroom/${room.hotel}/${room.id}`)
                          }
                          className="btn py-2 px-3"
                          style={{
                            backgroundColor: "#B45E3A",
                            color: "#F9F5F1",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            border: "none",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          }}
                        >
                          Edit
                        </button>
                                   )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(rooms.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
    </>
  );
}