import "./Hero.css";
import profileImg from "../assets/profile.jpg"; // add your image here
import { motion } from "framer-motion";
import TaglineStrip from "../TaglineStrip";

const MotionDiv = motion.div;

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        {/* Text CONTENT */}
        <MotionDiv
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="hero-title">
            Hi, I’m <span className="gradient-text">Rishabh Surana</span>
          </h1>

          <p className="hero-credentials">
            <strong>Software Engineer</strong>
            <span aria-hidden="true">·</span>
            <span>B.Tech CSE (AI/ML), Bennett University</span>
          </p>

          <p className="hero-tagline">
            I build intelligent systems, not just scripts.
          </p>

          <p className="hero-subtext">
            From custom AI/ML pipelines to reliable, scalable systems, I bring
            core development skills together with product-focused
            infrastructure.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn primary glass-button">
              View Projects
            </a>
            <a
              href="https://drive.google.com/uc?export=download&id=1nM729CremlCaPDt--d75wJFrxIE6lZ4h"
              target="_blank"
              rel="noopener noreferrer"
              className="btn secondary glass-button"
            >
              Download Resume
            </a>
          </div>
        </MotionDiv>

        {/* Profile IMAGE */}
        <MotionDiv
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="profile-glow"></div>
          <div className="profile-frame">
            <img src={profileImg} alt="Rishabh Surana" />
          </div>
        </MotionDiv>
      </div>
      <TaglineStrip />
    </section>
  );
};

export default Hero;
