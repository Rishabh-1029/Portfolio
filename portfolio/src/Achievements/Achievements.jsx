import React from "react";
import "./Achievements.css";
import { FaAward, FaMedal, FaGraduationCap } from "react-icons/fa";
import { RiCodeSSlashFill } from "react-icons/ri";

const achievementsData = [
  {
    id: 1,
    icon: "award",
    title: "Dean’s List Award",
    description:
      "Recognized for outstanding academic performance at Bennett University.",
    link: "https://drive.google.com/file/d/1xGZHoHcjoNY2TYSoA4w3wLLDp1-8Q-dS/view",
  },
  {
    id: 2,
    icon: "trophy",
    title: "Scholarship",
    description:
      "Awarded the Academic Excellence Scholarship at Bennett University.",
    // optional link if you have a certificate
  },
  {
    id: 3,
    icon: "hack",
    title: "Hackathon",
    description: "Led development of KindBasket MVP at Hackaccino 3.0 (2025).",
    link: "https://github.com/Rishabh-1029/KindBasket",
  },
];

const iconMap = {
  award: <FaAward />,
  medal: <FaMedal />,
  trophy: <FaGraduationCap />,
  hack: <RiCodeSSlashFill />,
};

const Achievements = () => {
  return (
    <section id="achievements" className="achievements-section">
      <div className="achievements-container">
        {/* Header */}
        <div className="achievements-header">
          <h2>ACHIEVEMENTS</h2>
          <p>
            Recognition and achievements from my academic and technical journey.
          </p>
        </div>

        {/* Cards */}
        <div className="achievements-grid">
          {achievementsData.map((achieve) => (
            <div
              key={achieve.id}
              className="achievement-card"
              onClick={() =>
                achieve.link && window.open(achieve.link, "_blank")
              }
              style={{ cursor: achieve.link ? "pointer" : "default" }}
            >
              <div className="achievement-icon">{iconMap[achieve.icon]}</div>
              <h3>{achieve.title}</h3>
              <p>{achieve.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
