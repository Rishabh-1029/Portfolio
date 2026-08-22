import { useEffect, useMemo, useState } from "react";
import {
  FaCodeBranch,
  FaExternalLinkAlt,
  FaFolderOpen,
  FaGithub,
  FaUsers,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import "./DeveloperProfiles.css";

const GITHUB_USERNAME = "Rishabh-1029";
const LEETCODE_USERNAME = "rspsurana";
const CACHE_KEY = "rishabh-developer-profile-metrics-v5";
const REFRESH_DELAY_MS = 900;
const REQUEST_TIMEOUT_MS = 9000;
const rawManualGithubContributions =
  import.meta.env.VITE_GITHUB_TOTAL_CONTRIBUTIONS ||
  import.meta.env.VITE_GITHUB_CONTRIBUTIONS_LAST_YEAR;
const MANUAL_GITHUB_CONTRIBUTIONS =
  rawManualGithubContributions === undefined ||
  rawManualGithubContributions === ""
    ? Number.NaN
    : Number(rawManualGithubContributions);
const hasManualGithubContributions =
  Number.isFinite(MANUAL_GITHUB_CONTRIBUTIONS) &&
  MANUAL_GITHUB_CONTRIBUTIONS >= 0;

const languageColors = {
  JavaScript: "#f7df1e",
  Python: "#38bdf8",
  CSS: "#a78bfa",
  "Jupyter Notebook": "#f97316",
  Java: "#ef4444",
  HTML: "#22c55e",
  Other: "#94a3b8",
};

const problemTypeColors = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

const fallbackMetrics = {
  github: {
    username: GITHUB_USERNAME,
    name: "Rishabh Surana",
    bio: "Software Engineer (AI Engineer)",
    avatarUrl: "https://avatars.githubusercontent.com/u/144109102?v=4",
    profileUrl: "https://github.com/Rishabh-1029",
    publicRepos: 12,
    followers: 1,
    contributionsTotal: hasManualGithubContributions
      ? MANUAL_GITHUB_CONTRIBUTIONS
      : 316,
    latestPush: "2026-08-02T07:23:26Z",
    topLanguages: [
      { name: "JavaScript", count: 5, color: languageColors.JavaScript },
      {
        name: "Jupyter Notebook",
        count: 4,
        color: languageColors["Jupyter Notebook"],
      },
      { name: "Python", count: 1, color: languageColors.Python },
      { name: "CSS", count: 1, color: languageColors.CSS },
    ],
  },
  leetcode: {
    username: LEETCODE_USERNAME,
    profileUrl: "https://leetcode.com/u/rspsurana/",
    totalSolved: 312,
    easySolved: 188,
    mediumSolved: 114,
    hardSolved: 10,
    totalSubmissions: 570,
    acceptedSubmissions: 426,
    ranking: 469148,
  },
  lastUpdated: "2026-08-22T00:00:00.000Z",
};

const numberFormatter = new Intl.NumberFormat("en-US");

const formatNumber = (value) => numberFormatter.format(Number(value || 0));

const formatPercent = (value, total) => {
  if (!total) return 0;
  return Math.round((Number(value || 0) / total) * 100);
};

const formatDate = (isoString) => {
  if (!isoString) return "Recently";

  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const applyManualGithubContributions = (metrics) => {
  if (!hasManualGithubContributions) return metrics;

  return {
    ...metrics,
    github: {
      ...metrics.github,
      contributionsTotal: MANUAL_GITHUB_CONTRIBUTIONS,
    },
  };
};

const readCache = () => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.github && parsed?.leetcode
      ? applyManualGithubContributions(parsed)
      : null;
  } catch {
    return null;
  }
};

const writeCache = (metrics) => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(metrics));
  } catch {
    // The bundled fallback keeps the section available when storage is blocked.
  }
};

const fetchJson = async (url, signal) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );
  const abortListener = () => controller.abort();
  signal.addEventListener("abort", abortListener, { once: true });

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    return response.json();
  } finally {
    window.clearTimeout(timeoutId);
    signal.removeEventListener("abort", abortListener);
  }
};

const getGithubContributionsUrl = (year) => {
  const params = new URLSearchParams({
    y: String(year),
    refresh: Date.now().toString(),
  });

  return `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?${params}`;
};

const getLanguageColor = (language) =>
  languageColors[language] || languageColors.Other;

