import "./Skills.css";
import { usePublicContent } from "../content/usePublicContent.js";
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
  const { skills: skillsData } = usePublicContent();

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        {/* Header */}
        <div className="skills-header">
          <h2>
            TECHNICAL <span className="gradient-text">SKILLS</span>
          </h2>
          <p>
            Technologies, programming languages, and core concepts I work with
          </p>
        </div>

        {/* Vertical stacked cards */}
        {skillsData.length === 0 ? (
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
