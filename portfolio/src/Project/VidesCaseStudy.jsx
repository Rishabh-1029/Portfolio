import { useEffect } from "react";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import { BackToProjectsLink } from "./CaseStudyNavigation";
import VIDESLogo from "../assets/VIDES.png";
import "./TrueDriveCaseStudy.css";

const GITHUB_URL = "https://github.com/Rishabh-1029/VIDES";
const LIVE_URL = "https://vides.onrender.com/";

const technologies = [
  "Python 3.10+",
  "YOLOv8",
  "DeepSORT",
  "OpenCV",
  "NumPy",
  "Pandas",
  "Faster R-CNN (separate experiment)",
];

const architectureSteps = [
  {
    number: "01",
    title: "Video feed",
    description: "Live camera feed or recorded traffic video enters the pipeline.",
  },
  {
    number: "02",
    title: "Detect and track",
    description:
      "YOLOv8 detects vehicles and DeepSORT maintains their identities across frames.",
  },
  {
    number: "03",
    title: "Analyze movement",
    description:
      "OpenCV supports bird’s-eye view region analysis and frame-to-frame speed estimation.",
  },
  {
    number: "04",
    title: "Surface events",
    description:
      "Modular checks flag overspeeding, wrong-way movement, stalling, accidents, and heavy vehicles.",
  },
];

const VidesCaseStudy = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "VIDES Case Study | Rishabh Surana";
    description?.setAttribute(
      "content",
      "Explore VIDES, a deployed real-time traffic monitoring system for vehicle detection, tracking, speed estimation, and traffic-event detection.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <main className="truedrive-case-study vides-case-study">
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
              Independent project · June – July 2025
            </p>
            <h1>
              Making traffic <span className="gradient-text">visible.</span>
            </h1>
            <p className="case-study-lede">
              VIDES processes live or recorded traffic video, tracks vehicles
              over time, estimates movement and speed, and flags events such as
              overspeeding, wrong-way travel, and stalling.
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
                href="#vides-demo"
                className="case-study-button case-study-button-secondary"
              >
                View embedded demo <FaArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="case-study-project-mark">
            <div className="case-study-mark-glow" />
            <img src={VIDESLogo} alt="VIDES" />
            <span>Vehicle detection · Tracking · Event monitoring</span>
          </div>
        </header>

        <section className="case-study-facts" aria-label="Project details">
          <div>
            <span className="case-study-fact-label">My role</span>
            <p>Solo project</p>
            <small>Built independently</small>
          </div>
          <div>
            <span className="case-study-fact-label">Testing</span>
            <p>Live deployment</p>
            <small>Also tested with a live camera feed</small>
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
            <h2>Turn moving traffic into trackable events.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              A traffic video feed contains more than vehicle counts. Tracking
              how vehicles move through a scene can help identify patterns and
              events that need attention.
            </p>
            <p>
              I built VIDES as a modular computer vision pipeline that detects
              vehicles, follows them between frames, analyzes their movement,
              and flags defined traffic events.
            </p>
          </div>
        </section>

        <section className="case-study-section case-study-approach">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">02 / THE APPROACH</span>
            <h2>Connect detection, tracking, and traffic rules.</h2>
          </div>
          <div className="case-study-feature-grid">
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">01</span>
              <h3>Vehicle detection and tracking</h3>
              <p>
                YOLOv8 detects vehicles while DeepSORT connects detections
                across video frames, making movement analysis possible.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">02</span>
              <h3>Spatial and speed analysis</h3>
              <p>
                Bird’s-eye view transformation supports region analysis, and
                frame-to-frame motion is used to estimate vehicle speed.
              </p>
            </article>
            <article className="case-study-feature-card">
              <span className="case-study-feature-number">03</span>
              <h3>Modular event detection</h3>
              <p>
                Separate event checks cover overspeeding, opposite-direction
                movement, stalling, accidents, and heavy vehicle presence.
              </p>
            </article>
          </div>
        </section>

        <section className="case-study-section case-study-architecture">
          <div className="case-study-section-heading">
            <span className="case-study-section-index">03 / SYSTEM DESIGN</span>
            <h2>A video pipeline that builds context over time.</h2>
          </div>
          <div
            className="case-study-architecture-flow"
            role="list"
            aria-label="VIDES system flow"
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
            The main detection pipeline uses YOLOv8 and DeepSORT. A separate
            Faster R-CNN model was explored independently to compare detection
            approaches.
          </p>
        </section>

        <section className="case-study-demo-section" id="vides-demo">
          <div className="case-study-demo-heading">
            <div>
              <span className="case-study-section-index">04 / LIVE DEMO</span>
              <h2>
                Explore <span className="gradient-text">VIDES</span>
              </h2>
            </div>
            <a href={LIVE_URL} target="_blank" rel="noopener noreferrer">
              Open in a new tab <FaExternalLinkAlt aria-hidden="true" />
            </a>
          </div>
          <div className="case-study-iframe-frame">
            <iframe
              src={LIVE_URL}
              title="Live VIDES traffic monitoring application"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="camera; fullscreen"
              allowFullScreen
            />
          </div>
          <p className="case-study-iframe-note">
            If the live app does not load in this preview, open it directly in a
            new tab. Camera access may require browser permission.
          </p>
        </section>

        <section
          className="case-study-section case-study-validation"
          id="vides-validation"
        >
          <div className="case-study-section-heading">
            <span className="case-study-section-index">05 / VALIDATION</span>
            <h2>Tested with a live camera feed.</h2>
          </div>
          <div className="case-study-section-copy">
            <p>
              I tested VIDES using a live camera feed to exercise vehicle
              detection, tracking, and event analysis on incoming video.
            </p>
            <p>
              The deployed app is available above, and the repository includes
              the project code and setup details.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="case-study-inline-link"
            >
              Open the VIDES repository <FaExternalLinkAlt aria-hidden="true" />
            </a>
          </div>
        </section>

        <footer className="case-study-footer">
          <BackToProjectsLink label="Back to all projects" />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="case-study-footer-cta"
          >
            View VIDES source <FaArrowRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </main>
  );
};

export default VidesCaseStudy;
