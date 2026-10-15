import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaArrowRight } from "react-icons/fa";
import { usePublicContent } from "../content/usePublicContent.js";
import "./Projects.css";

// Original Image Assets
import EasyLearn from "../assets/EasyLearn.png";
import VIDESLOGO from "../assets/VIDES.png";
import TrurDrive from "../assets/TrueDrive.png";
import VasitumLogo from "../assets/vaistum.png";
import ANPRLOGO from "../assets/ANPRLOGO.jpeg";
import BlogstoryLogo from "../assets/BlogStory.png";
import RateExLogo from "../assets/RateEx.svg";
import PortfolioLogo from "../assets/Portfolio.svg";

// Mappings for older items seamlessly transitioning
const assetMap = {
  TrueDrive: {
    logo: TrurDrive,
    gradient: "navy-gradient",
    glow: "rgba(56, 189, 248, 0.24)",
  },
  EasyLearn: {
    logo: EasyLearn,
    gradient: "blue-gradient",
    glow: "rgba(99, 102, 241, 0.28)",
  },
  VIDES: {
    logo: VIDESLOGO,
    gradient: "white-gradient",
    glow: "rgba(56, 217, 195, 0.22)",
  },
  ANPR: {
    logo: ANPRLOGO,
    gradient: "from-rose-600",
    glow: "rgba(56, 126, 255, 0.24)",
  },
  BlogStory: {
    logo: BlogstoryLogo,
    gradient: "from-purple-600",
    glow: "rgba(167, 139, 250, 0.24)",
  },
  Vasitum: {
    logo: VasitumLogo,
    gradient: "royal-blue",
    glow: "rgba(96, 165, 250, 0.25)",
  },
  "Vasitum-Dashboard": {
    logo: VasitumLogo,
    gradient: "royal-blue",
    glow: "rgba(96, 165, 250, 0.25)",
  },
  Portfolio: {
    logo: PortfolioLogo,
    gradient: "portfolio-gradient",
    glow: "rgba(167, 139, 250, 0.24)",
  },
  RateEx: {
    logo: RateExLogo,
    gradient: "rateex-gradient",
    glow: "rgba(56, 217, 195, 0.24)",
  },
  "Vasitum Dashboard": {
    logo: VasitumLogo,
    gradient: "royal-blue",
    glow: "rgba(96, 165, 250, 0.25)",
  },
};

const caseStudyRoutes = {
  truedrive: "/projects/truedrive",
  vides: "/projects/vides",
  easylearn: "/projects/easylearn",
  portfolio: "/projects/portfolio",
  rateex: "/projects/rateex",
  blogstory: "/projects/blogstory",
  anpr: "/projects/anpr",
  "vasitum dashboard": "/projects/vasitum-dashboard",
};

const projectOrder = [
  "truedrive",
  "rateex",
  "portfolio",
  "easylearn",
  "vides",
  "anpr",
  "blogstory",
  "vasitum dashboard",
];
const projectOrderIndex = new Map(
  projectOrder.map((title, index) => [title, index]),
);
const normalizeProjectTitle = (title) =>
  title.trim().toLowerCase().replace(/[-_]+/g, " ");

const MotionDiv = motion.div;

const Projects = () => {
  const { projects } = usePublicContent();
  const navigate = useNavigate();
  const orderedProjects = [...projects].sort((left, right) => {
    const leftIndex = projectOrderIndex.get(normalizeProjectTitle(left.title));
    const rightIndex = projectOrderIndex.get(normalizeProjectTitle(right.title));
    return (
      (leftIndex ?? Number.MAX_SAFE_INTEGER) -
      (rightIndex ?? Number.MAX_SAFE_INTEGER)
    );
  });

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
          {orderedProjects.length === 0 ? (
            <p>
              No projects to display yet. Add some from the Admin Dashboard!
            </p>
          ) : (
            orderedProjects.map((project, index) => {
              const mappedAssets = assetMap[project.title] || {
                logo: "",
                gradient: "default-gradient",
              };
              const normalizedTitle = normalizeProjectTitle(project.title);
              const caseStudyRoute = caseStudyRoutes[normalizedTitle];
              const projectLogo = ["portfolio", "rateex"].includes(
                normalizedTitle,
              )
                ? mappedAssets.logo
                : project.logo || mappedAssets.logo;

              return (
                <MotionDiv
                  key={project.id}
                  className={`project-card glass-card${
                    caseStudyRoute ? " project-card--clickable" : ""
                  }`}
                  style={{
                    "--project-glow": mappedAssets.glow || "rgba(0, 240, 255, 0.2)",
                  }}
                  onClick={(event) => {
                    if (
                      !caseStudyRoute ||
                      event.target.closest("a, button")
                    ) {
                      return;
                    }
                    navigate(caseStudyRoute);
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Top Gradient Banner Restored */}
                  <div className={`project-banner ${mappedAssets.gradient}`}>
                    {projectLogo && (
                      <img
                        src={projectLogo}
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
                      {caseStudyRoute && (
                        <Link
                          to={caseStudyRoute}
                          className="project-case-study-link"
                        >
                          <span>View case study</span>
                          <FaArrowRight aria-hidden="true" />
                        </Link>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="project-source-link"
                        >
                          <FaGithub aria-hidden="true" />
                          <span>Source</span>
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
