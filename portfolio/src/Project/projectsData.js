import EasyLearn from "../assets/easylearn-logo.svg";
import VIDESLOGO from "../assets/VIDES.png";
import TrurDrive from "../assets/TrueDrive.png";
import VasitumLogo from "../assets/vaistum.png";
import ANPRLOGO from "../assets/ANPRLOGO.jpeg";
import BlogstoryLogo from "../assets/BlogStory.png";
import RateExLogo from "../assets/RateEx.svg";
import PortfolioLogo from "../assets/Portfolio.svg";

export const RATEEX_TECH_STACK_GROUPS = [
  { label: "Backend", technologies: ["Python", "FastAPI"] },
  { label: "Frontend", technologies: ["React"] },
  { label: "Database", technologies: ["PostgreSQL", "MongoDB"] },
];
export const RATEEX_TECH_STACK = RATEEX_TECH_STACK_GROUPS.flatMap(
  ({ technologies }) => technologies,
);

export const EASY_LEARN_DESCRIPTION =
  "A LLM-based learning app with Quick, Guided, and Deep dive modes. It runs SLMs locally with WebGPU to generate explanation notes and can save lessons to Google Drive.";
export const EASY_LEARN_TECH_STACK = [
  "Python",
  "React",
  "WebLLM",
  "WebGPU",
  "FastAPI",
  "Google Drive API",
];

export const projectsData = [
  {
    id: 1,
    title: "TrueDrive",
    period: "November 2025 – February 2026",
    description:
      "AI-powered car recommendation system with expense forecasting and EMI analysis for informed car-buying decisions.",
    tech: ["Python", "ReactJS", "FastAPI", "Scikit-learn", "Pandas", "SQL"],
    gradient: "navy-gradient",
    live: "https://truedrive.netlify.app/",
    github: "https://github.com/Rishabh-1029/CarAdvisor-AI",
    logo: TrurDrive,
  },
  {
    id: 2,
    title: "EasyLearn",
    period: "November 2025 – December 2025",
    description: EASY_LEARN_DESCRIPTION,
    tech: EASY_LEARN_TECH_STACK,
    gradient: "blue-gradient",
    live: "https://easy-learn-ai.netlify.app/",
    github: "https://github.com/Rishabh-1029/EasyLearn",
    logo: EasyLearn,
  },
  {
    id: 3,
    title: "VIDES",
    period: "June 2025 – July 2025",
    description:
      "Real-time traffic monitoring that combines vehicle detection, multi-object tracking, speed estimation, and modular traffic-event detection.",
    tech: ["Python 3.10+", "YOLOv8", "DeepSORT", "OpenCV", "NumPy", "Pandas"],
    gradient: "white-gradient",
    live: "https://vides.onrender.com/",
    github: "https://github.com/Rishabh-1029/VIDES",
    logo: VIDESLOGO,
  },
  {
    id: 4,
    title: "ANPR",
    period: "August 2025",
    description:
      "Real-time Automatic Number Plate Recognition system for vehicles to enhance Traffic Management Systems with efficient license plate detection.",
    tech: ["Python", "PyTorch", "YOLOv8", "EasyOCR", "OpenCV", "FastAPI"],
    gradient: "from-rose-600",
    live: "https://anpr-zh5c.onrender.com",
    github: "https://github.com/Rishabh-1029/ANPR",
    logo: ANPRLOGO,
  },
  {
    id: 5,
    title: "BlogStory",
    period: "December 2024",
    description:
      "High-performance backend API built using FastAPI that supports user authentication, blog management, and secure token-based access using JWT.",
    tech: ["Python", "FastAPI", "SQLAlchemy", "JWT", "Pydantic", "Uvicorn"],
    gradient: "from-purple-600",
    live: "https://blog-story.onrender.com/docs",
    github: "https://github.com/Rishabh-1029/BlogStory",
    logo: BlogstoryLogo,
  },
  {
    id: 6,
    title: "Vasitum Dashboard",
    period: "June 2024",
    description:
      "A functional React dashboard according to a specific Figma design created as part of an on-site internship training task at Vasitum Tech.",
    tech: ["HTML", "CSS", "JavaScript", "EasyOCR", "ReactJS", "REST API"],
    gradient: "royal-blue",
    live: "https://vasitum-rishabh-dashboard.netlify.app/",
    github: "https://github.com/Rishabh-1029/Vasitum-dashboard",
    logo: VasitumLogo,
  },
  {
    id: 7,
    title: "Portfolio",
    period: "Ongoing",
    description:
      "Full-stack portfolio and CMS platform with database-backed content, a protected admin dashboard, Markdown publishing, analytics, and a contact inbox.",
    tech: ["React", "FastAPI", "SQLAlchemy", "PostgreSQL", "JWT", "Mermaid"],
    gradient: "portfolio-gradient",
    live: "https://rishabh-surana.netlify.app/",
    github: "https://github.com/Rishabh-1029/Portfolio",
    logo: PortfolioLogo,
  },
  {
    id: 8,
    title: "RateEx",
    period: "In development",
    description:
      "Reusable rate-limiting infrastructure for services, with an analytics dashboard for understanding API usage. Inspired by managing external API limits in EasyLearn.",
    tech: RATEEX_TECH_STACK,
    gradient: "rateex-gradient",
    live: "",
    github: "https://github.com/Rishabh-1029/rate-limiter",
    logo: RateExLogo,
  },
];
