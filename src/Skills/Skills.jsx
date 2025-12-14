import React from "react";
import "./Skills.css";
import {
  SiPytorch,
  SiTensorflow,
  SiFastapi,
  SiLangchain,
  SiScikitlearn,
  SiCodecrafters,
  SiBlackmagicdesign,
} from "react-icons/si";
import {
  FaPython,
  FaJava,
  FaHtml5,
  FaJs,
  FaReact,
  FaGit,
  FaDocker,
  FaBrain,
  FaProjectDiagram,
  FaRobot,
  FaCode,
  FaLaptopCode,
  FaCamera,
  FaTools,
} from "react-icons/fa";
import { TbRobotFace, TbBrandCpp } from "react-icons/tb";
import { IoLogoCss3 } from "react-icons/io";
import { DiMysql } from "react-icons/di";
import { VscVscode } from "react-icons/vsc";
import { AiOutlineCodepen } from "react-icons/ai";
import { SlMicrophone } from "react-icons/sl";
import { TfiWorld } from "react-icons/tfi";

const skillsData = [
  {
    title: "Programming Languages",
    icon: <FaCode />,
    skills: [
      { name: "Java", icon: <FaJava /> },
      { name: "Python", icon: <FaPython /> },
      { name: "", icon: <TbBrandCpp /> },
      { name: "JavaScript", icon: <FaJs /> },
    ],
  },
  {
    title: "Core Concepts",
    icon: <FaProjectDiagram />,
    skills: [
      { name: "DSA", icon: <SiBlackmagicdesign /> },
      { name: "OOP", icon: <SiCodecrafters /> },
      { name: "Low-Level Design", icon: <AiOutlineCodepen /> },
    ],
  },
  {
    title: "AI & ML",
    icon: <FaRobot />,
    skills: [
      { name: "Machine Learning", icon: <FaBrain /> },
      { name: "NLP", icon: <SlMicrophone /> },
      { name: "LLMs", icon: <TbRobotFace /> },
      { name: "Computer Vision", icon: <FaCamera /> },
    ],
  },
  {
    title: "Web Development",
    icon: <TfiWorld />,
    skills: [
      { name: "HTML", icon: <FaHtml5 /> },
      { name: "CSS", icon: <IoLogoCss3 /> },
      { name: "ReactJS", icon: <FaReact /> },
      { name: "MySQL", icon: <DiMysql /> },
    ],
  },
  {
    title: "Tools & Frameworks",
    icon: <FaTools />,
    skills: [
      { name: "PyTorch", icon: <SiPytorch /> },
      { name: "TensorFlow", icon: <SiTensorflow /> },
      { name: "Scikit-learn", icon: <SiScikitlearn /> },
      { name: "OpenCV", icon: <FaCamera /> },
      { name: "LangChain", icon: <SiLangchain /> },
      { name: "FastAPI", icon: <SiFastapi /> },
      { name: "", icon: <FaGit /> },
      { name: "Docker", icon: <FaDocker /> },
      { name: "VS Code", icon: <VscVscode /> },
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        {/* Header */}
        <div className="skills-header">
          <h2>TECHNICAL SKILLS</h2>
          <p>
            Technologies, programming languages, and core concepts I work with
          </p>
        </div>

        {/* Vertical stacked cards */}
        {skillsData.map((category, idx) => (
          <div key={idx} className="skills-card">
            <div className="skills-card-header">
              <div className="skills-icon">{category.icon}</div>
              <h3>{category.title}</h3>
            </div>
            <div className="skills-list">
              {category.skills.map((skill, i) => (
                <div key={i} className="skill-pill">
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-name">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
