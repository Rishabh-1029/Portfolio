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
            An <strong>AI-focused Computer Science Engineer</strong> passionate
            about building <strong>intelligent</strong>, scalable, and
            user-centric web applications.
          </p>

          <p className="hero-subtext">
            I enjoy working at the intersection of <strong>AI and Web</strong>,
            turning ideas into real-world products.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn primary">
              View Projects
            </a>
            <a href="/resume.pdf" download className="btn secondary">
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
