import "./TaglineStrip.css";

const TaglineGroup = () => (
  <span className="tagline-ribbon-group" aria-hidden="true">
    {Array.from({ length: 4 }, (_, index) => (
      <span className="tagline-ribbon-phrase" key={index}>
        <span className="tagline-ribbon-words">
          Creating, Learning, Evolving
        </span>
        <span className="tagline-ribbon-code-mark">{"</>"}</span>
      </span>
    ))}
  </span>
);

const TaglineStrip = () => (
  <p className="tagline-ribbon">
    <span className="tagline-ribbon-accessible">
      Creating, Learning, Evolving
    </span>
    <span className="tagline-ribbon-track" aria-hidden="true">
      <TaglineGroup />
      <TaglineGroup />
    </span>
  </p>
);

export default TaglineStrip;
