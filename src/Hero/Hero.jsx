import "./Hero.css";
import profileImg from "../assets/profile.jpg"; // add your image here

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        {/* Text CONTENT */}
        <div className="hero-text">
          <h1 className="hero-title">
            Hi, I’m <span>Rishabh Surana</span>
          </h1>

          <p className="hero-tagline">
            B.Tech <strong>Computer Science Engineering</strong> student at{" "}
            <strong>Bennett University</strong>, focused on building end-to-end{" "}
            <strong>scalable applications</strong> by combining{" "}
            <strong>Frontend, Backend,</strong> and <strong>AI</strong>.
          </p>

          <p className="hero-subtext">
            I actively learn, experiment, and contribute to impactful personal
            and open-source projects.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn primary">
              View Projects
            </a>
            <a
              href="https://drive.google.com/uc?export=download&id=1nM729CremlCaPDt--d75wJFrxIE6lZ4h"
              target="_blank"
              rel="noopener noreferrer"
              className="btn secondary"
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* Profile IMAGE */}
        <div className="hero-image">
          <img src={profileImg} alt="Rishabh Surana" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
