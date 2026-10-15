import "./Experience.css";
import VasitumLogo from "../assets/vaistum.png";
import ComvisionLogo from "../assets/comvision.jpeg";
import Nervesparks from "../assets/Nervesparks.png";
import NextedgeLogo from "../assets/nextedge-logo.webp";
import { FaBuilding } from "react-icons/fa";
import { usePublicContent } from "../content/usePublicContent.js";

const NEXTEDGE_WEBSITE = "https://nextedgetalents.com/";

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
          experienceData.map((exp, index) => {
            const normalizedCompany = exp.company.trim().toLowerCase();
            const companyIcon =
              companyIconMap[exp.company] ||
              (normalizedCompany.includes("nextedge talents")
                ? NextedgeLogo
                : null);
            const isNextedge = normalizedCompany.includes("nextedge talents");
            const experiencePoints = Array.isArray(exp.points)
              ? exp.points
              : [exp.description].filter(Boolean);
            const hasNextedgeWebsite = experiencePoints.some(
              (point) =>
                typeof point !== "string" && point?.link === NEXTEDGE_WEBSITE,
            );
            const displayedPoints =
              isNextedge && !hasNextedgeWebsite
                ? [
                    ...experiencePoints,
                    {
                      text: "Company website",
                      link: NEXTEDGE_WEBSITE,
                      linkText: "Nextedge Talents",
                    },
                  ]
                : experiencePoints;

            return (
              <div key={index} className="experience-card hover-lift">
                <div className="experience-content">
                  {/* Icon */}
                  <div
                    className={`experience-icon${
                      isNextedge ? " experience-icon--nextedge" : ""
                    }`}
                  >
                    {companyIcon ? (
                      <img src={companyIcon} alt={`${exp.company} logo`} />
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
                      {displayedPoints.map((point, i) => (
                        <li key={`${exp.id ?? index}-${i}`}>
                          {typeof point === "string" ? (
                            point
                          ) : point?.link ? (
                            <>
                              {point.text}: {" "}
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
                            point?.text ?? ""
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Experience;
