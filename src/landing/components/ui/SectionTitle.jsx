// The ∞ rule, eyebrow and title that open each landing section.
const SectionTitle = ({ eyebrow, title }) => (
  <>
    <div className="landing-rule">
      <span className="line" />
      <span className="mark">∞</span>
      <span className="line" />
    </div>
    <p className="landing-eyebrow">{eyebrow}</p>
    <h2 className="landing-section-title">{title}</h2>
  </>
);

export default SectionTitle;
