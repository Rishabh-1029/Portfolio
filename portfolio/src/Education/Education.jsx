import React from "react";
import "./Education.css";
import schoolLogo from "../assets/SLC.png";
import bennettLogo from "../assets/Bennett.png";
import { FaMapMarkerAlt } from "react-icons/fa";

const Education = () => {
  const educationData = [
    {
      title: "10th Grade",
      score: "86%",
      school: "St. Lawrence Convent",
      location: "Delhi, India",
      period: "2013 - 2021",
      icon: schoolLogo,
      accent: "#38bdf8",
    },
    {
      title: "12th Grade",
      score: "86.6%",
      school: "St. Lawrence Convent",
      location: "Delhi, India",
      period: "2013 - 2021",
      icon: schoolLogo,
      accent: "#22c55e",
    },
    {
      title: "B.Tech CSE (AI & ML)",
      score: "CGPA 8.71",
      school: "Bennett University",
      location: "Greater Noida, Uttar Pradesh, India",
      period: "2022 - 2026",
      icon: bennettLogo,
      accent: "#a78bfa",
    },
  ];

  return (
    <section id="education" className="education-section">
      <div className="education-container">
        <div className="education-header">
          <h2>
            <span className="gradient-text">EDUCATION</span>
          </h2>
          <p className="section-subtext">
            Academic qualifications and educational background
          </p>
        </div>

        <div className="education-grid">
          {educationData.map((edu) => (
            <div
              key={edu.title}
              className="education-card hover-lift"
              style={{ "--education-accent": edu.accent }}
            >
              <div className="education-card-top">
                <div className="education-icon">
                  <img src={edu.icon} alt={`${edu.school} logo`} />
                </div>
              </div>
              <div className="education-credential">
                <h3>{edu.title}</h3>
                <p className="education-school">{edu.school}</p>
                <p className="education-period">( {edu.period} )</p>
              </div>
              <div className="education-score">
                <strong>{edu.score}</strong>
              </div>
              <p className="location">
                <FaMapMarkerAlt aria-hidden="true" />
                <span>{edu.location}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
