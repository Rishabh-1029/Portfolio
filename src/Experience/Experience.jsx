import React from "react";
import "./Experience.css";
import VasitumLogo from "../assets/vaistum.png";
import ComvisionLogo from "../assets/comvision.jpeg";

const experienceData = [
  {
    role: "AI INTERN",
    company: "Comvision India Ltd.",
    duration: "June 2025 – August 2025",
    points: [
      "Contributed to real-time traffic & toll plaza monitoring systems.",
      "Built CV models achieving 82%+ mAP with average IoU > 0.60 for vehicle detection.",
      "Developed Python backend modules to improve system reliability.",
      "Created FastAPI services for scalable production-ready integration.",
    ],
    icon: ComvisionLogo,
  },

  {
    role: "WEB DEVELOPMENT INTERN",
    company: "Vasitum Tech (Maven Workforce)",
    duration: "June 2024 – July 2024",
    points: [
      { text: "Developed 10+ live and 3+ upcoming modules with ReactJS" },
      {
        text: "Optimized UI components & integrated REST APIs across multiple features",
      },
      {
        text: "Debugged and improved application stability, reducing deployment issues",
      },
      {
        text: "Delivered production-ready feature for savings management",
        link: "https://vasitum.com/savings",
        linkText: "vasitum.com/savings",
      },
    ],
    icon: VasitumLogo,
  },
];

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        {/* Header */}
        <div className="experience-header">
          <h2>PROFESSIONAL EXPERIENCE</h2>
          <p>
            Experience across AI, computer vision, and full-stack web
            development.
          </p>
        </div>

        {/* Experience Cards */}
        {experienceData.map((exp, index) => (
          <div key={index} className="experience-card hover-lift">
            <div className="experience-content">
              {/* Icon */}
              <div className="experience-icon">
                <img src={exp.icon} alt={exp.company} />
              </div>

              {/* Details */}
              <div className="experience-details">
                <div className="experience-top">
                  <div>
                    <h3>{exp.role}</h3>
                    <span className="company">{exp.company}</span>
                  </div>
                  <span className="duration">{exp.duration}</span>
                </div>

                <ul className="experience-points">
                  {exp.points.map((point, i) => (
                    <li key={i}>
                      {typeof point === "string" ? (
                        point
                      ) : point.link ? (
                        <>
                          {point.text}:{" "}
                          <a
                            href={point.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-link"
                          >
                            {point.linkText}
                          </a>
                        </>
                      ) : (
                        point.text
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
