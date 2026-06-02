import { techStack } from "#constants";

const Skills = () => (
  <section className="landing-section landing-skills">
    <div className="landing-section-inner">
      <header className="landing-section-head reveal">
        <div className="landing-rule">
          <span className="line" />
          <span className="mark">∞</span>
          <span className="line" />
        </div>
        <p className="landing-eyebrow">What I work with</p>
        <h2 className="landing-section-title">Skills</h2>
      </header>

      <div className="skills-grid">
        {techStack.map(({ category, items }) => (
          <div key={category} className="skill-card reveal">
            <h3>{category}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
