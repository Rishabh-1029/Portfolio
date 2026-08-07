import { projectsData } from "../Project/projectsData.js";

export const fallbackProjects = projectsData.map((project, index) => ({
  ...project,
  order_index: project.order_index ?? index,
  tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech,
}));

export const fallbackSkills = [
  {
    id: 1,
    order_index: 0,
    category: "Programming Languages",
    items: "Python, Java, JavaScript",
  },
  {
    id: 2,
    order_index: 1,
    category: "Core Concepts",
    items: "DSA, OOP, Low-Level Design, System Architecture",
  },
  {
    id: 3,
    order_index: 2,
    category: "AI & ML",
    items: "Machine Learning, LLMs & RAG, Computer Vision",
  },
  {
    id: 4,
    order_index: 3,
    category: "Web Development",
    items: "HTML / CSS, ReactJS, SQL, MongoDB",
  },
  {
    id: 5,
    order_index: 4,
    category: "Tools & Frameworks",
    items:
      "FastAPI, vLLM, LangChain, Ollama (Local LLMs), PyTorch, Hugging Face, OpenCV, TensorFlow, Scikit-learn, Docker, Git",
  },
];

export const fallbackExperiences = [
  {
    id: 3,
    order_index: 0,
    role: "Associate Software Engineer",
    company: "Nervesparks India Private Limited",
    period: "February 2026 - Present",
    description: JSON.stringify([
      "Architecting scalable backend systems and integrating AI into production infrastructure",
      "Building and designing a scalable AutoML system capable of performing complex machine learning and standard statistical analysis",
      "Designed and developed a scalable PII redaction and restoration engine capable of processing both text- and image-based formats",
      "Designed and developed a scalable conversational data processing engine supporting emails, tickets, and messages",
      "Focusing on high-throughput data processing and secure integrations",
      "Understanding and applying rigorous engineering standards by enforcing comprehensive documentation",
      "Bridging the gap between raw AI capabilities and user-facing product ecosystems",
    ]),
  },
  {
    id: 1,
    order_index: 1,
    role: "AI INTERN",
    company: "Comvision India Ltd.",
    period: "June 2025 \u2013 August 2025",
    description: JSON.stringify([
      "Contributed to real-time traffic & toll plaza monitoring systems",
      "Developed computer vision models achieving 82%+ mAP with an average IoU > 0.60 for vehicle detection and ATMS applications",
      "Developed Python backend modules for LiDAR-based image generation to enable vehicle type detection",
      "Created FastAPI services for scalable production-ready integration",
    ]),
  },
  {
    id: 2,
    order_index: 2,
    role: "WEB DEVELOPMENT INTERN",
    company: "Vasitum Tech (Maven Workforce)",
    period: "June 2024 \u2013 July 2024",
    description: JSON.stringify([
      { text: "Developed 10+ live and 3+ upcoming modules with ReactJS" },
      {
        text: "Optimized UI components & integrated REST APIs across multiple features",
      },
      {
        text: "Debugged and improved application stability, reducing deployment issues",
      },
      {
        text: "Delivered a production-ready savings management feature to demonstrate the cost-benefit value proposition of the Vasitum platform",
        link: "https://vasitum.com/savings",
        linkText: "vasitum.com/savings",
      },
    ]),
  },
];

