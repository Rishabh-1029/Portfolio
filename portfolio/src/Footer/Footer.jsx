import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE || "admin";

  return (
    <footer className="footer">
      <p>
        <span className="footer-quote gradient-text">Creating, Learning, and Evolving</span>
        <span className="footer-divider">|</span>© 2025{" "}
        <strong>Rishabh Surana</strong>. All rights reserved.
      </p>
      
      {/* Subtle Admin Gateway */}
      <Link to={`/${adminRoute}`} className="admin-gateway" title="System Login">
        ⎈
      </Link>
    </footer>
  );
};

export default Footer;
