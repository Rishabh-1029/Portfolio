import "./Experience.css";
import VasitumLogo from "../assets/vaistum.png";
import ComvisionLogo from "../assets/comvision.jpeg";
import Nervesparks from "../assets/Nervesparks.png";
import { FaBuilding } from "react-icons/fa";
import { usePublicContent } from "../content/usePublicContent.js";

const companyIconMap = {
  "Vasitum Tech (Maven Workforce)": VasitumLogo,
  "Comvision India Ltd.": ComvisionLogo,
  "Nervesparks India Private Limited": Nervesparks,
};

const Experience = () => {
  const { experiences: experienceData } = usePublicContent();

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        {/* Header */}
        <div className="experience-header">
          <h2>
            PROFESSIONAL <span className="gradient-text">EXPERIENCE</span>
          </h2>
          <p>
            Experience across AI, computer vision, and full-stack web
            development
          </p>
        </div>

        {/* Experience Cards */}
        {experienceData.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
            No experiences available yet.
          </p>
        ) : (
          experienceData.map((exp, index) => (
            <div key={index} className="experience-card hover-lift">
              <div className="experience-content">
                {/* Icon */}
                <div className="experience-icon">
                  {companyIconMap[exp.company] ? (
                    <img src={companyIconMap[exp.company]} alt={exp.company} />
                  ) : (
                    <div
                      style={{
                        fontSize: "2.5rem",
                        color: "var(--primary-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <FaBuilding />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="experience-details">
                  <div className="experience-top">
                    <div>
                      <h3>{exp.role}</h3>
                      <span className="company">{exp.company}</span>
                    </div>
                    <span className="duration">{exp.period}</span>
                  </div>

                  <ul className="experience-points">
                    {Array.isArray(exp.points) ? (
                      exp.points.map((point, i) => (
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
                      ))
                    ) : (
                      <li>{exp.description}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Experience;