export const fallbackBlogs = [
  {
    id: 15,
    order_index: 0,
    title: "System Design",
    image:
      "https://media.licdn.com/dms/image/v2/D5612AQH89lpyxwzF9w/article-cover_image-shrink_720_1280/B56Z42c5k_GwAQ-/0/1779030011587?e=1787184000&v=beta&t=Fq0JiqpwHRWuYeBxGn8sfH99tQhrFsBBbPdOu5ZTgg0",
    content_md:
      "A practical look at how a simple user request travels through DNS, CDNs, load balancers, servers, databases, caches, queues, workers, and observability systems when a product has to scale reliably.",
    external_url:
      "https://www.linkedin.com/pulse/comprehensive-discussion-system-design-building-capable-rishabh--hsegc/",
    published_date: "2026-06-27T04:24:36.995538",
  },
  {
    id: 16,
    order_index: 1,
    title: "Designing ML Solutions",
    image:
      "https://media.licdn.com/dms/image/v2/D5612AQG5tZshptYA3Q/article-cover_image-shrink_720_1280/B56Z7HCzUkGsAQ-/0/1781455861250?e=1787184000&v=beta&t=75jNFhYwczhXNYM1OetDIooZcIld6aRRh-Vlmi4U-g8",
    content_md:
      "Machine learning systems start with the problem, not the algorithm. This note walks through business understanding, data quality, target selection, feature engineering, model training, and evaluation.",
    external_url: null,
    published_date: "2026-08-02T05:24:32.429721",
  },
  {
    id: 6,
    order_index: 2,
    title: "Software Engineering",
    image: "/blogs/images/software-engineering.png",
    content_md:
      "Software engineering is more than writing code. It is a systematic approach to designing, building, operating, and maintaining software that stays functional, adaptable, and understandable over time.",
    external_url: null,
    published_date: "2026-03-07T07:25:16.457180",
  },
  {
    id: 11,
    order_index: 3,
    title: "Software Crisis",
    image: "/blogs/images/software-crisis.webp",
    content_md:
      "Software projects fail when requirements drift, architecture becomes rigid, quality is traded away, and coordination breaks down. This article summarizes the common causes and mitigation habits.",
    external_url: null,
    published_date: "2026-03-08T07:25:16.632307",
  },
  {
    id: 4,
    order_index: 4,
    title: "Project Planning",
    image: "/blogs/images/project-planning.png",
    content_md:
      "Project planning turns abstract goals into a clear engineering path. Strong plans connect scope, timelines, dependencies, delivery risks, and team coordination before execution begins.",
    external_url: null,
    published_date: "2026-03-14T07:25:16.385824",
  },
  {
    id: 2,
    order_index: 5,
    title: "Clean Code",
    image: "/blogs/images/clean-code.png",
    content_md:
      "Clean code is functional code that remains readable, testable, and safe to evolve. The real discipline is making implementation choices that future maintainers can reason about quickly.",
    external_url: null,
    published_date: "2026-03-15T07:25:16.311485",
  },
  {
    id: 13,
    order_index: 6,
    title: "API",
    image: "/blogs/images/api.png",
    content_md:
      "An API defines the contract that lets software systems communicate. Good APIs make integration predictable through clear request formats, response shapes, authentication, and error behavior.",
    external_url: null,
    published_date: "2026-03-21T07:25:16.688239",
  },
  {
    id: 10,
    order_index: 7,
    title: "Dataset",
    image: "/blogs/images/dataset.webp",
    content_md:
      "For AI and ML systems, dataset quality directly shapes model quality. Reliable labels, representative samples, cleaning, and validation matter before any serious model comparison begins.",
    external_url: null,
    published_date: "2026-03-22T07:25:16.602662",
  },
  {
    id: 7,
    order_index: 8,
    title: "TensorFlow",
    image: "/blogs/images/tensorflow.png",
    content_md:
      "TensorFlow provides the tensor operations, automatic differentiation, model-building APIs, and scalable data pipelines needed to train and deploy modern machine learning systems.",
    external_url: null,
    published_date: "2026-03-28T07:25:16.486246",
  },
  {
    id: 3,
    order_index: 9,
    title: "Artificial Neural Network (ANN)",
    image: "/blogs/images/ann.png",
    content_md:
      "Artificial neural networks learn patterns through layered neurons, weighted connections, activation functions, loss calculation, and backpropagation over repeated training cycles.",
    external_url: null,
    published_date: "2026-03-29T07:25:16.344772",
  },
  {
    id: 8,
    order_index: 10,
    title: "Digital Image",
    image: "/blogs/images/digital-image.webp",
    content_md:
      "Digital images are grids of pixels with spatial position and intensity. Sampling controls spatial resolution, while quantization controls how finely color or brightness is represented.",
    external_url: null,
    published_date: "2026-04-04T07:25:16.545951",
  },
  {
    id: 12,
    order_index: 11,
    title: "Vector Embedding",
    image: "/blogs/images/vector-embedding.png",
    content_md:
      "Vector embeddings transform text, images, and other data into dense numerical representations that preserve semantic relationships and make similarity search computationally practical.",
    external_url: null,
    published_date: "2026-04-05T07:25:16.660067",
  },
  {
    id: 9,
    order_index: 12,
    title: "Vector Search",
    image: "/blogs/images/vector-search.webp",
    content_md:
      "Vector search retrieves information by meaning instead of exact keywords. Embeddings, distance metrics, and ANN indexes make semantic retrieval fast enough for real applications.",
    external_url: null,
    published_date: "2026-04-11T07:25:16.573214",
  },
  {
    id: 14,
    order_index: 13,
    title: "Virtual Large Language Model",
    image: "/blogs/images/vLLM.png",
    content_md:
      "vLLM improves LLM serving by managing the KV cache with PagedAttention, reducing memory fragmentation and increasing throughput for concurrent text generation workloads.",
    external_url: null,
    published_date: "2026-04-12T05:17:38.955086",
  },
];

export const fallbackContent = {
  projects: fallbackProjects,
  skills: fallbackSkills,
  experiences: fallbackExperiences,
  blogs: fallbackBlogs,
};
