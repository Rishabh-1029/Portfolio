# Portfolio & CMS Platform

A full-stack personal portfolio with a React public site, a FastAPI content API, and a protected admin dashboard. Content, projects, blogs, experience, and contact messages are managed through the backend rather than hard-coded into the deployed site.

**Live site:** [rishabh-surana.netlify.app](https://rishabh-surana.netlify.app/)

---

## Highlights

- Glassmorphism portfolio UI with responsive project, achievement, and education sections.
- Eight dedicated project case studies with project context, technical details, and source or live-demo links where available.
- Subtle animated solar-system artwork in the hero, with a quiet background area around it and reduced-motion support.
- Crawler-readable project and experience metadata, including Open Graph, Twitter cards, Schema.org JSON-LD, and a no-JavaScript content fallback.
- Database-backed content and a protected admin dashboard for managing portfolio data.
- Blog Markdown reader supports Mermaid diagrams with in-modal zoom controls.
- Contact messages are saved to the backend inbox first, then optionally sent as SMTP email alerts without delaying the visitor's success state.
- Responsive contact notification emails with a clear subject, reply-to support, and received time shown in IST.
- Consent-based visitor location context: the form resolves the visitor's city and includes it in the email only when browser location permission is granted.
- Analytics, rate limiting, JWT admin authentication, and password hashing.

---

## Tech Stack

| Area     | Tools                                                                                    |
| -------- | ---------------------------------------------------------------------------------------- |
| Frontend | React 19, Vite, React Router, Framer Motion, Axios, React Icons, React Markdown, Mermaid |
| Backend  | FastAPI, SQLAlchemy, Uvicorn, Pydantic                                                   |
| Data     | SQLite for local development, PostgreSQL for production                                  |

---

## Project Case Studies & Metadata

Each featured project has a dedicated route under `/projects/`. Case studies are available for TrueDrive, RateEx, Portfolio, EasyLearn, VIDES, BlogStory, ANPR, and Vasitum Dashboard. Live demos are embedded where available; otherwise, the case study links to the project source.

The initial HTML in `portfolio/index.html` includes social preview tags and Schema.org data for the project list, case-study routes, repositories, live apps, and professional experience. A `<noscript>` section provides a concise portfolio and experience summary when JavaScript is unavailable.

## Hero Visual

The home hero includes a small SVG solar-system illustration animated with CSS. Its orbital motion is disabled when the visitor requests reduced motion. A soft local backdrop keeps the site-wide particle effect from competing with the illustration.

---

## Blog Markdown & Mermaid

Blog content is authored as Markdown through the CMS and rendered in the public blog modal. Standard Markdown code blocks continue to render as code, while fenced `mermaid` blocks are rendered as diagrams.

Example:

````md
```mermaid
graph TD
  A[Draft Blog] --> B[Preview]
  B --> C[Publish]
```
````

Rendered Mermaid diagrams include zoom out, reset, and zoom in controls inside the diagram box, with scroll support for larger diagrams.

---

## Contact Email Notifications

Each contact submission is persisted in the backend inbox. SMTP alerts are optional and run in a background thread, so email delivery does not hold up the form response.

---

## Visitor Location Context

The contact form requests browser geolocation automatically. When permission is granted, it resolves the city, region, and country through the backend's reverse-geocoding endpoint and displays the detected city in the form. The email alert includes the location context and a map link; it is not stored with the contact message in the database.

When permission is denied or unavailable, no location context is submitted.

---

`Creating, Learning, and Evolving`
