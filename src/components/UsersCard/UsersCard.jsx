import React from "react";
import "./UsersCard.css"; // Import your CSS file for styling
export default function UserCard({
  username,
  email,
  role,
  phone,
  address,
  status,
}) {
  return (
    <div className="user-card">
      <div className="user-card-content">
        <h3 className="user-card-title">{username}</h3>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Role:</strong> {role}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>
    </div>
  );
}
