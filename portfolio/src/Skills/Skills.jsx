import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api.js";
import "./Skills.css";
import {
  SiPytorch,
  SiTensorflow,
  SiFastapi,
  SiLangchain,
  SiScikitlearn,
  SiCodecrafters,
  SiBlackmagicdesign,
  SiOllama,
  SiHuggingface
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
  FaCamera,
  FaTools,
  FaBolt
} from "react-icons/fa";
import { TbRobotFace } from "react-icons/tb";
import { DiMysql, DiMongodb } from "react-icons/di";
import { AiOutlineCodepen } from "react-icons/ai";
import { TfiWorld } from "react-icons/tfi";

const categoryIconMap = {
  "Programming Languages": <FaCode />,
  "Core Concepts": <FaProjectDiagram />,
  "AI & ML": <FaRobot />,
  "Web Development": <TfiWorld />,
  "Tools & Frameworks": <FaTools />
};

const skillIconMap = {
  "Python": <FaPython />,
  "Java": <FaJava />,
  "JavaScript": <FaJs />,
  "DSA": <SiBlackmagicdesign />,
  "OOP": <SiCodecrafters />,
  "Low-Level Design": <AiOutlineCodepen />,
  "System Architecture": <FaProjectDiagram />,
  "Machine Learning": <FaBrain />,
  "LLMs & RAG": <TbRobotFace />,
  "Computer Vision": <FaCamera />,
  "HTML / CSS": <FaHtml5 />,
  "ReactJS": <FaReact />,
  "SQL": <DiMysql />,
  "MongoDB": <DiMongodb />,
  "FastAPI": <SiFastapi />,
  "vLLM": <FaBolt />,
  "LangChain": <SiLangchain />,
  "Ollama (Local LLMs)": <SiOllama />,
  "PyTorch": <SiPytorch />,
  "Hugging Face": <SiHuggingface />,
  "OpenCV": <FaCamera />,
  "TensorFlow": <SiTensorflow />,
  "Scikit-learn": <SiScikitlearn />,
  "Docker": <FaDocker />,
  "Git": <FaGit />
};

const getCategoryIcon = (category) => categoryIconMap[category] || <FaTools />;
const getSkillIcon = (skillName) => skillIconMap[skillName.trim()] || <FaCode />;

const Skills = () => {
  const [skillsData, setSkillsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/skills`);
        setSkillsData(res.data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

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
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="skills-card hover-lift" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="skills-card-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="skeleton skeleton-icon" style={{width: '30px', height: '30px'}}></div>
                <div className="skeleton skeleton-title" style={{width: '40%', margin: 0}}></div>
              </div>
              <div className="skills-list" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="skeleton" style={{width: '100px', height: '36px', borderRadius: '18px'}}></div>
                <div className="skeleton" style={{width: '120px', height: '36px', borderRadius: '18px'}}></div>
                <div className="skeleton" style={{width: '90px', height: '36px', borderRadius: '18px'}}></div>
                <div className="skeleton" style={{width: '140px', height: '36px', borderRadius: '18px'}}></div>
                <div className="skeleton" style={{width: '110px', height: '36px', borderRadius: '18px'}}></div>
              </div>
            </div>
          ))
        ) : skillsData.length === 0 ? (
           <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No skills found. Add some in the admin dashboard.</p>
        ) : (
          skillsData.map((categoryObj, idx) => {
            const skillItems = categoryObj.items ? categoryObj.items.split(",") : [];
            return (
              <div key={idx} className="skills-card hover-lift">
                <div className="skills-card-header">
                  <div className="skills-icon">{getCategoryIcon(categoryObj.category)}</div>
                  <h3>{categoryObj.category}</h3>
                </div>
                <div className="skills-list">
                  {skillItems.map((skillName, i) => (
                    <div key={i} className="skill-pill">
                      <span className="skill-icon">{getSkillIcon(skillName)}</span>
                      <span className="skill-name">{skillName.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Skills;
