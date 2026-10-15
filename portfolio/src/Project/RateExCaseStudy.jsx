import { useEffect } from "react";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import RateExLogo from "../assets/RateEx.svg";
import { RATEEX_TECH_STACK_GROUPS } from "./projectsData.js";
import { BackToProjectsLink } from "./CaseStudyNavigation";
import "./TrueDriveCaseStudy.css";

const GITHUB_URL = "https://github.com/Rishabh-1029/rate-limiter";

const directionSteps = [
  {
    number: "01",
    title: "Connect a service",
    description:
      "Make rate limiting available as reusable infrastructure for services that depend on APIs.",
  },
  {
    number: "02",
    title: "Manage request usage",
    description:
      "Give services a way to control calls against APIs with limited usage.",
  },
  {
    number: "03",
    title: "Analyze activity",
    description:
      "Use a dashboard to make request usage and rate-limit activity easier to understand.",
  },
];

const RateExCaseStudy = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "RateEx Case Study | Rishabh Surana";
    description?.setAttribute(
      "content",
      "RateEx is an in-development project exploring reusable rate-limiting infrastructure and an analytics dashboard for API usage.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <main className="truedrive-case-study rateex-case-study">
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
            <p className="case-study-eyebrow">Personal project · In development</p>
            <h1>
              Rate limits, with <span className="gradient-text">visibility.</span>
            </h1>
            <p className="case-study-lede">
              RateEx is an idea for reusable rate-limiting infrastructure that
              services can use to control API request usage, paired with a
              dashboard for analyzing that activity.
            </p>

            <div className="case-study-status-badge">
              <span aria-hidden="true" /> In development
            </div>

            <div className="case-study-actions">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-button case-study-button-primary"
              >
                View source code <FaExternalLinkAlt aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="case-study-project-mark">
            <div className="case-study-mark-glow" />
            <img src={RateExLogo} alt="RateEx logo" />
            <span>Rate limiting · API usage · Analysis</span>
          </div>
        </header>

        <section className="case-study-facts" aria-label="Project details">
          <div>
            <span className="case-study-fact-label">Status</span>
            <p>In development</p>
            <small>Product and implementation are evolving</small>
          </div>
          <div>
            <span className="case-study-fact-label">Origin</span>
            <p>EasyLearn API usage</p>
            <small>A need surfaced while using an external API</small>
          </div>
          <div>
            <span className="case-study-fact-label">Built with</span>
            <div className="case-study-tech-list rateex-tech-groups">
              {RATEEX_TECH_STACK_GROUPS.map((group) => (
                <div className="rateex-tech-group" key={group.label}>
                  <strong>{group.label}</strong>
                  {group.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="case-study-section case-study-overview">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">01 / THE TRIGGER</span>
            <h2>One API limit exposed a broader infrastructure need.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              EasyLearn depends on an external API with limited usage. That
              constraint made it clear that requests need to be managed
              deliberately as a service grows and more features rely on APIs.
            </p>
            <p>
              RateEx grew from that practical problem into a larger idea: build
              rate-limiting infrastructure that could be used by any service,
              then pair it with analysis so usage is easier to understand.
            </p>
          </div>
        </section>

        <section className="case-study-section case-study-approach">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">02 / PRODUCT DIRECTION</span>
            <h2>Control API usage and make it easier to inspect.</h2>
          </div>
          <div className="case-study-feature-grid">
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">01</span>
              <h3>Reusable across services</h3>
              <p>
                The goal is to make rate limiting available as shared
                infrastructure, instead of solving the same API usage problem
                separately inside each service.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">02</span>
              <h3>Manage limited API usage</h3>
              <p>
                Services need a way to keep requests within an API’s usage
                limits. RateEx is being developed around that need.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">03</span>
              <h3>Analyze through a dashboard</h3>
              <p>
                As an AI/ML engineer, I also want analysis to be part of the
                product, with a dashboard that helps make usage patterns
                visible.
              </p>
            </article>
          </div>
        </section>

        <section className="case-study-section case-study-architecture">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">03 / INTENDED FLOW</span>
            <h2>From service requests to actionable usage insight.</h2>
          </div>
          <div
            className="case-study-architecture-flow rateex-direction-flow"
            role="list"
            aria-label="RateEx intended product flow"
          >
            {directionSteps.map((step, index) => (
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
                {index < directionSteps.length - 1 && (
                  <FaArrowRight
                    className="case-study-architecture-arrow"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="case-study-architecture-note">
            This flow describes the product direction while development is in
            progress; it is not a claim that every part is already implemented.
          </p>
        </section>

        <section className="portfolio-homepage-section rateex-progress-section">
          <div className="portfolio-homepage-copy">
            <span className="case-study-section-index">CURRENT STATUS</span>
            <h2>Building the idea into a reusable tool.</h2>
            <p>
              RateEx is under active development. Follow the repository for the
              implementation as it takes shape; a live demo is not linked yet.
            </p>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-homepage-link"
          >
            Follow on GitHub <FaArrowRight aria-hidden="true" />
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

export default RateExCaseStudy;
