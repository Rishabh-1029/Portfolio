import { useEffect } from "react";
import {
  FaArrowRight,
  FaCode,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import BlogStoryLogo from "../assets/BlogStory.png";
import AnprLogo from "../assets/ANPRLOGO.jpeg";
import VasitumLogo from "../assets/vaistum.png";
import { BackToProjectsLink } from "./CaseStudyNavigation";
import "./TrueDriveCaseStudy.css";

const caseStudies = {
  blogstory: {
    title: "BlogStory",
    pageTitle: "BlogStory Case Study | Rishabh Surana",
    description:
      "A FastAPI backend for blog management, user authentication, and JWT-protected access.",
    className: "blogstory-case-study",
    eyebrow: "Backend API project · December 2024",
    headlineStart: "A backend for",
    headlineAccent: "publishing with control.",
    lede:
      "BlogStory is a FastAPI backend API for user authentication and blog management, with secure token-based access using JWT.",
    logo: BlogStoryLogo,
    logoAlt: "BlogStory logo",
    logoCaption: "Blog API · Authentication · JWT",
    github: "https://github.com/Rishabh-1029/BlogStory",
    live: "https://blog-story.onrender.com/docs",
    liveLabel: "Open API documentation",
    facts: [
      {
        label: "Project type",
        value: "Backend API",
        detail: "Built with FastAPI",
      },
      {
        label: "Core capability",
        value: "Blog management",
        detail: "User authentication and protected access",
      },
    ],
    technologies: ["Python", "FastAPI", "SQLAlchemy", "JWT", "Pydantic", "Uvicorn"],
    problem: {
      index: "01 / THE PROBLEM",
      title: "Blog content needs a clear, protected API.",
      paragraphs: [
        "A blog service needs to manage content and users while keeping access to protected operations controlled. BlogStory packages those responsibilities behind a backend API.",
        "The project focuses on the service layer: authentication, blog management, and token-based authorization rather than a public-facing publishing interface.",
      ],
    },
    featuresHeading: {
      index: "02 / THE APPROACH",
      title: "Separate API responsibilities into a focused backend.",
    },
    features: [
      {
        title: "Authentication",
        description:
          "User authentication provides the identity layer for operations that require an authorized user.",
      },
      {
        title: "Blog management",
        description:
          "The API supports managing blog content through backend endpoints.",
      },
      {
        title: "JWT-protected access",
        description:
          "Token-based access protects authenticated operations and gives clients a consistent authorization mechanism.",
      },
    ],
    architectureHeading: {
      index: "03 / REQUEST FLOW",
      title: "A request moves through validation, authorization, and persistence.",
    },
    architectureLabel: "BlogStory API request flow",
    architecture: [
      {
        title: "Client request",
        description: "A client calls an authentication or blog management endpoint.",
      },
      {
        title: "FastAPI route",
        description: "The API receives the request and validates its input.",
      },
      {
        title: "JWT authorization",
        description: "Protected operations use token-based access control.",
      },
      {
        title: "Data layer",
        description: "SQLAlchemy supports the backend’s blog and user data operations.",
      },
    ],
    architectureNote:
      "The flow summarizes the responsibilities indicated by the project description and listed stack.",
    closingTitle: "Explore the API and its source.",
    closingText:
      "The deployed API documentation and repository provide the best entry points to inspect BlogStory.",
  },
  anpr: {
    title: "ANPR",
    pageTitle: "ANPR Case Study | Rishabh Surana",
    description:
      "An automatic number plate recognition project combining YOLOv8 detection, OCR, OpenCV, and a FastAPI service.",
    className: "anpr-case-study",
    eyebrow: "Computer vision project · August 2025",
    headlineStart: "Turn vehicle images into",
    headlineAccent: "readable plate data.",
    lede:
      "ANPR combines number plate detection and text recognition to support vehicle identification for traffic management workflows.",
    logo: AnprLogo,
    logoAlt: "ANPR project logo",
    logoCaption: "Plate detection · OCR · Traffic systems",
    github: "https://github.com/Rishabh-1029/ANPR",
    live: "https://anpr-zh5c.onrender.com",
    liveLabel: "Open live application",
    facts: [
      {
        label: "Project type",
        value: "Computer vision system",
        detail: "Automatic number plate recognition",
      },
      {
        label: "Processing path",
        value: "Detection + OCR",
        detail: "Plate localization followed by text recognition",
      },
    ],
    technologies: ["Python", "PyTorch", "YOLOv8", "EasyOCR", "OpenCV", "FastAPI"],
    problem: {
      index: "01 / THE PROBLEM",
      title: "Make vehicle plate identification part of the traffic workflow.",
      paragraphs: [
        "Traffic management systems can use vehicle plate information to identify and track vehicles. ANPR explores automating the step of locating a plate and reading its characters from visual input.",
        "The project combines computer vision and OCR so plate recognition can be exposed as a usable system rather than a model running in isolation.",
      ],
    },
    featuresHeading: {
      index: "02 / THE APPROACH",
      title: "Connect localization, recognition, and an API layer.",
    },
    features: [
      {
        title: "Plate detection",
        description:
          "YOLOv8 identifies number plate regions in the visual input for downstream processing.",
      },
      {
        title: "Character recognition",
        description:
          "EasyOCR reads text from detected plate regions, turning image content into usable plate strings.",
      },
      {
        title: "Service integration",
        description:
          "FastAPI provides an application layer around the recognition workflow, with OpenCV supporting image processing.",
      },
    ],
    architectureHeading: {
      index: "03 / PROCESSING FLOW",
      title: "A visual input passes through detection before recognition.",
    },
    architectureLabel: "ANPR image processing flow",
    architecture: [
      {
        title: "Image input",
        description: "A vehicle image or video frame enters the workflow.",
      },
      {
        title: "Locate plate",
        description: "YOLOv8 detects the number plate region in the image.",
      },
      {
        title: "Read characters",
        description: "EasyOCR recognizes the text in the detected plate crop.",
      },
      {
        title: "Return result",
        description: "The recognition workflow makes plate information available to the application.",
      },
    ],
    architectureNote:
      "The project description lists YOLOv8, EasyOCR, OpenCV, and FastAPI; the flow reflects those stated components.",
    closingTitle: "Try the deployed project or inspect the implementation.",
    closingText:
      "Open the application in a new tab or review the source code for the project details.",
  },
  vasitum: {
    title: "Vasitum Dashboard",
    pageTitle: "Vasitum Dashboard Case Study | Rishabh Surana",
    description:
      "A React dashboard built from a Figma design during an on-site internship training task at Vasitum Tech.",
    className: "vasitum-case-study",
    eyebrow: "Internship training task · June 2024",
    headlineStart: "From Figma design to a",
    headlineAccent: "working dashboard.",
    lede:
      "A functional React dashboard created from a specific Figma design as part of an on-site internship training task at Vasitum Tech.",
    logo: VasitumLogo,
    logoAlt: "Vasitum logo",
    logoCaption: "React · Dashboard · Design implementation",
    github: "https://github.com/Rishabh-1029/Vasitum-dashboard",
    live: "https://vasitum-rishabh-dashboard.netlify.app/",
    liveLabel: "Open live dashboard",
    facts: [
      {
        label: "Context",
        value: "Vasitum Tech internship",
        detail: "On-site training task",
      },
      {
        label: "Project focus",
        value: "Figma to React",
        detail: "A functional dashboard based on a supplied design",
      },
    ],
    technologies: ["HTML", "CSS", "JavaScript", "ReactJS", "REST API", "EasyOCR"],
    problem: {
      index: "01 / THE TASK",
      title: "Translate a supplied design into a functional dashboard.",
      paragraphs: [
        "The internship task was to implement a dashboard based on a specific Figma design. The work called for turning visual structure and styling into a functioning React interface.",
        "The project is a practical design-to-frontend exercise, combining page layout, styling, and the technologies listed for the dashboard implementation.",
      ],
    },
    featuresHeading: {
      index: "02 / THE APPROACH",
      title: "Build the interface around the design’s structure.",
    },
    features: [
      {
        title: "Design translation",
        description:
          "Use the supplied Figma reference to guide the dashboard’s visual hierarchy and page layout.",
      },
      {
        title: "React implementation",
        description:
          "Turn the design into a functional interface with React, HTML, CSS, and JavaScript.",
      },
      {
        title: "Integration-ready stack",
        description:
          "The project details list REST API and EasyOCR alongside the frontend technologies.",
      },
    ],
    architectureHeading: {
      index: "03 / IMPLEMENTATION FLOW",
      title: "A direct path from design reference to deployed page.",
    },
    architectureLabel: "Vasitum dashboard implementation flow",
    architecture: [
      {
        title: "Figma reference",
        description: "Use the supplied design as the visual guide for the dashboard.",
      },
      {
        title: "React structure",
        description: "Represent the dashboard layout and interface in React.",
      },
      {
        title: "Styling and behavior",
        description: "Apply HTML, CSS, and JavaScript to complete the functional UI.",
      },
      {
        title: "Deployed dashboard",
        description: "Publish the completed internship task for browser access.",
      },
    ],
    architectureNote:
      "This case study sticks to the project description and listed technologies; it does not assume unlisted product requirements.",
    closingTitle: "View the dashboard and source.",
    closingText:
      "The deployed page shows the result, and the repository contains the implementation.",
  },
};

const AdditionalCaseStudy = ({ caseStudy }) => {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = caseStudy.pageTitle;
    description?.setAttribute("content", caseStudy.description);

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, [caseStudy]);

  return (
    <main className={`truedrive-case-study additional-case-study ${caseStudy.className}`}>
      <div className="case-study-shell">
        <nav className="case-study-nav" aria-label="Case study navigation">
          <BackToProjectsLink />
          <a
            href={caseStudy.github}
            target="_blank"
            rel="noopener noreferrer"
            className="case-study-nav-github"
          >
            <FaGithub aria-hidden="true" />
            <span>Source code</span>
            <FaExternalLinkAlt aria-hidden="true" />
          </a>
        </nav>

        <header className="case-study-hero">
          <div className="case-study-hero-copy">
            <p className="case-study-eyebrow">{caseStudy.eyebrow}</p>
            <h1>
              {caseStudy.headlineStart}{" "}
              <span className="gradient-text">{caseStudy.headlineAccent}</span>
            </h1>
            <p className="case-study-lede">{caseStudy.lede}</p>
            <div className="case-study-actions">
              <a
                href={caseStudy.live}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-button case-study-button-primary"
              >
                {caseStudy.liveLabel} <FaExternalLinkAlt aria-hidden="true" />
              </a>
              <a
                href={caseStudy.github}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-button case-study-button-secondary"
              >
                <FaGithub aria-hidden="true" /> Source code
              </a>
            </div>
          </div>

          <div className="case-study-project-mark">
            <div className="case-study-mark-glow" />
            <img src={caseStudy.logo} alt={caseStudy.logoAlt} />
            <span>{caseStudy.logoCaption}</span>
          </div>
        </header>

        <section className="case-study-facts" aria-label="Project details">
          {caseStudy.facts.map((fact) => (
            <div key={fact.label}>
              <span className="case-study-fact-label">{fact.label}</span>
              <p>{fact.value}</p>
              <small>{fact.detail}</small>
            </div>
          ))}
          <div>
            <span className="case-study-fact-label">Built with</span>
            <div className="case-study-tech-list">
              {caseStudy.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="case-study-section case-study-overview">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">{caseStudy.problem.index}</span>
            <h2>{caseStudy.problem.title}</h2>
          </div>
          <div className="case-study-section-copy">
            {caseStudy.problem.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="case-study-section case-study-approach">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">
              {caseStudy.featuresHeading.index}
            </span>
            <h2>{caseStudy.featuresHeading.title}</h2>
          </div>
          <div className="case-study-feature-grid">
            {caseStudy.features.map((feature, index) => (
              <article className="case-study-feature-card" key={feature.title}>
                <span className="case-study-feature-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="case-study-section case-study-architecture">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">
              {caseStudy.architectureHeading.index}
            </span>
            <h2>{caseStudy.architectureHeading.title}</h2>
          </div>
          <div
            className="case-study-architecture-flow"
            role="list"
            aria-label={caseStudy.architectureLabel}
          >
            {caseStudy.architecture.map((step, index) => (
              <div
                className="case-study-architecture-item"
                key={step.title}
                role="listitem"
              >
                <article className="case-study-architecture-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
                {index < caseStudy.architecture.length - 1 && (
                  <FaArrowRight
                    className="case-study-architecture-arrow"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="case-study-architecture-note">
            {caseStudy.architectureNote}
          </p>
        </section>

        <section className="case-study-demo-section">
          <div className="case-study-demo-heading">
            <div>
              <span className="case-study-section-index">04 / LIVE PREVIEW</span>
              <h2>
                Explore <span className="gradient-text">{caseStudy.title}</span>
              </h2>
            </div>
            <a
              href={caseStudy.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in a new tab <FaExternalLinkAlt aria-hidden="true" />
            </a>
          </div>
          <div className="case-study-iframe-frame">
            <iframe
              src={caseStudy.live}
              title={`${caseStudy.title} live preview`}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="fullscreen"
              allowFullScreen
            />
          </div>
          <p className="case-study-iframe-note">
            If the site blocks embedding or does not load here, open it directly
            in a new tab.
          </p>
        </section>

        <section className="portfolio-homepage-section additional-project-links">
          <div className="portfolio-homepage-copy">
            <span className="case-study-section-index">PROJECT LINKS</span>
            <h2>{caseStudy.closingTitle}</h2>
            <p>{caseStudy.closingText}</p>
          </div>
          <div className="additional-project-link-group">
            <a
              href={caseStudy.live}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-homepage-link"
            >
              {caseStudy.liveLabel} <FaCode aria-hidden="true" />
            </a>
            <a
              href={caseStudy.github}
              target="_blank"
              rel="noopener noreferrer"
              className="case-study-button case-study-button-secondary"
            >
              GitHub <FaGithub aria-hidden="true" />
            </a>
          </div>
        </section>

        <footer className="case-study-footer">
          <BackToProjectsLink label="Back to all projects" />
          <a
            href={caseStudy.github}
            target="_blank"
            rel="noopener noreferrer"
            className="case-study-footer-cta"
          >
            View source code <FaArrowRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </main>
  );
};

export const BlogStoryCaseStudy = () => (
  <AdditionalCaseStudy caseStudy={caseStudies.blogstory} />
);

export const AnprCaseStudy = () => (
  <AdditionalCaseStudy caseStudy={caseStudies.anpr} />
);

export const VasitumDashboardCaseStudy = () => (
  <AdditionalCaseStudy caseStudy={caseStudies.vasitum} />
);
