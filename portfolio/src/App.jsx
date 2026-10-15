import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import PortfolioLayout from "./PortfolioLayout";
import AdminDashboard from "./Admin/AdminDashboard";
import TrueDriveCaseStudy from "./Project/TrueDriveCaseStudy";
import VidesCaseStudy from "./Project/VidesCaseStudy";
import EasyLearnCaseStudy from "./Project/EasyLearnCaseStudy";
import PortfolioCaseStudy from "./Project/PortfolioCaseStudy";
import RateExCaseStudy from "./Project/RateExCaseStudy";
import {
  BlogStoryCaseStudy,
  AnprCaseStudy,
  VasitumDashboardCaseStudy,
} from "./Project/AdditionalCaseStudies";
import { PublicContentProvider } from "./content/PublicContentProvider.jsx";

import { useAnalytics } from "./useAnalytics";

// Dummy component to trigger the hook inside Router
const AnalyticsTracker = () => {
  useAnalytics();
  return null;
};

const RouteScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) {
      window.requestAnimationFrame(() =>
        target.scrollIntoView({ block: "start" }),
      );
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  // Read the hidden admin route from environment variables
  const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || "admin";

  return (
    <Router>
      <AnalyticsTracker />
      <RouteScrollManager />
      <Routes>
        <Route
          path="/"
          element={
            <PublicContentProvider>
              <PortfolioLayout />
            </PublicContentProvider>
          }
        />
        <Route path="/projects/truedrive" element={<TrueDriveCaseStudy />} />
        <Route path="/projects/vides" element={<VidesCaseStudy />} />
        <Route path="/projects/easylearn" element={<EasyLearnCaseStudy />} />
        <Route path="/projects/portfolio" element={<PortfolioCaseStudy />} />
        <Route path="/projects/rateex" element={<RateExCaseStudy />} />
        <Route path="/projects/blogstory" element={<BlogStoryCaseStudy />} />
        <Route path="/projects/anpr" element={<AnprCaseStudy />} />
        <Route
          path="/projects/vasitum-dashboard"
          element={<VasitumDashboardCaseStudy />}
        />
        <Route path={`/${ADMIN_ROUTE}/*`} element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
