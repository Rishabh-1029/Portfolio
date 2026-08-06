import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api.js";
import { fallbackContent } from "./fallbackContent.js";
import { PublicContentContext } from "./usePublicContent.js";

const CACHE_KEY = "rishabh-portfolio-public-content-v1";
const DEFAULT_REFRESH_DELAY_MS = 700;
const DEFAULT_REQUEST_TIMEOUT_MS = 12000;

const envNumber = (key, fallback) => {
  const value = Number(import.meta.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const REFRESH_DELAY_MS = envNumber(
  "VITE_PUBLIC_CONTENT_REFRESH_DELAY_MS",
  DEFAULT_REFRESH_DELAY_MS
);
const REQUEST_TIMEOUT_MS = envNumber(
  "VITE_PUBLIC_CONTENT_TIMEOUT_MS",
  DEFAULT_REQUEST_TIMEOUT_MS
);

const ordered = (items) =>
  [...items].sort((a, b) => {
    const orderA = Number(a.order_index ?? 0);
    const orderB = Number(b.order_index ?? 0);
    if (orderA !== orderB) return orderA - orderB;

    const idA = Number(a.id ?? 0) || 0;
    const idB = Number(b.id ?? 0) || 0;
    return idA - idB;
  });

const asArray = (value) => (Array.isArray(value) ? value : []);
const asString = (value) => (value == null ? "" : String(value));

const parseExperiencePoints = (item) => {
  if (Array.isArray(item.points)) return item.points;

  const description = asString(item.description).trim();
  if (!description) return [];

  try {
    const parsed = JSON.parse(description);
    return Array.isArray(parsed) ? parsed : [description];
  } catch {
    return [description];
  }
};

const normalizeProjects = (projects) =>
  ordered(asArray(projects)).map((project) => ({
    ...project,
    title: asString(project.title),
    period: asString(project.period),
    description: asString(project.description),
    tech: Array.isArray(project.tech)
      ? project.tech.join(", ")
      : asString(project.tech),
    github: project.github || "",
    live: project.live || "",
    logo: project.logo || "",
  }));

const normalizeSkills = (skills) =>
  ordered(asArray(skills)).map((skill) => ({
    ...skill,
    category: asString(skill.category),
    items: asString(skill.items),
  }));

const normalizeExperiences = (experiences) =>
  ordered(asArray(experiences)).map((experience) => ({
    ...experience,
    role: asString(experience.role),
    company: asString(experience.company),
    period: asString(experience.period),
    description: asString(experience.description),
    points: parseExperiencePoints(experience),
  }));

const normalizeBlogs = (blogs) =>
  ordered(asArray(blogs)).map((blog) => ({
    ...blog,
    title: asString(blog.title).trim(),
    image: blog.image || "",
    content_md: asString(blog.content_md),
    external_url: blog.external_url || "",
    published_date: asString(blog.published_date),
  }));

const normalizeContent = (content) => {
  const source = content || {};

  return {
    projects: normalizeProjects(source.projects),
    skills: normalizeSkills(source.skills),
    experiences: normalizeExperiences(source.experiences),
    blogs: normalizeBlogs(source.blogs),
  };
};

const DEFAULT_CONTENT = normalizeContent(fallbackContent);

const mergeWithFallback = (content) => {
  const normalized = normalizeContent(content);

  return {
    projects: normalized.projects.length
      ? normalized.projects
      : DEFAULT_CONTENT.projects,
    skills: normalized.skills.length ? normalized.skills : DEFAULT_CONTENT.skills,
    experiences: normalized.experiences.length
      ? normalized.experiences
      : DEFAULT_CONTENT.experiences,
    blogs: normalized.blogs.length ? normalized.blogs : DEFAULT_CONTENT.blogs,
  };
};

const readCache = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.content || null;
  } catch {
    return null;
  }
};

const writeCache = (content) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), content })
    );
  } catch {
    // Storage can be disabled in private browsing; the bundled fallback still works.
  }
};

const scheduleBackgroundRefresh = (task) => {
  if (typeof window === "undefined") return () => {};

  let idleId = null;
  const timeoutId = window.setTimeout(() => {
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(task, { timeout: 2000 });
      return;
    }

    task();
  }, REFRESH_DELAY_MS);

  return () => {
    window.clearTimeout(timeoutId);
    if (idleId !== null && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(idleId);
    }
  };
};

const getPublicJson = async (path, signal) => {
  const response = await axios.get(`${API_BASE_URL}${path}`, {
    signal,
    timeout: REQUEST_TIMEOUT_MS,
  });
  return response.data;
};

const settledValue = (result, fallback) =>
  result.status === "fulfilled" ? result.value : fallback;

const fetchLegacyPublicContent = async (signal) => {
  const [projects, skills, experiences, blogs] = await Promise.allSettled([
    getPublicJson("/api/projects", signal),
    getPublicJson("/api/skills", signal),
    getPublicJson("/api/experiences", signal),
    getPublicJson("/api/blogs", signal),
  ]);

  return {
    projects: settledValue(projects, []),
    skills: settledValue(skills, []),
    experiences: settledValue(experiences, []),
    blogs: settledValue(blogs, []),
  };
};

const fetchPublicContent = async (signal) => {
  try {
    return await getPublicJson("/api/public-content", signal);
  } catch (error) {
    if (error?.response?.status === 404) {
      return fetchLegacyPublicContent(signal);
    }
    throw error;
  }
};

export const PublicContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => mergeWithFallback(readCache()));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const cancelRefresh = scheduleBackgroundRefresh(async () => {
      setIsRefreshing(true);

      try {
        const latestContent = await fetchPublicContent(controller.signal);
        const mergedContent = mergeWithFallback(latestContent);

        if (!controller.signal.aborted) {
          setContent(mergedContent);
          writeCache(mergedContent);
        }
      } catch (error) {
        if (
          import.meta.env.DEV &&
          !axios.isCancel(error) &&
          error?.code !== "ERR_CANCELED"
        ) {
          console.debug("Using bundled portfolio content:", error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsRefreshing(false);
        }
      }
    });

    return () => {
      controller.abort();
      cancelRefresh();
    };
  }, []);

  const value = useMemo(
    () => ({
      ...content,
      isRefreshing,
    }),
    [content, isRefreshing]
  );

  return (
    <PublicContentContext.Provider value={value}>
      {children}
    </PublicContentContext.Provider>
  );
};
