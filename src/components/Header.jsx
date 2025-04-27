import React from "react";
import { Link } from "react-router-dom";
import  LogoutButton  from "./logout";
import { useEffect } from "react";
const Header = () => {
    return (
    <nav className="navbar navbar-expand-lg p-3 border shadow-sm ">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse  justify-content-around " id="navbarTogglerDemo01">
                <ul className="navbar-nav p-2 gap-5">
                    <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark " aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark " to="/booking">Contact Us</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark " aria-disabled="true" to="/about">About Us</Link>
                    </li>
                </ul>
                <div className="text-center">
                    <Link className="navbar-brand fw-bold text-dark fs-3" to="/star">Royal Rooms</Link>
                    <p className=" nav-link fw-bold text-secondary">Best Hotels </p>
                </div>
                <ul className="navbar-nav p-2 gap-5">
                    <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark" aria-current="page" to="/reviews">Reviews</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark " to="/register">Register</Link>
                    </li>
                    <li className="nav-item">
                            <LogoutButton />
                    </li>
                    <li className="nav-item">
                            <Link className="nav-link fw-bold text-dark btn px-3" style={{background:"#E8DFD5"}} to="/login" aria-disabled="true">Login</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    );
};

export default Header;