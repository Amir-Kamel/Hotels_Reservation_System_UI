import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addHotel, editHotel, fetchHotelDetail } from "../store/slices/hotels";

const HotelFormPage = () => {
  const { HOTEL_ID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEdit = !!HOTEL_ID;
  const { hotelDetail, formError } = useSelector((state) => state.hotels);
  const [formErrors, setFormErrors] = useState({});
  const user = localStorage.getItem("user");

  const [formData, setFormData] = useState({
    owner: user ? JSON.parse(user).id : "1",
    name: "",
    description: "",
    address: "",
    stars: "",
    price_range: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchHotelDetail(HOTEL_ID));
    }
  }, [dispatch, HOTEL_ID, isEdit]);

  useEffect(() => {
    if (isEdit && hotelDetail) {
      setFormData({
        owner: hotelDetail.owner,
        name: hotelDetail.name || "",
        description: hotelDetail.description || "",
        address: hotelDetail.address || "",
        stars: hotelDetail.stars ? Number(hotelDetail.stars) : "",
        price_range: hotelDetail.price_range || "",
        phone: hotelDetail.phone || "",
        email: hotelDetail.email || "",
      });
    }
  }, [hotelDetail, isEdit]);

  useEffect(() => {
    if (formError) {
      setFormErrors(formError);
    }
  }, [formError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stars" ? (value === "" ? "" : Number(value)) : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (isEdit) {
        await dispatch(editHotel({ id: HOTEL_ID, data: formData })).unwrap();
      } else {
        await dispatch(addHotel(formData)).unwrap();
      }
      setFormErrors({});
      navigate("/hotels");
      window.location.reload();
    } catch (error) {
      console.error("Server error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header p-4 text-center">
          <h5 className="mb-0">{isEdit ? "Edit Hotel" : "Add Hotel"}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control p-2 ${formErrors.name ? "is-invalid" : ""}`}
              />
              {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-control p-2 ${formErrors.description ? "is-invalid" : ""}`}
              />
              {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-control p-2 ${formErrors.address ? "is-invalid" : ""}`}
              />
              {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control p-2 ${formErrors.email ? "is-invalid" : ""}`}
              />
              {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="price_range" className="form-label">Price Range</label>
              <input
                type="text"
                name="price_range"
                id="price_range"
                value={formData.price_range}
                onChange={handleChange}
                className="form-control p-2"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control p-2 ${formErrors.phone ? "is-invalid" : ""}`}
              />
              {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="stars" className="form-label">Stars</label>
              <input
                type="number"
                name="stars"
                id="stars"
                min="3"
                max="7"
                value={formData.stars}
                onChange={handleChange}
                className="form-control p-2"
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={() => {
                setFormErrors({});
                navigate("/hotels");
                window.location.reload();
                }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? "Save Changes" : "Add Hotel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelFormPage;
