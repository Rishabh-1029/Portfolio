import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Reorder } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

import { API_BASE_URL } from "../api.js";

const API = `${API_BASE_URL}/api`;

// ─── Palette ──────────────────────────────────────────────────────────────────
const CHART_COLORS = [
  "#00f0ff",
  "#a855f7",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
];

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(10,12,20,0.95)",
        border: "1px solid rgba(0,240,255,0.25)",
        borderRadius: 10,
        padding: "0.7rem 1rem",
        fontSize: "0.85rem",
        color: "#e2e8f0",
      }}
    >
      <p
        style={{
          margin: 0,
          fontWeight: 700,
          color: "#00f0ff",
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent, sub }) => (
  <div
    style={{
      background: "rgba(20,25,35,0.7)",
      backdropFilter: "blur(12px)",
      border: `1px solid ${accent}33`,
      borderRadius: 16,
      padding: "1.5rem",
      boxShadow: `0 0 20px ${accent}18`,
      display: "flex",
      alignItems: "center",
      gap: "1.2rem",
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: `${accent}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{
          fontSize: "0.8rem",
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.9rem",
          fontWeight: 800,
          color: accent,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  </div>
);

// ─── Section Card wrapper ─────────────────────────────────────────────────────
const ChartCard = ({ title, children, style }) => (
  <div
    style={{
      background: "rgba(20,25,35,0.6)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "1.5rem",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      ...style,
    }}
  >
    <h4
      style={{
        margin: "0 0 1.2rem",
        fontSize: "1rem",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {title}
    </h4>
    {children}
  </div>
);

// ─── Browser / OS / Device icons ─────────────────────────────────────────────
const BROWSER_ICON = {
  Chrome: "🌐",
  Firefox: "🦊",
  Safari: "🧭",
  Edge: "🌀",
  Opera: "🔴",
  Unknown: "❓",
};
const OS_ICON = {
  Windows: "🪟",
  macOS: "🍎",
  Linux: "🐧",
  Android: "🤖",
  iOS: "📱",
  Unknown: "💻",
};
const DEVICE_ICON = { Mobile: "📱", Tablet: "📟", Desktop: "🖥️" };

// Mask IP for display: 192.168.1.100 → 192.168.x.x
const maskIP = (ip) => {
  if (!ip || ip === "unknown") return "Unknown";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.x.x`;
  return ip; // IPv6 or unknown — show as-is
};

// Assign a stable colour accent per IP
const ipColor = (ip) => {
  if (!ip) return "#94a3b8";
  let h = 0;
  for (let i = 0; i < ip.length; i++)
    h = (h * 31 + ip.charCodeAt(i)) & 0xffffffff;
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

// ─── Visitor Card ─────────────────────────────────────────────────────────────
const VisitorCard = ({ session }) => {
  const [expanded, setExpanded] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const accent = ipColor(session.ip);
  const pageList = [...new Set(session.events.map((e) => e.path))];
  const firstSeen = session.events[session.events.length - 1]?.timestamp;
  const lastSeen = session.events[0]?.timestamp;
  const fmtTime = (ts) =>
    ts
      ? new Date(ts).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const meta = session.meta; // latest event metadata

  return (
    <div
      style={{
        border: `1px solid ${accent}33`,
        borderRadius: 14,
        overflow: "hidden",
        background: "rgba(15,18,28,0.7)",
        backdropFilter: "blur(10px)",
        boxShadow: `0 0 18px ${accent}15`,
        transition: "box-shadow 0.3s",
      }}
    >
      {/* ── Header ── */}
      <div
        onClick={() => setExpanded((x) => !x)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem 1.2rem",
          cursor: "pointer",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            flexShrink: 0,
            background: `${accent}22`,
            border: `2px solid ${accent}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          {DEVICE_ICON[meta.device] || "💻"}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: accent,
                fontFamily: "monospace",
                fontSize: "0.9rem",
              }}
            >
              {maskIP(session.ip)}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {BROWSER_ICON[meta.browser] || ""} {meta.browser || "?"}{" "}
              &nbsp;·&nbsp;
              {OS_ICON[meta.os] || ""} {meta.os || "?"}
            </span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 3 }}>
            {session.events.length} event
            {session.events.length !== 1 ? "s" : ""} &nbsp;·&nbsp; First:{" "}
            {fmtTime(firstSeen)} &nbsp;·&nbsp; Last: {fmtTime(lastSeen)}
          </div>
        </div>

        {/* Pages badges */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            maxWidth: 200,
          }}
        >
          {pageList.slice(0, 3).map((p, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.7rem",
                padding: "2px 7px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.06)",
                color: "#94a3b8",
                whiteSpace: "nowrap",
              }}
            >
              {p === "/" ? "Home" : p.replace(/^\//, "")}
            </span>
          ))}
          {pageList.length > 3 && (
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
              +{pageList.length - 3}
            </span>
          )}
        </div>

        <span
          style={{
            color: "#475569",
            fontSize: "0.9rem",
            marginLeft: "0.5rem",
            flexShrink: 0,
          }}
        >
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* ── Expanded Detail ── */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.4rem",
          }}
        >
          {/* Metadata grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.8rem",
              marginBottom: "1rem",
            }}
          >
            {[
              ["🌐 Browser", meta.browser || "—"],
              ["💻 OS", meta.os || "—"],
              ["📱 Device", meta.device || "—"],
              ["📐 Screen", meta.screen || "—"],
              ["🗺️ Language", meta.language || "—"],
              ["🕐 Timezone", meta.timezone || "—"],
              ["🔗 Referrer", meta.referrer || "direct"],
              ["🌍 IP", session.ip || "—"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  padding: "0.6rem 0.8rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#64748b",
                    marginBottom: 2,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#e2e8f0",
                    wordBreak: "break-all",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Page journey */}
          <div style={{ marginBottom: "0.8rem" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Page Journey
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                alignItems: "center",
              }}
            >
              {session.events
                .slice()
                .reverse()
                .map((ev, i) => (
                  <>
                    <span
                      key={`p${i}`}
                      style={{
                        fontSize: "0.78rem",
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: `${accent}18`,
                        color: accent,
                        border: `1px solid ${accent}33`,
                      }}
                    >
                      {ev.path === "/" ? "Home" : ev.path.replace(/^\//, "")}
                    </span>
                    {i < session.events.length - 1 && (
                      <span
                        key={`a${i}`}
                        style={{ color: "#475569", fontSize: "0.75rem" }}
                      >
                        →
                      </span>
                    )}
                  </>
                ))}
            </div>
          </div>

          {/* Raw JSON toggle */}
          <button
            onClick={() => setShowRaw((x) => !x)}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b",
              fontSize: "0.75rem",
              padding: "4px 10px",
              borderRadius: 6,
              cursor: "pointer",
              marginBottom: showRaw ? "0.6rem" : 0,
            }}
          >
            {showRaw ? "Hide" : "Show"} raw metadata
          </button>

          {showRaw && (
            <pre
              style={{
                background: "rgba(0,0,0,0.4)",
                borderRadius: 8,
                padding: "0.8rem",
                fontSize: "0.72rem",
                color: "#94a3b8",
                overflowX: "auto",
                margin: 0,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {JSON.stringify(meta, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Visitors Tab ─────────────────────────────────────────────────────────────
const VisitorsView = ({ items }) => {
  const sessions = useMemo(() => {
    // Group events by IP address
    const byIP = {};
    items.forEach((ev) => {
      let meta = {};
      try {
        meta = JSON.parse(ev.metadata_json || "{}");
      } catch {
        meta = {};
      }
      const ip = meta.ip || "unknown";
      if (!byIP[ip]) byIP[ip] = { ip, events: [], meta };
      byIP[ip].events.unshift(ev); // newest first
      // Always keep the latest metadata as the "representative" meta
      byIP[ip].meta = meta;
    });

    // Sort by most recent visit descending
    return Object.values(byIP).sort((a, b) => {
      const ta = new Date(a.events[0]?.timestamp || 0).getTime();
      const tb = new Date(b.events[0]?.timestamp || 0).getTime();
      return tb - ta;
    });
  }, [items]);

  if (!sessions.length)
    return (
      <div style={{ textAlign: "center", color: "#64748b", padding: "3rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>👤</div>
        <p>No visitor data yet. Visit your portfolio to generate events.</p>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        paddingBottom: "3rem",
      }}
    >
      <p
        style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 0.5rem" }}
      >
        {sessions.length} unique visitor{sessions.length !== 1 ? "s" : ""}{" "}
        tracked &nbsp;·&nbsp; IPs are partially masked for display
      </p>
      {sessions.map((s, i) => (
        <VisitorCard key={s.ip + i} session={s} />
      ))}
    </div>
  );
};

// ─── Main Analytics Dashboard ─────────────────────────────────────────────────
const AnalyticsDashboard = ({ items, loading }) => {
  const [view, setView] = useState("overview"); // "overview" | "visitors"

  const stats = useMemo(() => {
    if (!items.length) return null;

    const total = items.length;
    const pageViews = items.filter((e) => e.event_type === "page_view").length;
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = items.filter(
      (e) => e.timestamp?.slice(0, 10) === today,
    ).length;

    // Unique visitors (unique IPs)
    const uniqueIPs = new Set();
    items.forEach((e) => {
      try {
        const m = JSON.parse(e.metadata_json || "{}");
        if (m.ip) uniqueIPs.add(m.ip);
      } catch {
        // Ignore malformed analytics metadata.
      }
    });

    // Unique paths
    const pathCounts = {};
    items.forEach((e) => {
      pathCounts[e.path] = (pathCounts[e.path] || 0) + 1;
    });
    const topPage = Object.entries(pathCounts).sort((a, b) => b[1] - a[1])[0];

    // Visits over last 7 days
    const dayMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().slice(0, 10)] = 0;
    }
    items.forEach((e) => {
      const d = e.timestamp?.slice(0, 10);
      if (d && Object.prototype.hasOwnProperty.call(dayMap, d)) dayMap[d]++;
    });
    const timelineData = Object.entries(dayMap).map(([date, count]) => ({
      date: new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      visits: count,
    }));

    // Top pages bar chart
    const topPages = Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([path, count]) => ({
        path: path === "/" ? "Home" : path.replace(/^\//, ""),
        count,
      }));

    // Event types pie
    const typeCounts = {};
    items.forEach((e) => {
      typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1;
    });
    const pieData = Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Recent events
    const recent = [...items].slice(0, 15);

    return {
      total,
      pageViews,
      todayCount,
      topPage,
      timelineData,
      topPages,
      pieData,
      recent,
      uniqueVisitors: uniqueIPs.size,
    };
  }, [items]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "#94a3b8",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid #00f0ff",
            borderTopColor: "transparent",
            animation: "spin 0.8s linear infinite",
          }}
        />
        Loading analytics data...
      </div>
    );

  if (!items.length)
    return (
      <div
        style={{ textAlign: "center", color: "#64748b", padding: "4rem 2rem" }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
        <p style={{ fontSize: "1.1rem" }}>No analytics events recorded yet.</p>
        <p style={{ fontSize: "0.9rem" }}>
          Events will appear here as visitors browse your portfolio.
        </p>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        paddingBottom: "3rem",
      }}
    >
      {/* ── Sub-tab switcher ── */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10,
          padding: "4px",
          width: "fit-content",
        }}
      >
        {[
          ["overview", "📊 Overview"],
          ["visitors", "👤 Visitors"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              transition: "all 0.2s",
              background: view === key ? "rgba(0,240,255,0.12)" : "transparent",
              color: view === key ? "#00f0ff" : "#64748b",
              boxShadow:
                view === key ? "0 0 12px rgba(0,240,255,0.15)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "visitors" ? (
        <VisitorsView items={items} />
      ) : (
        <>
          {/* KPI CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            <StatCard
              icon="👁️"
              label="Total Events"
              value={stats.total.toLocaleString()}
              accent="#00f0ff"
              sub="All tracked interactions"
            />
            <StatCard
              icon="👤"
              label="Unique Visitors"
              value={stats.uniqueVisitors.toLocaleString()}
              accent="#a855f7"
              sub="By IP address"
            />
            <StatCard
              icon="📅"
              label="Today"
              value={stats.todayCount.toLocaleString()}
              accent="#10b981"
              sub={new Date().toLocaleDateString("en-US", { weekday: "long" })}
            />
            <StatCard
              icon="🏆"
              label="Top Page"
              value={
                stats.topPage
                  ? stats.topPage[0] === "/"
                    ? "Home"
                    : stats.topPage[0].replace(/^\//, "")
                  : "—"
              }
              accent="#f59e0b"
              sub={stats.topPage ? `${stats.topPage[1]} hits` : "No data"}
            />
          </div>

          {/* VISITS OVER TIME */}
          <ChartCard title="Visits — Last 7 Days">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={stats.timelineData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#00f0ff"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={{ fill: "#00f0ff", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* TOP PAGES + EVENT TYPES */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <ChartCard title="Top Pages">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={stats.topPages}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="path"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Hits" radius={[0, 6, 6, 0]}>
                    {stats.topPages.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Event Types">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
                  >
                    {stats.pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* RECENT ACTIVITY FEED */}
          <ChartCard title="Recent Activity">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                maxHeight: 340,
                overflowY: "auto",
              }}
            >
              {stats.recent.map((ev, i) => {
                const isView = ev.event_type === "page_view";
                let meta = {};
                try {
                  meta = JSON.parse(ev.metadata_json || "{}");
                } catch {
                  meta = {};
                }
                return (
                  <div
                    key={ev.id ?? i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem 1rem",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>
                      {isView ? "📄" : "🖱️"}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        background: isView
                          ? "rgba(0,240,255,0.12)"
                          : "rgba(168,85,247,0.12)",
                        color: isView ? "#00f0ff" : "#a855f7",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.event_type}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        color: "#e2e8f0",
                        fontSize: "0.9rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ev.path}
                    </span>
                    {meta.ip && (
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          color: ipColor(meta.ip),
                          flexShrink: 0,
                        }}
                      >
                        {maskIP(meta.ip)}
                      </span>
                    )}
                    <span
                      style={{
                        color: "#475569",
                        fontSize: "0.78rem",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(ev.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // New/Edit Item State (Generic form)
  const [formData, setFormData] = useState({ order_index: 0 });

  const logout = () => {
    setToken("");
    localStorage.removeItem("admin_token");
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API}/${activeTab}`, { headers });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    const verifyAndFetch = async () => {
      if (!token) return;
      try {
        await axios.get(`${API}/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchItems();
      } catch (err) {
        if (err.response?.status === 401) logout();
      }
    };
    verifyAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, { password });
      const newToken = res.data.access_token;
      setToken(newToken);
      localStorage.setItem("admin_token", newToken);
    } catch {
      alert("Login failed. Incorrect password.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (editingId === id) {
        setEditingId(null);
        setFormData({ order_index: items.length });
      }
      fetchItems();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else alert("Failed to delete item.");
    }
  };

  const handleEditInit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    window.document
      .querySelector(".admin-content")
      .scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${activeTab}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/${activeTab}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ order_index: items.length });
      fetchItems();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else alert("Failed to save item.");
    }
  };

  const handleReorder = async (newOrderList) => {
    setItems(newOrderList);
    try {
      await Promise.all(
        newOrderList.map((item, index) => {
          if (item.order_index !== index) {
            item.order_index = index;
            return axios.patch(
              `${API}/${activeTab}/${item.id}/order?order_index=${index}`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
          }
          return Promise.resolve();
        }),
      );
    } catch (err) {
      if (err.response?.status === 401) logout();
      else console.error("Failed to sync order changes");
    }
  };

  if (!token) {
    return (
      <div className="admin-login-container">
        <form className="admin-form" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="admin-btn primary">
            Authenticate
          </button>

          <Link
            to="/"
            style={{
              textAlign: "center",
              marginTop: "10px",
              color: "#9ca3af",
              textDecoration: "none",
            }}
          >
            ← Return to Portfolio
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <h2>Dashboard</h2>
        <div className="admin-tabs">
          <button
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
          <button
            className={activeTab === "projects" ? "active" : ""}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </button>
          <button
            className={activeTab === "experiences" ? "active" : ""}
            onClick={() => setActiveTab("experiences")}
          >
            Experiences
          </button>
          <button
            className={activeTab === "skills" ? "active" : ""}
            onClick={() => setActiveTab("skills")}
          >
            Skills
          </button>
          <button
            className={activeTab === "blogs" ? "active" : ""}
            onClick={() => setActiveTab("blogs")}
          >
            Blogs
          </button>
        </div>

        <div className="sidebar-actions">
          <Link
            to="/"
            className="admin-btn secondary"
            style={{ justifyContent: "center" }}
          >
            ← View Live Site
          </Link>
          <button className="admin-btn delete" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-content">
        <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>

        {/* ── ANALYTICS DASHBOARD ── */}
        {activeTab === "analytics" && (
          <AnalyticsDashboard items={items} loading={loading} />
        )}

        {/* Render Messages Inbox differently */}
        {activeTab === "messages" && (
          <div className="admin-add-form" style={{ display: "block" }}>
            <h4>Inbox Leads</h4>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {items.length === 0 && (
                  <p style={{ color: "var(--text-muted)" }}>No new messages.</p>
                )}
                {items.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      padding: "1.5rem",
                      borderRadius: "10px",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                      }}
                    >
                      <strong>
                        {msg.name} ({msg.email})
                      </strong>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--primary-accent)",
                        }}
                      >
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    {msg.phone && (
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-secondary)",
                          display: "block",
                          marginBottom: "1rem",
                        }}
                      >
                        Phone: {msg.phone}
                      </span>
                    )}
                    <p
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        padding: "1rem",
                        borderRadius: "8px",
                        color: "var(--text-secondary)",
                        margin: 0,
                      }}
                    >
                      {msg.message}
                    </p>
                    <div style={{ marginTop: "1rem", textAlign: "right" }}>
                      <button
                        className="admin-btn delete"
                        onClick={() => handleDelete(msg.id)}
                        style={{
                          display: "inline-block",
                          padding: "0.5rem 1rem",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* The rest of the forms for CRUD */}
        {activeTab !== "analytics" && activeTab !== "messages" && (
          <>
            <form className="admin-add-form" onSubmit={handleSubmit}>
              <h4>{editingId ? "Edit Existing Item" : "Add New Item"}</h4>

              {activeTab === "projects" && (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    required
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Period (e.g. 2024)"
                    required
                    value={formData.period || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, period: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    required
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Tech Stack (comma separated)"
                    required
                    value={formData.tech || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, tech: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Public Image URL (e.g. Imgur link) or Local Path"
                    value={formData.logo || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, logo: e.target.value })
                    }
                  />
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={formData.github || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, github: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Live Demo URL"
                      value={formData.live || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, live: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {activeTab === "experiences" && (
                <>
                  <input
                    type="text"
                    placeholder="Role (e.g. Software Engineer)"
                    required
                    value={formData.role || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    required
                    value={formData.company || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Period (e.g. Dec 2024 - Present)"
                    required
                    value={formData.period || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, period: e.target.value })
                    }
                  />
                  <textarea
                    placeholder='Description (Array of strings wrapped in [] for bullet points, e.g. ["Did x", "Did y"])'
                    rows={4}
                    required
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </>
              )}

              {activeTab === "skills" && (
                <>
                  <input
                    type="text"
                    placeholder="Category (e.g. Frontend)"
                    required
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Items (comma separated, e.g. React, Vue)"
                    required
                    value={formData.items || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, items: e.target.value })
                    }
                  />
                </>
              )}

              {activeTab === "blogs" && (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    required
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Display Image URL (Optional)"
                    value={formData.image || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="External URL (e.g. Medium link)"
                    value={formData.external_url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, external_url: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Content (Markdown Supported)"
                    rows={15}
                    required
                    value={formData.content_md || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, content_md: e.target.value })
                    }
                    style={{ fontFamily: "monospace" }}
                  />
                </>
              )}

              <div
                style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}
              >
                <button
                  type="submit"
                  className="admin-btn primary"
                  style={{ flex: 1 }}
                >
                  {editingId
                    ? "Save Changes"
                    : `Create ${activeTab.slice(0, -1)}`}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="admin-btn secondary"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ order_index: items.length });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {loading ? (
              <p>Loading data...</p>
            ) : (
              <div className="admin-list" style={{ paddingBottom: "40px" }}>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    marginBottom: "1rem",
                  }}
                >
                  * Drag and drop the ☰ icon to reorder items dynamically on
                  the live site.
                </p>
                <Reorder.Group
                  axis="y"
                  values={items}
                  onReorder={handleReorder}
                  style={{ listStyle: "none" }}
                >
                  {items.map((item) => (
                    <Reorder.Item
                      key={item.id}
                      value={item}
                      style={{ marginBottom: "12px" }}
                    >
                      <div className="admin-list-item">
                        <div
                          className="item-details"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "1.2rem",
                              cursor: "grab",
                              padding: "0 10px",
                            }}
                          >
                            ☰
                          </div>
                          <div>
                            <strong>
                              {item.title || item.role || item.category}
                            </strong>
                            <p>
                              {item.company
                                ? `${item.company} | ${item.period}`
                                : item.period ||
                                  item.items ||
                                  (item.published_date
                                    ? new Date(
                                        item.published_date.endsWith("Z")
                                          ? item.published_date
                                          : item.published_date + "Z",
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : "")}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="admin-btn secondary"
                            onClick={() => handleEditInit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
