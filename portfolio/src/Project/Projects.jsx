import { motion } from "framer-motion";
import { FaGithub, FaCode } from "react-icons/fa";
import { usePublicContent } from "../content/usePublicContent.js";
import "./Projects.css";

// Original Image Assets
import EasyLearn from "../assets/EasyLearn.png";
import VIDESLOGO from "../assets/VIDES.png";
import TrurDrive from "../assets/TrueDrive.png";
import VasitumLogo from "../assets/vaistum.png";
import ANPRLOGO from "../assets/ANPRLOGO.jpeg";
import BlogstoryLogo from "../assets/BlogStory.png";

// Mappings for older items seamlessly transitioning
const assetMap = {
  TrueDrive: { logo: TrurDrive, gradient: "navy-gradient" },
  EasyLearn: { logo: EasyLearn, gradient: "blue-gradient" },
  VIDES: { logo: VIDESLOGO, gradient: "white-gradient" },
  ANPR: { logo: ANPRLOGO, gradient: "from-rose-600" },
  BlogStory: { logo: BlogstoryLogo, gradient: "from-purple-600" },
  Vasitum: { logo: VasitumLogo, gradient: "royal-blue" },
  "Vasitum-Dashboard": { logo: VasitumLogo, gradient: "royal-blue" },
};

const MotionDiv = motion.div;

const Projects = () => {
  const { projects } = usePublicContent();

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        {/* Header */}
        <MotionDiv
          className="projects-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            <span className="gradient-text">PROJECTS</span>
          </h2>
          <p className="section-subtext">
            Exploring multiple domains through projects in{" "}
            <strong>Full-Stack, AI, CV,</strong> and <strong>LLMs</strong>
          </p>
        </MotionDiv>

        {/* Grid */}
        <div className="projects-grid">
          {projects.length === 0 ? (
            <p>
              No projects to display yet. Add some from the Admin Dashboard!
            </p>
          ) : (
            projects.map((project, index) => {
              const mappedAssets = assetMap[project.title] || {
                logo: "",
                gradient: "default-gradient",
              };

              return (
                <MotionDiv
                  key={project.id}
                  className="project-card glass-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Top Gradient Banner Restored */}
                  <div className={`project-banner ${mappedAssets.gradient}`}>
                    {(project.logo || mappedAssets.logo) && (
                      <img
                        src={project.logo || mappedAssets.logo}
                        alt={`${project.title} logo`}
                        className="project-logo"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="project-content">
                    <span className="project-period">{project.period}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    {/* Tech Stack */}
                    <div className="project-tech">
                      {project.tech &&
                        project.tech
                          .split(",")
                          .map((tech, i) => <span key={i}>{tech.trim()}</span>)}
                    </div>

                    {/* Links */}
                    <div className="project-links">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaGithub /> GitHub
                        </a>
                      )}
                      {project.live?.trim() && (
                        <a href={project.live} target="_blank" rel="noreferrer">
                          <FaCode /> {project.title}.com
                        </a>
                      )}
                    </div>
                  </div>
                </MotionDiv>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
