import EasyLearn from "../assets/EasyLearn.png";
import VIDESLOGO from "../assets/VIDES.png";
import TrurDrive from "../assets/TrueDrive.png";
import VasitumLogo from "../assets/vaistum.png";
import ANPRLOGO from "../assets/ANPRLOGO.jpeg";
import BlogstoryLogo from "../assets/BlogStory.png";

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
    description:
      "LLM-based chatbot designed to help learners understand topics at different depths of understanding through structured and adaptive explanations.",
    tech: ["Python", "LangChain", "ReactJS", "FastAPI", "Pydantic", "Uvicorn"],
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
      "Vehicle Intelligent Detection & Event System is a Real-time CV-based traffic monitoring for vehicle detection and event tracking in compliance with NHAI.",
    tech: ["Python", "PyTorch", "OpenCV", "YOLO", "Faster R-CNN", "DeepSORT"],
    gradient: "white-gradient",
    live: "",
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
];
