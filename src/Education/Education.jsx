import React from "react";
import "./Education.css";
import schoolLogo from "../assets/SLC.png";
import bennettLogo from "../assets/Bennett.png";

const Education = () => {
  const educationData = [
    {
      title: "10th Grade",
      score: "86%",
      school: "St. Lawrence Convent",
      location: "Delhi, India (2013-2021)",
      colorFrom: "#818cf8",
      colorTo: "#a855f7",
      icon: schoolLogo,
    },
    {
      title: "12th Grade",
      score: "86.6%",
      school: "St. Lawrence Convent",
      location: "Delhi, India (2013-2021)",
      colorFrom: "#818cf8",
      colorTo: "#f472b6",
      icon: schoolLogo,
    },
    {
      title: "B.Tech CSE (AI & ML)",
      score: "CGPA 8.60",
      school: "Bennett University",
      location: "Greater Noida, UP, India (2022-2026)",
      colorFrom: "#a855f7",
      colorTo: "#818cf8",
      icon: bennettLogo,
    },
  ];

  return (
    <section id="education" className="education-section">
      <div className="education-container">
        <div className="education-header">
          <h2>EDUCATION</h2>
        </div>

        <div className="education-grid">
          {educationData.map((edu, index) => (
            <div key={index} className="education-card hover-lift">
              <div
                className="education-icon"
                style={{
                  background: `linear-gradient(90deg, ${edu.colorFrom}, ${edu.colorTo})`,
                }}
              >
                <img src={edu.icon} />
              </div>
              <h3>{edu.title}</h3>
              <p className="score">{edu.score}</p>
              <p className="school">{edu.school}</p>
              <p className="location">{edu.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
