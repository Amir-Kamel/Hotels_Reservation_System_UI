import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "./logout";
import {
  userIsAdmin,
  userIsOwner,
  userIsCustomer,
  userIsLoggedIn,
} from "../utils/permissions";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.username || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm border-bottom border-primary p-4">
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
          <span className="text-primary">Royal Hotels</span>
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarTogglerDemo01"
        >
          <div className="d-flex justify-content-center" style={{ width: "100%" }}>
            <ul className="navbar-nav gap-5 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark hover-text-primary" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark hover-text-primary" to="/contact">
                  Contact Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark hover-text-primary" to="/about">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark hover-text-primary" to="/hotels">
                  Hotels
                </Link>
              </li>
            </ul>
          </div>

          {/* User Dropdown */}
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-light dropdown-toggle fw-semibold"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userName}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  {userIsCustomer() && (
                    <li>
                      <Link className="dropdown-item" to="/customerprofile">
                        My Profile
                      </Link>
                    </li>
                  )}
                  {userIsOwner() && (
                    <li>
                      <Link className="dropdown-item" to="/hotelownerprofile">
                        Hotel Owner Profile
                      </Link>
                    </li>
                  )}
                  {userIsAdmin() && (
                    <li>
                      <Link className="dropdown-item" to="/adminpanel">
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold text-light btn bg-primary px-4 py-2 d-flex align-items-center gap-2"
                  to="/login"
                >
                  <span>Login</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;