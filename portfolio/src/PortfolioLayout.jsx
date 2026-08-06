import Navbar from "./Navbar/Navbar";
import Hero from "./Hero/Hero";
import Skills from "./Skills/Skills";
import Experience from "./Experience/Experience";
import Projects from "./Project/Projects";
import Education from "./Education/Education";
import Achievements from "./Achievements/Achievements";
import DeveloperProfiles from "./DeveloperProfiles/DeveloperProfiles";
import Blogs from "./Blogs/Blogs";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";

import ParticleBackground from "./ParticleBackground";

function PortfolioLayout() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Achievements />
      <DeveloperProfiles />
      <Blogs />
      <Contact />
      <Footer />
    </>
  );
}

export default PortfolioLayout;
