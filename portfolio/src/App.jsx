import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PortfolioLayout from "./PortfolioLayout";
import AdminDashboard from "./Admin/AdminDashboard";
import { PublicContentProvider } from "./content/PublicContentProvider.jsx";

import { useAnalytics } from "./useAnalytics";

// Dummy component to trigger the hook inside Router
const AnalyticsTracker = () => {
  useAnalytics();
  return null;
};

function App() {
  // Read the hidden admin route from environment variables
  const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || "admin";

  return (
    <Router>
      <AnalyticsTracker />
      <Routes>
        <Route
          path="/"
          element={
            <PublicContentProvider>
              <PortfolioLayout />
            </PublicContentProvider>
          }
        />
        <Route path={`/${ADMIN_ROUTE}/*`} element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
