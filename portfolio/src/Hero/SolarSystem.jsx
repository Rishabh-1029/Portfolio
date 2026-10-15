import "./SolarSystem.css";

const planets = [
  { name: "Mercury", rx: 31, ry: 20, tilt: -18, size: 2.1, color: "#c5c8d1", period: 12 },
  { name: "Venus", rx: 49, ry: 32, tilt: 11, size: 2.8, color: "#e3bd91", period: 19 },
  { name: "Earth", rx: 68, ry: 44, tilt: -9, size: 3.1, color: "#70c8ed", period: 27 },
  { name: "Mars", rx: 87, ry: 57, tilt: 15, size: 2.5, color: "#e58a71", period: 36 },
  { name: "Jupiter", rx: 106, ry: 70, tilt: -12, size: 4.4, color: "#dfbd9b", period: 52 },
  { name: "Saturn", rx: 125, ry: 82, tilt: 7, size: 3.8, color: "#e7d5a5", period: 72 },
];

const stars = [
  [42, 90, 1.1],
  [228, 52, 1.3],
  [260, 110, 0.9],
  [54, 228, 0.8],
  [220, 250, 1.1],
  [180, 34, 0.7],
  [31, 166, 0.7],
];

const SolarSystem = () => (
  <div className="solar-system" aria-hidden="true">
    <span className="solar-system__quiet-zone" />
    <svg className="solar-system__svg" viewBox="0 0 300 300" fill="none">
      <defs>
        <radialGradient id="solar-system-sun">
          <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.95" />
          <stop offset="42%" stopColor="#ffd47d" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffb84d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {stars.map(([x, y, radius], index) => (
        <circle
          key={`star-${index}`}
          className="solar-system__star"
          cx={x}
          cy={y}
          r={radius}
        />
      ))}

      {planets.map((planet) => (
        <g key={planet.name} transform={`rotate(${planet.tilt} 150 150)`}>
          <ellipse
            className="solar-system__orbit"
            cx="150"
            cy="150"
            rx={planet.rx}
            ry={planet.ry}
          />
          <g
            className="solar-system__revolution"
            style={{ "--orbit-period": `${planet.period}s` }}
          >
            {planet.name === "Saturn" && (
              <ellipse
                className="solar-system__saturn-ring"
                cx={150 + planet.rx}
                cy="150"
                rx="6"
                ry="2.1"
                transform={`rotate(-18 ${150 + planet.rx} 150)`}
              />
            )}
            <circle
              className="solar-system__planet"
              cx={150 + planet.rx}
              cy="150"
              r={planet.size}
              fill={planet.color}
            />
          </g>
        </g>
      ))}

      <circle className="solar-system__sun-glow" cx="150" cy="150" r="21" />
      <circle className="solar-system__sun-core" cx="150" cy="150" r="4.2" />
    </svg>
  </div>
);

export default SolarSystem;
