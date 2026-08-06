import "./achievements.css";

function CodingAchievements() {
  return (
    <>
      {/* Header */}
      <div className="achievements-header">
        <h2>
          <span className="gradient-text">ACHIEVEMENTS</span>
        </h2>
        <p>
          Recognition and achievements from my academic and technical journey
        </p>
      </div>
      <div className="stats-grid">
        {/* GitHub Activity */}
        <div
          className="stats-card"
          onClick={() =>
            window.open(
              "https://github.com/Rishabh-1029",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <h3>
            <img
              src="https://github.githubassets.com/favicons/favicon.svg"
              alt="GitHub"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            GitHub Activity
          </h3>

          <img
            src="https://github-readme-activity-graph.vercel.app/graph?username=Rishabh-1029&theme=github-compact"
            alt="GitHub Contribution Graph"
          />
        </div>

        {/* GitHub Streak */}
        <div
          className="stats-card"
          onClick={() =>
            window.open(
              "https://github.com/Rishabh-1029",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <h3>
            <img
              src="https://github.githubassets.com/favicons/favicon.svg"
              alt="GitHub"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            GitHub Consistency
          </h3>

          <img
            src="https://github-readme-streak-stats.herokuapp.com/?user=Rishabh-1029"
            alt="GitHub Streak"
          />
        </div>
      </div>

      <div className="stats-grid">
        {/* LeetCode Card 1 */}
        <div
          className="stats-card"
          onClick={() =>
            window.open(
              "https://leetcode.com/rspsurana/",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <h3>
            <img
              src="https://leetcode.com/favicon.ico"
              alt="LeetCode"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            LeetCode Progress
          </h3>

          <img
            src="https://leetcard.jacoblin.cool/rspsurana?theme=light&font=Baloo"
            alt="LeetCode Stats"
          />
        </div>

        {/* LeetCode Card 2 (Temporary – for layout) */}
        <div
          className="stats-card"
          onClick={() =>
            window.open(
              "https://leetcode.com/rspsurana/",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <h3>
            <img
              src="https://leetcode.com/favicon.ico"
              alt="LeetCode"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                verticalAlign: "middle",
              }}
            />
            LeetCode Progress
          </h3>

          <img
            src="https://leetcard.jacoblin.cool/rspsurana?theme=light&font=Baloo"
            alt="LeetCode Stats"
          />
        </div>
      </div>
    </>
  );
}

export default CodingAchievements;
