import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "./api.js";

// Lightweight UA parser – no dependency needed
const parseUA = (ua) => {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Browser
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/OPR\//.test(ua)) browser = "Opera";

  // OS
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

  // Device
  if (/Mobi|Android|iPhone/.test(ua)) device = "Mobile";
  else if (/iPad|Tablet/.test(ua)) device = "Tablet";

  return { browser, os, device };
};

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Only track public routes (ignore admin routes)
    const adminRoute = import.meta.env.VITE_ADMIN_ROUTE || "admin";
    if (location.pathname.includes(adminRoute)) return;

    const { browser, os, device } = parseUA(navigator.userAgent);

    axios.post(`${API_BASE_URL}/api/analytics`, {
      event_type: "page_view",
      path: location.pathname,
      metadata_json: JSON.stringify({
        user_agent: navigator.userAgent,
        browser,
        os,
        device,
        referrer: document.referrer || "direct",
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    }).catch(() => {}); // silently ignore ad-blockers / network errors
  }, [location]);

  return null;
};
