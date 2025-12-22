import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineProject,
  AiOutlineUser,
  AiOutlineMail,
} from "react-icons/ai";
import {
  FaGithub,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaAward,
  FaCode,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <a href="#home" onClick={handleLinkClick}>
              <AiOutlineHome />
              Home
            </a>
          </li>
          <li>
            <a href="#skills" onClick={handleLinkClick}>
              <FaCode />
              Skills
            </a>
          </li>
          <li>
            <a href="#experience" onClick={handleLinkClick}>
              <AiOutlineUser />
              Experience
            </a>
          </li>
          <li>
            <a href="#projects" onClick={handleLinkClick}>
              <AiOutlineProject />
              Projects
            </a>
          </li>

          <li>
            <a href="#education" onClick={handleLinkClick}>
              <FaGraduationCap />
              Education
            </a>
          </li>
          <li>
            <a href="#achievements" onClick={handleLinkClick}>
              <FaAward />
              Achievements
            </a>
          </li>
          <li>
            <a href="#contact" onClick={handleLinkClick}>
              <AiOutlineMail />
              Connect
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Rishabh-1029"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://leetcode.com/rspsurana"
              target="_blank"
              rel="noreferrer"
            >
              <SiLeetcode />
              LeetCode
            </a>
          </li>
        </ul>

        {/* Hamburger for mobile */}
        <div className="nav-hamburger" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
