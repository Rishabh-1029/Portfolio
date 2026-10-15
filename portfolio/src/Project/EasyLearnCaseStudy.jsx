import { useEffect } from "react";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import EasyLearnLogo from "../assets/EasyLearn.png";
import { BackToProjectsLink } from "./CaseStudyNavigation";
import "./TrueDriveCaseStudy.css";

const LIVE_URL = "https://easy-learn-ai.netlify.app/";
const GITHUB_URL = "https://github.com/Rishabh-1029/EasyLearn";

const technologies = [
  "React",
  "Python",
  "FastAPI",
  "LangChain",
  "Pydantic",
  "Uvicorn",
];

const architectureSteps = [
  {
    number: "01",
    title: "Learner prompt",
    description:
      "A learner asks about a topic and looks for an explanation at a useful level of detail.",
  },
  {
    number: "02",
    title: "React chat interface",
    description:
      "The frontend collects the topic and presents the generated explanation in a chat experience.",
  },
  {
    number: "03",
    title: "FastAPI service",
    description:
      "The Python API connects the web interface with the language-model workflow.",
  },
  {
    number: "04",
    title: "Adaptive response",
    description:
      "LangChain supports generating a structured explanation that can meet different learning depths.",
  },
];

const EasyLearnCaseStudy = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "EasyLearn Case Study | Rishabh Surana";
    description?.setAttribute(
      "content",
      "How I conceived and built EasyLearn, an LLM chatbot for structured explanations at different learning depths. Phase 2 is in progress.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <main className="truedrive-case-study easylearn-case-study">
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
            <p className="case-study-eyebrow">Personal project · Started November 2025</p>
            <h1>
              Learn a topic at <span className="gradient-text">your depth.</span>
            </h1>
            <p className="case-study-lede">
              EasyLearn is an LLM-powered learning chatbot that turns a topic
              into structured explanations at different levels of depth.
            </p>

            <div className="case-study-status-badge">
              <span aria-hidden="true" /> Phase 2 in progress
            </div>

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
            <img src={EasyLearnLogo} alt="EasyLearn" />
            <span>Learning · Conversation · Adaptation</span>
          </div>
        </header>

        <section className="case-study-facts" aria-label="Project details">
          <div>
            <span className="case-study-fact-label">Origin and ownership</span>
            <p>My idea, built independently</p>
            <small>From initial concept through deployment</small>
          </div>
          <div>
            <span className="case-study-fact-label">Live app</span>
            <p>Available to explore</p>
            <small>Phase 2 is in progress</small>
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
            <h2>One topic can call for different levels of explanation.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              A learner may want a quick intuition, a guided explanation, or a
              deeper technical breakdown of the same subject. A fixed answer
              often misses that difference.
            </p>
            <p>
              EasyLearn is my idea for making those levels available in a single
              chat experience, with explanations organized to make a topic
              easier to follow.
            </p>
          </div>
        </section>

        <section className="case-study-section case-study-approach">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">02 / THE APPROACH</span>
            <h2>Make explanation depth part of the learning flow.</h2>
          </div>
          <div className="case-study-feature-grid">
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">01</span>
              <h3>Different learning depths</h3>
              <p>
                The chatbot is designed to present a topic at different levels
                of depth, helping match the explanation to what a learner needs.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">02</span>
              <h3>Structured explanations</h3>
              <p>
                Responses are organized to help learners follow a topic instead
                of receiving an undifferentiated block of generated text.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">03</span>
              <h3>Chat-based interaction</h3>
              <p>
                A conversational interface gives learners a direct way to ask
                about concepts and continue exploring them.
              </p>
            </article>
          </div>
        </section>

        <section className="case-study-section case-study-architecture">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">03 / SYSTEM DESIGN</span>
            <h2>A focused full-stack path from question to explanation.</h2>
          </div>
          <div
            className="case-study-architecture-flow"
            role="list"
            aria-label="EasyLearn system flow"
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
            The frontend uses React. A FastAPI service built with Pydantic and
            Uvicorn connects it to the LangChain-based LLM workflow.
          </p>
        </section>

        <section className="case-study-section case-study-validation">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">04 / WHAT’S NEXT</span>
            <h2>EasyLearn is moving into its second phase.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              Phase 2 is currently in progress. I’m continuing development on
              the project while keeping the live app available to explore.
            </p>
            <p>
              The embedded app shows the current deployment; use the live link
              above if the preview does not load in this page.
            </p>
          </div>
        </section>

        <section className="case-study-demo-section">
          <div className="case-study-demo-heading">
            <div>
              <span className="case-study-section-index">05 / LIVE DEMO</span>
              <h2>
                Try <span className="gradient-text">EasyLearn</span>
              </h2>
            </div>
            <a href={LIVE_URL} target="_blank" rel="noopener noreferrer">
              Open in a new tab <FaExternalLinkAlt aria-hidden="true" />
            </a>
          </div>
          <div className="case-study-iframe-frame">
            <iframe
              src={LIVE_URL}
              title="Live EasyLearn learning chatbot"
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

        <footer className="case-study-footer">
          <BackToProjectsLink label="Back to all projects" />
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="case-study-footer-cta"
          >
            Try EasyLearn <FaArrowRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </main>
  );
};

export default EasyLearnCaseStudy;
