import { createContext, useContext } from "react";

export const PublicContentContext = createContext({
  projects: [],
  skills: [],
  experiences: [],
  blogs: [],
  isRefreshing: false,
});

export const usePublicContent = () => useContext(PublicContentContext);
