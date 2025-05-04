import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels, filterHotels } from "../../store/slices/hotels";
import { useNavigate } from "react-router-dom";
import HotelFormModal from "../../components/HotelFormModal";
import { Star } from "lucide-react";
import SearchAndFilter from "../../components/SearchAndFilter";
import Pagination from "../../components/Pagination";
import { userIsOwner } from "../../utils/permissions";
import Loader from "../../components/Loader";

export default function SimpleHotelListingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, loading, error } = useSelector((state) => state.hotels);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStars, setFilterStars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleStarFilter = (stars) => {
    setFilterStars(stars);
    dispatch(filterHotels(stars));
  };

  const resetFilters = () => {
    setFilterStars(0);
    setSearchTerm("");
    dispatch(fetchHotels());
  };

  const filteredHotels = searchTerm
    ? hotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.price_range?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : hotels;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          <p>Error: {error}</p>
          <button className="btn btn-primary mt-2" onClick={() => dispatch(fetchHotels())}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Carousel Section */}
      <div id="hotelCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {hotels
            .filter((hotel) => hotel.image.length > 0)
            .map((hotel, index) => {
              const imageUrl = hotel.image[0].image.startsWith("/media/")
                ? `http://127.0.0.1:8000${hotel.image[0].image}`
                : hotel.image[0].image;

              return (
                <div key={hotel.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img
                    src={imageUrl}
                    className="d-block w-100"
                    alt={hotel.name}
                    style={{ height: "600px", objectFit: "cover" }}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5 className="text-light fw-bold">{hotel.name}</h5>
                    <p className="text-light">{hotel.address || "No address provided"}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#hotelCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#hotelCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="bg-light py-2 px-3 rounded mt-4">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <a href="/" className="text-decoration-none text-primary">
              Home
            </a>
          </li>
          <li className="breadcrumb-item active text-secondary" aria-current="page">
            Hotels
          </li>
        </ol>
      </nav>

      {/* Search & Filter Section */}
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStars={filterStars}
        setFilterStars={setFilterStars}
        onFilter={handleStarFilter}
        onReset={resetFilters}
      />

      {/* Add Hotel Button */}
      {userIsOwner() && (
        <button className="btn btn-primary m-5 border-0" onClick={() => navigate(`/addhotel`)}>
          + Add Hotel
        </button>
      )}

      {/* Heading */}
      <h1 className="text-center p-3 m-2">Discover Your Hotel</h1>
      <div
        style={{
          width: "80px",
          height: "4px",
          backgroundColor: "#CD9A5E",
          margin: "0 auto",
        }}
      ></div>

      {/* Hotels Grid */}
      <div className="container py-4">
        {currentHotels.length === 0 ? (
          <div className="text-center py-5">
            <h2 className="text-muted">No hotels found</h2>
          </div>
        ) : (
          <div className="row g-4">
            {currentHotels.map((hotel) => {
              const imageUrl =
                hotel.image.length > 0
                  ? hotel.image[0].image.startsWith("/media/")
                    ? `http://127.0.0.1:8000${hotel.image[0].image}`
                    : hotel.image[0].image
                  : null;

              return (
                <div key={hotel.id} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm"
                    onClick={() => navigate(`/hotels/detail/${hotel.id}`)}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={hotel.name}
                        className="card-img-top"
                        style={{ objectFit: "cover", height: "200px" }}
                      />
                    ) : (
                      <div
                        className="bg-secondary text-white d-flex justify-content-center align-items-center"
                        style={{ height: "200px" }}
                      >
                        No Image
                      </div>
                    )}

                    <div className="position-absolute top-0 end-0 m-2 bg-white rounded px-2 py-1">
                      {Array(hotel.stars || 0)
                        .fill()
                        .map((_, i) => (
                          <Star key={i} size={16} fill="gold" color="gold" />
                        ))}
                    </div>

                    <div className="card-body">
                      <h5 className="card-title fw-bold">{hotel.name}</h5>
                      <p className="card-text text-muted">
                        {hotel.address || "No address provided"}
                      </p>
                      <p className="fw-semibold text-primary mb-0">
                        From {hotel.price_range || "N/A"} EGY / night
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredHotels.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
