import { useEffect } from "react";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import { BackToProjectsLink } from "./CaseStudyNavigation";
import TrueDriveLogo from "../assets/TrueDrive.png";
import "./TrueDriveCaseStudy.css";

const LIVE_URL = "https://truedrive.netlify.app/";
const GITHUB_URL = "https://github.com/Rishabh-1029/CarAdvisor-AI";

const technologies = [
  "React",
  "Python",
  "FastAPI",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "PostgreSQL",
];

const architectureSteps = [
  {
    number: "01",
    title: "Buyer preferences",
    description:
      "City, budget, fuel type, seating, transmission, and expected usage.",
  },
  {
    number: "02",
    title: "React application",
    description:
      "Collects preferences and presents ranked vehicles, cost reports, and loan estimates.",
  },
  {
    number: "03",
    title: "FastAPI services",
    description:
      "Runs recommendation, ownership forecasting, and finance calculations.",
  },
  {
    number: "04",
    title: "Vehicle data",
    description:
      "A curated car dataset supports filtering, similarity ranking, and report details.",
  },
];

const TrueDriveCaseStudy = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "TrueDrive Case Study | Rishabh Surana";
    description?.setAttribute(
      "content",
      "How I built TrueDrive, a car recommendation and ownership cost analysis app, from initial idea through development and deployment.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <main className="truedrive-case-study">
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
            <p className="case-study-eyebrow">
              Independent project · November 2025 – February 2026
            </p>
            <h1>
              Making car buying <span className="gradient-text">clearer.</span>
            </h1>
            <p className="case-study-lede">
              TrueDrive brings car recommendations, ownership cost estimates,
              and EMI planning into one decision-making experience.
            </p>

            <div className="case-study-actions">
              <a
                href={LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-button case-study-button-primary"
              >
                Open live app <FaExternalLinkAlt aria-hidden="true" />
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
            <img src={TrueDriveLogo} alt="TrueDrive" />
            <span>Recommendation · Forecasting · Finance</span>
          </div>
        </header>

        <section className="case-study-facts" aria-label="Project details">
          <div>
            <span className="case-study-fact-label">My role</span>
            <p>Solo project</p>
            <small>Ideation, development, and deployment</small>
          </div>
          <div>
            <span className="case-study-fact-label">Testing</span>
            <p>Manual testing</p>
            <small>Tested using multiple sources</small>
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
            <span className="case-study-section-index">01 / THE PROBLEM</span>
            <h2>Compare the car and the cost of owning it.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              Choosing a car means balancing preferences with purchase price,
              day-to-day running costs, and financing. Those decisions are
              often considered separately.
            </p>
            <p>
              I built TrueDrive to bring those questions into one flow: find
              vehicles that fit a buyer’s requirements, compare projected
              ownership costs, and understand the loan repayment path.
            </p>
          </div>
        </section>

        <section className="case-study-section case-study-approach">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">02 / THE APPROACH</span>
            <h2>From requirements to a more complete comparison.</h2>
          </div>
          <div className="case-study-feature-grid">
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">01</span>
              <h3>Preference-based recommendations</h3>
              <p>
                Buyers can set a city, budget, fuel type, seating capacity,
                transmission, and expected usage. TrueDrive filters by
                requirements and ranks relevant cars by similarity.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">02</span>
              <h3>Ownership cost forecast</h3>
              <p>
                Reports combine estimated fuel, maintenance, and insurance
                costs into a projected total cost of ownership for up to three
                years.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">03</span>
              <h3>Loan planning</h3>
              <p>
                The EMI tools show monthly payments, principal and interest,
                and how the remaining loan balance changes over the tenure.
              </p>
            </article>
          </div>
        </section>

        <section className="case-study-section case-study-architecture">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">03 / SYSTEM DESIGN</span>
            <h2>A full-stack path from buyer input to useful estimates.</h2>
          </div>
          <div
            className="case-study-architecture-flow"
            role="list"
            aria-label="TrueDrive system flow"
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
            The backend uses FastAPI with Python data and machine learning
            libraries. The vehicle dataset is structured for database and
            file-based use.
          </p>
        </section>

        <section className="case-study-demo-section">
          <div className="case-study-demo-heading">
            <div>
              <span className="case-study-section-index">04 / LIVE DEMO</span>
              <h2>
                Explore <span className="gradient-text">TrueDrive</span>
              </h2>
            </div>
            <a href={LIVE_URL} target="_blank" rel="noopener noreferrer">
              Open in a new tab <FaExternalLinkAlt aria-hidden="true" />
            </a>
          </div>
          <div className="case-study-iframe-frame">
            <iframe
              src={LIVE_URL}
              title="Live TrueDrive car recommendation app"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="fullscreen"
              allowFullScreen
            />
          </div>
          <p className="case-study-iframe-note">
            If the live app does not load here, open it directly in a new tab.
          </p>
        </section>

        <section className="case-study-section case-study-validation">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">05 / VALIDATION</span>
            <h2>Manually tested with multiple sources.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              I manually tested TrueDrive using multiple sources.
            </p>
            <p>
              Fuel and ownership estimates depend on the available historical
              data and the usage assumptions entered for each scenario.
            </p>
          </div>
        </section>

        <footer className="case-study-footer">
          <BackToProjectsLink label="Back to all projects" />
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="case-study-footer-cta"
          >
            Try TrueDrive <FaArrowRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </main>
  );
};

export default TrueDriveCaseStudy;