const getContributionYears = (createdAt) => {
  const createdYear = new Date(createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  const startYear = Number.isFinite(createdYear) ? createdYear : currentYear;

  return Array.from(
    { length: Math.max(currentYear - startYear + 1, 1) },
    (_, index) => startYear + index,
  );
};

const getYearContributionTotal = (data, year) => {
  const yearlyTotal = Number(data?.total?.[year]);
  if (Number.isFinite(yearlyTotal)) return yearlyTotal;

  if (Array.isArray(data?.contributions)) {
    return data.contributions.reduce(
      (total, contribution) => total + Number(contribution.count || 0),
      0,
    );
  }

  return 0;
};

const fetchGithubContributionTotal = async (createdAt, signal) => {
  const yearlyResults = await Promise.allSettled(
    getContributionYears(createdAt).map(async (year) => ({
      year,
      data: await fetchJson(getGithubContributionsUrl(year), signal),
    })),
  );

  const fulfilledResults = yearlyResults.filter(
    (result) => result.status === "fulfilled",
  );

  if (!fulfilledResults.length) {
    throw new Error("No GitHub contribution years could be loaded");
  }

  return fulfilledResults.reduce(
    (total, result) =>
      total + getYearContributionTotal(result.value.data, result.value.year),
    0,
  );
};

const resolveContributionTotal = (value, fallback) => {
  if (hasManualGithubContributions) return MANUAL_GITHUB_CONTRIBUTIONS;

  const total = Number(value);
  if (Number.isFinite(total)) return total;

  return fallback ?? fallbackMetrics.github.contributionsTotal;
};

const normalizeGithub = (
  user,
  repos,
  contributionTotal,
  fallbackContributions,
) => {
  const ownRepos = Array.isArray(repos)
    ? repos.filter((repo) => !repo.fork)
    : [];
  const languageCounts = ownRepos.reduce((counts, repo) => {
    const language = repo.language || "Other";
    counts[language] = (counts[language] || 0) + 1;
    return counts;
  }, {});

  return {
    username: user.login || GITHUB_USERNAME,
    name: user.name || fallbackMetrics.github.name,
    bio: user.bio || fallbackMetrics.github.bio,
    avatarUrl: user.avatar_url || fallbackMetrics.github.avatarUrl,
    profileUrl: user.html_url || fallbackMetrics.github.profileUrl,
    publicRepos: user.public_repos || ownRepos.length,
    followers: user.followers || 0,
    contributionsTotal: resolveContributionTotal(
      contributionTotal,
      fallbackContributions,
    ),
    latestPush:
      ownRepos
        .map((repo) => repo.pushed_at)
        .filter(Boolean)
        .sort()
        .at(-1) || fallbackMetrics.github.latestPush,
    topLanguages: Object.entries(languageCounts)
      .map(([name, count]) => ({ name, count, color: getLanguageColor(name) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
};

const getFiniteNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const firstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null);

const getSubmissionValue = (submissions, difficulty, key = "submissions") => {
  if (!Array.isArray(submissions)) return undefined;

  return submissions.find((item) => item.difficulty === difficulty)?.[key];
};

const normalizeLeetcode = (data) => {
  const acceptedStats =
    data.submitStats?.acSubmissionNum ||
    data.matchedUserStats?.acSubmissionNum ||
    data.acSubmissionNum;
  const totalSubmissionStats =
    data.submitStats?.totalSubmissionNum || data.totalSubmissions;

  return {
    username: data.username || LEETCODE_USERNAME,
    profileUrl: fallbackMetrics.leetcode.profileUrl,
    totalSolved: getFiniteNumber(
      firstDefined(
        data.totalSolved,
        data.solvedProblem,
        getSubmissionValue(acceptedStats, "All", "count"),
      ),
      fallbackMetrics.leetcode.totalSolved,
    ),
    easySolved: getFiniteNumber(
      firstDefined(
        data.easySolved,
        getSubmissionValue(acceptedStats, "Easy", "count"),
      ),
      fallbackMetrics.leetcode.easySolved,
    ),
    mediumSolved: getFiniteNumber(
      firstDefined(
        data.mediumSolved,
        getSubmissionValue(acceptedStats, "Medium", "count"),
      ),
      fallbackMetrics.leetcode.mediumSolved,
    ),
    hardSolved: getFiniteNumber(
      firstDefined(
        data.hardSolved,
        getSubmissionValue(acceptedStats, "Hard", "count"),
      ),
      fallbackMetrics.leetcode.hardSolved,
    ),
    totalSubmissions: getFiniteNumber(
      firstDefined(
        getSubmissionValue(totalSubmissionStats, "All"),
        getSubmissionValue(totalSubmissionStats, "All", "count"),
      ),
      fallbackMetrics.leetcode.totalSubmissions,
    ),
    acceptedSubmissions: getFiniteNumber(
      firstDefined(
        getSubmissionValue(acceptedStats, "All"),
        getSubmissionValue(acceptedStats, "All", "count"),
      ),
      fallbackMetrics.leetcode.acceptedSubmissions,
    ),
    ranking: getFiniteNumber(
      firstDefined(data.ranking, data.profile?.ranking),
      fallbackMetrics.leetcode.ranking,
    ),
  };
};

const Metric = ({ icon, label, value, className = "" }) => (
  <div className={`developer-metric ${className}`}>
    <span className="developer-metric-icon">{icon}</span>
    <div>
      <strong>{formatNumber(value)}</strong>
      <span>{label}</span>
    </div>
  </div>
);

const ExternalProfileLink = ({ href, children }) => (
  <a
    className="developer-profile-link"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children}
    <FaExternalLinkAlt />
  </a>
);

const DeveloperProfiles = () => {
  const [metrics, setMetrics] = useState(() => readCache() || fallbackMetrics);
  const [refreshState, setRefreshState] = useState("ready");

  useEffect(() => {
    const controller = new AbortController();
    const refreshId = window.setTimeout(async () => {
      setRefreshState("refreshing");

      const [githubUser, githubRepos, leetcodeStats] = await Promise.allSettled(
        [
          fetchJson(
            `https://api.github.com/users/${GITHUB_USERNAME}`,
            controller.signal,
          ),
          fetchJson(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
            controller.signal,
          ),
          fetchJson(
            `https://leetcode-api-pied.vercel.app/user/${LEETCODE_USERNAME}`,
            controller.signal,
          ),
        ],
      );

      const githubContributions =
        githubUser.status === "fulfilled"
          ? await Promise.resolve(
              fetchGithubContributionTotal(
                githubUser.value.created_at,
                controller.signal,
              ),
            )
              .then((value) => ({ status: "fulfilled", value }))
              .catch((reason) => ({ status: "rejected", reason }))
          : { status: "rejected" };

      if (controller.signal.aborted) return;

      setMetrics((currentMetrics) => {
        const github =
          githubUser.status === "fulfilled" &&
          githubRepos.status === "fulfilled" &&
          githubContributions.status === "fulfilled"
            ? normalizeGithub(
                githubUser.value,
                githubRepos.value,
                githubContributions.value,
                currentMetrics.github.contributionsTotal,
              )
            : githubUser.status === "fulfilled" &&
                githubRepos.status === "fulfilled"
              ? normalizeGithub(
                  githubUser.value,
                  githubRepos.value,
                  null,
                  currentMetrics.github.contributionsTotal,
                )
              : githubContributions.status === "fulfilled"
                ? {
                    ...currentMetrics.github,
                    contributionsTotal: resolveContributionTotal(
                      githubContributions.value,
                      currentMetrics.github.contributionsTotal,
                    ),
                  }
                : currentMetrics.github;
        const leetcode =
          leetcodeStats.status === "fulfilled"
            ? normalizeLeetcode(leetcodeStats.value)
            : currentMetrics.leetcode;
        const nextMetrics = {
          github,
          leetcode,
          lastUpdated: new Date().toISOString(),
        };

        writeCache(nextMetrics);
        return nextMetrics;
      });

      setRefreshState("updated");
    }, REFRESH_DELAY_MS);

    return () => {
      window.clearTimeout(refreshId);
      controller.abort();
    };
  }, []);

  const { github, leetcode } = metrics;
  const languageTotal = useMemo(
    () =>
      github.topLanguages.reduce(
        (total, language) => total + Number(language.count || 0),
        0,
      ),
    [github.topLanguages],
  );
  const languageShare = useMemo(
    () =>
      github.topLanguages.map((language) => ({
        ...language,
        percent: formatPercent(language.count, languageTotal),
      })),
    [github.topLanguages, languageTotal],
  );
  const problemTypes = [
    {
      label: "Easy",
      value: leetcode.easySolved,
      color: problemTypeColors.Easy,
    },
    {
      label: "Medium",
      value: leetcode.mediumSolved,
      color: problemTypeColors.Medium,
    },
    {
      label: "Hard",
      value: leetcode.hardSolved,
      color: problemTypeColors.Hard,
    },
  ].map((type) => ({
    ...type,
    percent: formatPercent(type.value, leetcode.totalSolved),
  }));

  return (
    <section id="developer-profiles" className="developer-profiles-section">
      <div className="developer-profiles-container">
        <div className="developer-profiles-header">
          <h2>
            CODING <span className="gradient-text">PROFILES</span>
          </h2>
          <p>
            Explore my contributions, coding practice, and developer activity
          </p>
        </div>

        <div className="developer-profiles-status">
          <span className={`status-dot ${refreshState}`} />
          <span>Updated {formatDate(metrics.lastUpdated)}</span>
        </div>

        <div className="developer-profiles-grid">
          <article className="developer-profile-card github-card">
            <div className="developer-profile-top">
              <div className="developer-profile-identity">
                <img
                  src={github.avatarUrl}
                  alt={`${github.name} GitHub avatar`}
                />
                <div>
                  <span className="profile-kicker">
                    <FaGithub /> GitHub
                  </span>
                  <h3>{github.username}</h3>
                  <p>{github.bio}</p>
                </div>
              </div>
              <ExternalProfileLink href={github.profileUrl}>
                Open GitHub
              </ExternalProfileLink>
            </div>

            <div className="developer-metrics-grid github-metrics-grid">
              <Metric
                icon={<FaFolderOpen />}
                label="Repositories"
                value={github.publicRepos}
              />
              <Metric
                icon={<FaUsers />}
                label="Followers"
                value={github.followers}
              />
              <Metric
                icon={<FaCodeBranch />}
                label={
                  hasManualGithubContributions
                    ? "Contributions"
                    : "Total Public Contributions "
                }
                value={github.contributionsTotal}
                className="highlight-metric"
              />
            </div>

            <div className="developer-panel">
              <div className="developer-panel-heading">
                <div>
                  <h4>Top Languages</h4>
                  <span>Latest push {formatDate(github.latestPush)}</span>
                </div>
              </div>
              <div className="language-overview">
                <div
                  className="language-strip"
                  aria-label="GitHub language share"
                >
                  {languageShare.map((language) => (
                    <span
                      className="language-segment"
                      key={language.name}
                      style={{
                        "--segment-color": language.color,
                        flexGrow: Math.max(language.count, 1),
                      }}
                      title={`${language.name} ${language.percent}%`}
                    />
                  ))}
                </div>
                <div className="language-chips">
                  {languageShare.map((language) => (
                    <span className="language-chip" key={language.name}>
                      <i style={{ background: language.color }} />
                      <span>{language.name}</span>
                      <strong>{language.percent}%</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="developer-profile-card leetcode-card">
            <div className="developer-profile-top">
              <div className="developer-profile-identity">
                <div className="leetcode-mark">
                  <SiLeetcode />
                </div>
                <div>
                  <span className="profile-kicker">
                    <SiLeetcode /> LeetCode
                  </span>
                  <h3>{leetcode.username}</h3>
                  <p>Data Structures & Algorithms</p>
                </div>
              </div>
              <ExternalProfileLink href={leetcode.profileUrl}>
                Open LeetCode
              </ExternalProfileLink>
            </div>

            <div className="leetcode-total">
              <div>
                <span>Total Solved</span>
                <strong>{formatNumber(leetcode.totalSolved)}</strong>
              </div>
              <div>
                <span>Global Rank</span>
                <strong>{formatNumber(leetcode.ranking)}</strong>
              </div>
            </div>

            <div className="developer-metrics-grid leetcode-metrics-grid">
              <Metric
                icon={<SiLeetcode />}
                label="Accepted"
                value={leetcode.acceptedSubmissions}
              />
              <Metric
                icon={<FaCodeBranch />}
                label="Submissions"
                value={leetcode.totalSubmissions}
              />
            </div>

            <div className="developer-panel">
              <div className="developer-panel-heading">
                <div>
                  <h4>Problem Types</h4>
                  <span>{formatNumber(leetcode.totalSolved)} solved</span>
                </div>
              </div>
              <div
                className="problem-type-strip"
                aria-label="LeetCode solved problem mix"
              >
                {problemTypes.map((type) => (
                  <span
                    className="problem-type-segment"
                    key={type.label}
                    style={{
                      "--problem-color": type.color,
                      flexGrow: Math.max(type.value, 1),
                    }}
                    title={`${type.label} ${formatNumber(type.value)}`}
                  />
                ))}
              </div>
              <div className="problem-type-grid">
                {problemTypes.map((type) => (
                  <div
                    className="problem-type-card"
                    key={type.label}
                    style={{ "--problem-color": type.color }}
                  >
                    <div className="problem-type-top">
                      <span>{type.label}</span>
                      <strong>{type.percent}%</strong>
                    </div>
                    <div className="problem-type-value">
                      <strong>{formatNumber(type.value)}</strong>
                      <span>Solved</span>
                    </div>
                    <div className="problem-type-meter">
                      <span
                        style={{ width: `${Math.max(type.percent, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default DeveloperProfiles;
