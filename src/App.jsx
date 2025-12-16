import "./App.css";
import Hero from "./Hero/Hero";
import Navbar from "./Navbar/Navbar";
import Education from "./Education/Education";
import Experience from "./Experience/Experience";
import Skills from "./Skills/Skills";
import Projects from "./Project/Projects";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";
import Achievements from "./Achievements/Achievements";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Achievements />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
