import "./App.css";
import Hero from "./Hero/Hero";
import Navbar from "./Navbar/Navbar";
import Education from "./Education/Education";
import Experience from "./Experience/Experience";
import Skills from "./Skills/Skills";
import Projects from "./Project/Projects";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Education />
      <Experience />
      <Skills />
      <Projects />
    </>
  );
}

export default App;
