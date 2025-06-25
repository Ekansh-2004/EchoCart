import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">Echocart</div>
      <div className="navbar-toggle" onClick={handleToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`navbar-links${open ? " open" : ""}`} onClick={closeMenu}>
        <li>
          <Link to="/main" className={location.pathname === "/main" ? "active" : ""}>Home</Link>
        </li>
        <li>
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>Cart</Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
