import React from "react";
import { Search, Star } from "lucide-react";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterStars,
  setFilterStars,
  onFilter,
  onReset,
}) => {
  return (
    <div className=" container bg-white shadow rounded p-4 m-4 w-100 mx-auto">
      <div className="row g-3 align-items-center">
        <div className="col-md-6 position-relative">
          <Search
            className="position-absolute top-50 translate-middle-y ms-3 text-secondary"
            size={20}
          />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Find your hotel ....."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-6 d-flex align-items-center gap-2">
          <span className="fw-medium small">Filter by rating:</span>
          <div className="d-flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onFilter(star)}
                className={`btn btn-sm ${
                  filterStars === star ? "text-warning" : "text-muted"
                }`}
              >
                <Star
                  fill={filterStars >= star ? "currentColor" : "none"}
                  size={20}
                />
              </button>
            ))}
          </div>
          {(filterStars > 0 || searchTerm) && (
            <button
              onClick={onReset}
              className="btn btn-link text-primary text-decoration-none"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;