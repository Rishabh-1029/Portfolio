import React from "react";
import "./Achievements.css";
import { FaAward, FaExternalLinkAlt, FaGraduationCap, FaMedal } from "react-icons/fa";
import { RiCodeSSlashFill } from "react-icons/ri";

const achievementsData = [
  {
    id: 1,
    icon: "award",
    title: "Dean’s List Award",
    description:
      "Recognized for outstanding academic performance at Bennett University.",
    accent: "#38bdf8",
    link: "https://drive.google.com/file/d/1xGZHoHcjoNY2TYSoA4w3wLLDp1-8Q-dS/view",
    linkLabel: "View Certificate",
  },
  {
    id: 2,
    icon: "trophy",
    title: "Scholarship",
    description:
      "Awarded the Academic Excellence Scholarship at Bennett University.",
    accent: "#a78bfa",
  },
  {
    id: 3,
    icon: "hack",
    title: "Hackathon",
    description: "Led development of KindBasket MVP at Hackaccino 3.0 (2025).",
    accent: "#22c55e",
    link: "https://github.com/Rishabh-1029/KindBasket",
    linkLabel: "View Project",
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
          <h2>
            <span className="gradient-text">ACHIEVEMENTS</span>
          </h2>
          <p>
            Recognition and achievements from my academic and technical journey
          </p>
        </div>

        {/* Cards */}
        <div className="achievements-grid">
          {achievementsData.map((achieve) => {
            const cardContent = (
              <>
                <div className="achievement-icon">{iconMap[achieve.icon]}</div>
                <div className="achievement-content">
                  <h3>{achieve.title}</h3>
                  <p>{achieve.description}</p>
                </div>
                {achieve.link && (
                  <span className="achievement-link">
                    {achieve.linkLabel}
                    <FaExternalLinkAlt />
                  </span>
                )}
              </>
            );

            return achieve.link ? (
              <a
                key={achieve.id}
                className="achievement-card"
                href={achieve.link}
                target="_blank"
                rel="noreferrer"
                style={{ "--achievement-accent": achieve.accent }}
              >
                {cardContent}
              </a>
            ) : (
              <article
                key={achieve.id}
                className="achievement-card"
                style={{ "--achievement-accent": achieve.accent }}
              >
                {cardContent}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
