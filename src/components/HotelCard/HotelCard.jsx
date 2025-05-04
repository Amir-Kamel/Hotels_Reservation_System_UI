import React from "react";
import "./HotelCard.css"; // (optional if you want custom styles)

export default function HotelCard({
  name,
  description,
  address,
  email,
  phone,
  stars,
  created_at,
}) {
  return (
    <div className="hotel-card">
      <img
        src="#" // Placeholder image, replace with actual hotel image URL
        alt={name}
        className="hotel-image"
      />
      <h3>{name}</h3>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Address:</strong> {address}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Phone:</strong> {phone}
      </p>
      <p>
        <strong>Stars:</strong> {stars} Stars
      </p>
      <p>
        <strong>Created At:</strong> {created_at}
      </p>
    </div>
  );
}
