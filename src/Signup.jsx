import React, { useState } from "react";
import { auth } from "./firebase"; // Ensure you have Firebase configured
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start animation
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("token", user.accessToken); // Store token if needed
      localStorage.setItem("user", JSON.stringify(user)); // Store user data
      localStorage.setItem("isLoggedIn", "true"); // Set login status
      setTimeout(() => navigate("/home"), 500); // Redirect to home after signup
    } catch (error) {
      console.error(error);
      alert("Error creating account!");
    } finally {
      setIsLoading(false); // Stop animation
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#F0F0CC",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "400px",
          borderRadius: "15px",
          border: "none",
          backgroundColor: "white",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{ color: "#6B4423", fontWeight: "bold" }}
        >
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
              style={{ fontWeight: "bold", color: "#6B4423" }}
            >
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "10px",
                border: "1px solid #6B4423",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label"
              style={{ fontWeight: "bold", color: "#6B4423" }}
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "10px",
                border: "1px solid #6B4423",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#16A085",
              color: "white",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#137f6a")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#16A085")}
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                style={{ color: "white" }}
              ></span>
            ) : (
              "Signup"
            )}
          </button>
        </form>
        <div className="text-center mt-3">
          <span style={{ color: "#6B4423", fontWeight: "bold" }}>
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="text-decoration-none"
            style={{ color: "#E67E22", fontWeight: "bold" }}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
