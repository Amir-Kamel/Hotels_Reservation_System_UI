import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/login";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Import the CSS

function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (error) {
      setFormErrors(error);
      localStorage.setItem("error", error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(result)) {
      setFormErrors({});
      navigate("/");
    } else {
      console.log("Login failed");
    }
  };

  return (
    <div className="bg-cream d-flex align-items-center justify-content-center">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary-custom w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {formErrors[0] && (
            <p className="text-danger mt-2 text-center">
              {" "}
              Username or password are not correct.{" "}
            </p>
          )}
        </form>
        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-primary">
            Register now
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;