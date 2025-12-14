import React from "react";
import "./Projects.css";
import { projectsData } from "./projectsData";
import { FaChartBar, FaShieldAlt, FaGithub } from "react-icons/fa";

const iconMap = {
  chart: <FaChartBar />,
  shield: <FaShieldAlt />,
};

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        {/* Header */}
        <div className="projects-header">
          <h2>PROJECTS</h2>
          <p className="section-subtext">
            Exploring multiple domains through projects in{" "}
            <strong>Full-Stack, AI, Computer Vision,</strong> and{" "}
            <strong>LLMs</strong>.
          </p>
        </div>

        {/* Grid */}
        <div className="projects-grid">
          {projectsData.map((project) => (
            <div key={project.id} className="project-card">
              {/* Top Gradient */}
              <div className={`project-banner ${project.gradient}`}>
                <img
                  src={project.logo}
                  alt={`${project.title} logo`}
                  className="project-logo"
                />
              </div>

              {/* Content */}
              <div className="project-content">
                <span className="project-period">{project.period}</span>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                {/* Tech Stack */}
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </div>

                {/* Links */}
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noreferrer">
                    <FaGithub />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
