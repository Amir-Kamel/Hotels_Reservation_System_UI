import React, { useState, useEffect } from "react";

const HotelFormModal = ({ show, onClose, onSubmit, initialData }) => {
  const user = localStorage.getItem("user");
  const [formData, setFormData] = useState({
    user_id: user ? JSON.parse(user).id : "1",
    name: "",
    description: "",
    address: "",
    stars: 0,
    price_range: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        stars: initialData.stars ? Number(initialData.stars) : 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stars"
        ? value === "" ? "" : Number(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name  || !formData.address || !formData.stars) {
      alert("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const preparedData = { ...formData, stars: Number(formData.stars) };
    console.log("Submitting Hotel Data:", preparedData);
    onSubmit(preparedData);
    setFormData({
      name: "",
      description: "",
      address: "",
      stars: 0,
      price_range: "",
      phone: "",
      email: "",
    });
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData ? "Edit Hotel" : "Add Hotel"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Description", name: "description", type: "text" },
                { label: "Address", name: "address", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Price Range", name: "price_range", type: "text" },
                { label: "Phone", name: "phone", type: "text" },
              ].map(({ label, name, type }) => (
                <div className="mb-3" key={name}>
                  <label htmlFor={name} className="form-label">{label}</label>
                  <input
                    type={type}
                    id={name}
                    className="form-control"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={name !== "phone"}
                  />
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label">Stars</label>
                <input
                  type="number"
                  className="form-control"
                  name="stars"
                  value={formData.stars}
                  onChange={handleChange}
                  min="3"
                  max="7"
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                {initialData ? "Save Changes" : "Add Hotel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelFormModal;
