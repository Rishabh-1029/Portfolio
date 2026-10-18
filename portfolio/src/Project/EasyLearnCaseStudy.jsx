import { useEffect } from "react";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import EasyLearnLogo from "../assets/easylearn-logo.svg";
import { BackToProjectsLink } from "./CaseStudyNavigation";
import "./TrueDriveCaseStudy.css";

const LIVE_URL = "https://easy-learn-ai.netlify.app/";
const GITHUB_URL = "https://github.com/Rishabh-1029/EasyLearn";

const technologies = [
  "Python",
  "React",
  "WebLLM",
  "WebGPU",
  "FastAPI",
  "Google Drive API",
];

const architectureSteps = [
  {
    number: "01",
    title: "Choose a learning mode",
    description:
      "The learner picks Quick, Guided, or Deep dive, then asks about a topic.",
  },
  {
    number: "02",
    title: "React app and Web Worker",
    description:
      "The browser loads the selected language model and runs it in a Web Worker.",
  },
  {
    number: "03",
    title: "Local WebGPU inference",
    description:
      "WebLLM uses WebGPU to generate the lesson on the learner’s device; the model is cached for later sessions.",
  },
  {
    number: "04",
    title: "Optional save to Drive",
    description:
      "With the learner’s consent, the browser uploads the lesson as a Markdown file to Google Drive.",
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
      "EasyLearn is a browser-based learning app that runs language models locally, explains topics at three depths, and can save lessons to Google Drive.",
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
              EasyLearn is a browser-based learning app that runs a language
              model on the learner’s device and explains topics at three depths.
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
            <img src={EasyLearnLogo} alt="EasyLearn" />
            <span>Local AI · Three learning modes · Google Drive</span>
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
            <small>Local model inference in the browser</small>
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
              deeper technical breakdown of the same subject. EasyLearn offers
              Quick, Guided, and Deep dive modes for those needs.
            </p>
            <p>
              Each mode shapes the lesson differently: Quick gives the core
              idea, Guided builds it step by step, and Deep dive adds detail,
              an example, and a self-check.
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
                Quick, Guided, and Deep dive give learners three ways to
                explore the same concept.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">02</span>
              <h3>Structured explanations</h3>
              <p>
                Guided lessons build step by step; Deep dive adds an example
                and self-check alongside more detail.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">03</span>
              <h3>Chat-based interaction</h3>
              <p>
                Learners can ask about concepts while keeping their prompts and
                answers on their own device during inference.
              </p>
            </article>
          </div>
        </section>

        <section className="case-study-section case-study-architecture">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">04 / SYSTEM DESIGN</span>
            <h2>The model runs in the browser; the backend handles sign-in.</h2>
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
            WebLLM runs in a Web Worker and uses WebGPU for local generation.
            The FastAPI backend handles Google sign-in and the EasyLearn
            session; it does not receive prompts or answers for inference.
            Saving a lesson to Drive is optional and initiated by the learner.
          </p>
        </section>

        <section className="case-study-section case-study-models">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">
              03 / MODELS ON DEVICE
            </span>
            <h2>Choose a model that fits the device.</h2>
          </div>
          <div className="case-study-models-content">
            <div className="case-study-model-grid">
              <article className="case-study-model-card">
                <span>01B</span>
                <h3>Llama 3.2 1B</h3>
                <p>A compact option for getting started with local lessons.</p>
              </article>
              <article className="case-study-model-card">
                <span>02B</span>
                <h3>Gemma 2 2B</h3>
                <p>An alternative small model for on-device explanations.</p>
              </article>
              <article className="case-study-model-card">
                <span>03B</span>
                <h3>Llama 3.2 3B</h3>
                <p>A larger model option for devices that can support it.</p>
              </article>
            </div>
            <p className="case-study-models-note">
              WebLLM downloads the selected model the first time it is used and
              caches it for later sessions. Generation speed and WebGPU support
              depend on the browser and device.
            </p>
          </div>
        </section>

        <section className="case-study-section case-study-validation">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">
              05 / PRIVACY AND SAVING
            </span>
            <h2>Lessons stay on device unless the learner chooses to save.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              Questions and answers are processed by the local model and are
              not sent to the backend or a hosted model API for inference.
              Theme preference and model-usage metadata are stored locally,
              without question or answer text.
            </p>
            <p>
              Google sign-in verifies the learner with the backend. If the
              learner chooses Save to Drive, the browser requests the
              drive.file permission and uploads the lesson as a Markdown file.
            </p>
          </div>
        </section>

        <section className="case-study-demo-section">
          <div className="case-study-demo-heading">
            <div>
              <span className="case-study-section-index">06 / LIVE DEMO</span>
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
              title="Live EasyLearn learning app"
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
