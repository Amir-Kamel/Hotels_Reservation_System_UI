// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createUser, editUser } from "../store/slices/accounts"; // adjust the path

// const RegisterUserForm = ({ existingUser = null, onSuccess }) => {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.accounts);

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//     role: "customer",
//   });

//   useEffect(() => {
//     if (existingUser) {
//       setFormData({
//         username: existingUser.username || "",
//         email: existingUser.email || "",
//         phone: existingUser.phone || "",
//         password: "", // Don't prefill password
//         role: existingUser.role || "customer",
//       });
//     }
//   }, [existingUser]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (existingUser) {
//       // Update existing user
//       dispatch(editUser({ id: existingUser.id, data: formData }))
//         .unwrap()
//         .then(() => {
//           if (onSuccess) onSuccess();
//         });
//     } else {
//       // Create new user
//       dispatch(createUser(formData))
//         .unwrap()
//         .then(() => {
//           setFormData({
//             username: "",
//             email: "",
//             phone: "",
//             password: "",
//             role: "customer",
//           });
//           if (onSuccess) onSuccess();
//         });
//     }
//   };

//   return (
//     <div>
//       <h2>{existingUser ? "Edit User" : "Register New User"}</h2>
//       <form onSubmit={handleSubmit}>

//         <input 
//           type="text" 
//           name="username" 
//           placeholder="Username"
//           value={formData.username} 
//           onChange={handleChange}
//           required 
//         />

//         <input 
//           type="email" 
//           name="email" 
//           placeholder="Email"
//           value={formData.email} 
//           onChange={handleChange}
//           required 
//         />

//         <input 
//           type="text" 
//           name="phone" 
//           placeholder="Phone"
//           value={formData.phone} 
//           onChange={handleChange}
//         />

//         {/* Only show password input when creating a user */}
//         {!existingUser && (
//           <input 
//             type="password" 
//             name="password" 
//             placeholder="Password"
//             value={formData.password} 
//             onChange={handleChange}
//             required 
//           />
//         )}

//         <select name="role" value={formData.role} onChange={handleChange}>
//           <option value="customer">Customer</option>
//           <option value="hotel_staff">Hotel Staff</option>
//           <option value="hotel_owner">Hotel Owner</option>
//           <option value="admin">Admin</option>
//         </select>

//         <button type="submit" disabled={loading}>
//           {loading ? (existingUser ? "Updating..." : "Registering...") : (existingUser ? "Update User" : "Register")}
//         </button>

//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default RegisterUserForm;
