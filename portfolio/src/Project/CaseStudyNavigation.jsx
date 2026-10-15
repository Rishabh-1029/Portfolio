import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const BackToProjectsLink = ({ label = "Back to projects" }) => (
  <Link to="/#projects" className="case-study-back-link">
    <FaArrowLeft aria-hidden="true" />
    <span>{label}</span>
  </Link>
);
