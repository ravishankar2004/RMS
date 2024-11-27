import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "beige" }}
    >
      <div className="text-center">
        <h1 className="mb-3" style={{ color: "#6B4423" }}>
          Welcome to CONET
        </h1>
        <p style={{ color: "#6B4423" }}>
          Your gateway to seamless networking and collaboration.
        </p>
        <div className="mt-4">
          {/* Login Button */}
          <Link to="/login">
            <button
              className="btn mx-2"
              style={{
                backgroundColor: "#e67e22",
                color: "white",
                border: "none",
                padding: "10px 20px",
                fontWeight: "bold",
                borderRadius: "5px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#d35400")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#e67e22")}
            >
              Login
            </button>
          </Link>

          {/* Signup Button */}
          <Link to="/signup">
            <button
              className="btn mx-2"
              style={{
                backgroundColor: "#16a085",
                color: "white",
                border: "none",
                padding: "10px 20px",
                fontWeight: "bold",
                borderRadius: "5px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1abc9c")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#16a085")}
            >
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
