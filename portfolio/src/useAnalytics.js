import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "./api.js";

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Only track public routes (ignore admin routes)
    const adminRoute = import.meta.env.VITE_ADMIN_ROUTE || "admin";
    if (location.pathname.includes(adminRoute)) return;

    // Send page view event
    axios.post(`${API_BASE_URL}/api/analytics`, {
      event_type: "page_view",
      path: location.pathname,
      metadata_json: JSON.stringify({ user_agent: navigator.userAgent })
    }).catch(err => console.debug("Analytics blocked/failed"));
  }, [location]);

  return null;
};
