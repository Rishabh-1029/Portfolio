import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api.js";
import "./Experience.css";
import VasitumLogo from "../assets/vaistum.png";
import ComvisionLogo from "../assets/comvision.jpeg";
import Nervesparks from "../assets/Nervesparks.png";
import { FaBuilding } from "react-icons/fa";

const companyIconMap = {
  "Vasitum Tech (Maven Workforce)": VasitumLogo,
  "Comvision India Ltd.": ComvisionLogo,
  "Nervesparks India Private Limited": Nervesparks
};

const Experience = () => {
  const [experienceData, setExperienceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/experiences`);
        const parsed = res.data.map(exp => ({
          ...exp,
          points: exp.description ? JSON.parse(exp.description) : []
        }));
        setExperienceData(parsed);
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperiences();
  }, []);

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
        {isLoading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="experience-card hover-lift">
              <div className="experience-content">
                <div className="experience-icon">
                  <div className="skeleton skeleton-icon"></div>
                </div>
                <div className="experience-details" style={{ width: '100%' }}>
                  <div className="experience-top" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ width: '60%' }}>
                      <div className="skeleton skeleton-title" style={{ width: '80%', marginBottom: '0.5rem' }}></div>
                      <div className="skeleton skeleton-text short" style={{ width: '40%' }}></div>
                    </div>
                    <div className="skeleton skeleton-text short" style={{ width: '20%' }}></div>
                  </div>
                  <ul className="experience-points" style={{ listStyle: 'none', paddingLeft: 0, marginTop: '1rem' }}>
                    <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : experienceData.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)'}}>No experiences available yet.</p>
        ) : (
          experienceData.map((exp, index) => (
            <div key={index} className="experience-card hover-lift">
              <div className="experience-content">
                {/* Icon */}
                <div className="experience-icon">
                  {companyIconMap[exp.company] ? (
                    <img src={companyIconMap[exp.company]} alt={exp.company} />
                  ) : (
                    <div style={{fontSize: '2.5rem', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height:'100%'}}>
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
                    {Array.isArray(exp.points) ? exp.points.map((point, i) => (
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
                    )) : <li>{exp.description}</li>}
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
