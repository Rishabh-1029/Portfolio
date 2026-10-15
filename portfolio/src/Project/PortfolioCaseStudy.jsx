import { useEffect } from "react";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import PortfolioLogo from "../assets/Portfolio.svg";
import { BackToProjectsLink } from "./CaseStudyNavigation";
import "./TrueDriveCaseStudy.css";

const LIVE_URL = "https://rishabh-surana.netlify.app/";
const GITHUB_URL = "https://github.com/Rishabh-1029/Portfolio";

const technologies = [
  "React 19",
  "Vite",
  "FastAPI",
  "SQLAlchemy",
  "SQLite",
  "PostgreSQL",
  "JWT",
  "Markdown",
  "Mermaid",
];

const architectureSteps = [
  {
    number: "01",
    title: "Content editing",
    description:
      "A protected admin dashboard manages projects, experience, skills, and blog posts.",
  },
  {
    number: "02",
    title: "FastAPI services",
    description:
      "The API handles public content, authenticated admin operations, contact messages, and analytics.",
  },
  {
    number: "03",
    title: "SQLAlchemy data layer",
    description:
      "Structured content is stored in SQLite for development and PostgreSQL in production.",
  },
  {
    number: "04",
    title: "Public React site",
    description:
      "The portfolio fetches content from the API and keeps a bundled fallback available.",
  },
];

const PortfolioCaseStudy = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "Portfolio Platform Case Study | Rishabh Surana";
    description?.setAttribute(
      "content",
      "A full-stack portfolio platform with a React frontend, FastAPI content API, protected CMS, blog publishing, contact inbox, and analytics.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <main className="truedrive-case-study portfolio-case-study">
      <div className="case-study-shell">
        <nav className="case-study-nav" aria-label="Case study navigation">
          <BackToProjectsLink />
          <a
            href={GITHUB_URL}
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
            <p className="case-study-eyebrow">Ongoing · Full-stack platform</p>
            <h1>
              A portfolio that <span className="gradient-text">does more.</span>
            </h1>
            <p className="case-study-lede">
              This project combines a public portfolio with a content API and
              protected CMS, so projects, experience, skills, blogs, and contact
              messages are handled through one full-stack system.
            </p>

            <div className="case-study-actions">
              <a href="/" className="case-study-button case-study-button-primary">
                Visit the homepage <FaArrowRight aria-hidden="true" />
              </a>
              <a
                href={GITHUB_URL}
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
            <img src={PortfolioLogo} alt="Rishabh Surana portfolio logo" />
            <span>Portfolio · Content platform · CMS</span>
          </div>
        </header>

        <section className="case-study-facts" aria-label="Project details">
          <div>
            <span className="case-study-fact-label">Project type</span>
            <p>Personal full-stack project</p>
            <small>Public site, API, and admin dashboard</small>
          </div>
          <div>
            <span className="case-study-fact-label">Content model</span>
            <p>Database-backed</p>
            <small>SQLite locally · PostgreSQL in production</small>
          </div>
          <div>
            <span className="case-study-fact-label">Built with</span>
            <div className="case-study-tech-list">
              {technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="case-study-section case-study-overview">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">01 / THE IDEA</span>
            <h2>Make the portfolio manageable as it grows.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              A portfolio needs regular updates as projects, experience, and
              writing change. This system moves that content into a backend so
              updates can be made through an admin dashboard.
            </p>
            <p>
              The same application also handles blog rendering, contact
              submissions, and analytics, connecting the visitor-facing site
              with the tools used to maintain it.
            </p>
          </div>
        </section>

        <section className="case-study-section case-study-approach">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">02 / PLATFORM FEATURES</span>
            <h2>One site with the pieces needed to run it.</h2>
          </div>
          <div className="case-study-feature-grid">
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">01</span>
              <h3>Protected content management</h3>
              <p>
                Projects, experience, skills, and blogs are stored as structured
                content and managed through an authenticated dashboard.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">02</span>
              <h3>Technical blog publishing</h3>
              <p>
                Blog posts support Markdown and Mermaid diagrams, with diagrams
                rendered with zoom controls in the reader.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">03</span>
              <h3>Contact and analytics</h3>
              <p>
                Contact messages are saved to an inbox, optional email alerts
                run separately, and analytics record portfolio activity.
              </p>
            </article>
          </div>
        </section>

        <section className="case-study-section case-study-architecture">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">03 / SYSTEM DESIGN</span>
            <h2>A content pipeline from admin edit to public page.</h2>
          </div>
          <div
            className="case-study-architecture-flow"
            role="list"
            aria-label="Portfolio platform system flow"
          >
            {architectureSteps.map((step, index) => (
              <div
                className="case-study-architecture-item"
                key={step.number}
                role="listitem"
              >
                <article className="case-study-architecture-card">
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
                {index < architectureSteps.length - 1 && (
                  <FaArrowRight
                    className="case-study-architecture-arrow"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="case-study-architecture-note">
            The admin route is protected with JWT authentication. The API also
            applies rate limits and stores password hashes for admin access.
          </p>
        </section>

        <section className="portfolio-homepage-section">
          <div className="portfolio-homepage-copy">
            <span className="case-study-section-index">LIVE SITE</span>
            <h2>See the platform from a visitor’s point of view.</h2>
            <p>
              The homepage brings together the public portfolio, project
              details, writing, developer profiles, and contact form.
            </p>
          </div>
          <a href="/" className="portfolio-homepage-link">
            Go to the homepage <FaArrowRight aria-hidden="true" />
          </a>
        </section>

        <footer className="case-study-footer">
          <BackToProjectsLink label="Back to all projects" />
          <a
            href={GITHUB_URL}
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

export default PortfolioCaseStudy;
