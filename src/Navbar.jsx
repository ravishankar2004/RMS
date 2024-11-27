import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Assuming you're using Firebase for authentication
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase if applicable
      localStorage.removeItem("isLoggedIn"); // Remove login status
      localStorage.removeItem("user"); // Clear user data
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check login status

  return (
    <nav className="navbar navbar-expand-md" style={{ backgroundColor: "#e0e0c0", borderBottom: "1px solid #d2b48c", padding: "8px 16px" }}>
      <div className="container-fluid p-0">
        {/* Logo and Brand */}
        <Link to="/home" className="navbar-brand d-flex align-items-center">
          <img src="/conet.png" className="rounded-5" alt="conet" style={{ height: "30px", marginRight: "8px" }} />
          <span style={{ color: "#6b4423", fontWeight: "bold" }}>Conet</span>
        </Link>

        {/* Navbar toggler */}
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#cla" style={{ borderColor: "#d2b48c", color: "#6b4423", padding: "2px 6px" }}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Links */}
        <div className="collapse navbar-collapse justify-content-end" id="cla">
          <ul className="navbar-nav">
            <li className="nav-items">
              <Link to="/home" className="nav-link" style={{ color: "#6b4423" }}>Home</Link>
            </li>
            <li className="nav-items">
              <Link to="/post" className="nav-link" style={{ color: "#6b4423" }}>Post</Link>
            </li>
            {/* <li className="nav-items">
              <Link to="/cryptocurrency" className="nav-link" style={{ color: "#6b4423" }}>Cryptocurrency</Link>
            </li> */}
          </ul>

          {/* Login/Logout Button */}
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <li className="nav-items">
                <button onClick={handleLogout} className="btn" style={{ backgroundColor: "#d2b48c", color: "#fff", padding: "6px 12px", borderRadius: "5px" }}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-items">
                <Link to="/login" className="btn" style={{ backgroundColor: "#d2b48c", color: "#fff", textDecoration: "none", padding: "6px 12px", borderRadius: "5px" }}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;