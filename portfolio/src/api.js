// Central API base URL — driven by environment variable.
// For local dev:      VITE_API_BASE_URL=http://localhost:8000   (in portfolio/.env)
// For production:     VITE_API_BASE_URL=https://your-backend.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
