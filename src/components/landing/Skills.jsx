import { useState } from "react";
import { skillsOrbit } from "#constants";

const Skills = () => {
  const [stackIndex, setStackIndex] = useState(0);
  // Hovered skill drives the detail card shown in the middle of the orbit.
  const [active, setActive] = useState(null);

  const stack = skillsOrbit[stackIndex];

  const selectStack = (i) => {
    setStackIndex(i);
    setActive(null);
  };

  return (
    <section className="landing-section landing-skills">
      <div className="landing-section-inner">
        <div className="skills-orbit reveal">
          <span className="orbit-guide outer" />
          <span className="orbit-guide inner" />

          {/* Remounting on stack switch replays the staggered icon pop-in. */}
          <div className="orbit-ring" key={stack.stack}>
            {stack.items.map((skill, i) => (
              <div
                key={skill.name}
                className="orbit-item"
                style={{
                  "--angle": `${(360 / stack.items.length) * i}deg`,
                  "--i": i,
                }}
              >
                <div
                  className="orbit-icon"
                  onMouseEnter={() => setActive(skill)}
                  onMouseLeave={() => setActive(null)}
                >
                  <img src={skill.icon} alt={skill.name} />
                </div>
              </div>
            ))}
          </div>

          <div className="orbit-center">
            {active ? (
              <div className="orbit-detail" key={active.name}>
                <img src={active.icon} alt="" />
                <h3>{active.name}</h3>
                <span className="orbit-detail-tag">{stack.stack}</span>
                <p className="orbit-detail-blurb">{active.blurb}</p>
                <p className="orbit-detail-used">{active.usedAt}</p>
              </div>
            ) : (
              <>
                <div className="landing-rule">
                  <span className="line" />
                  <span className="mark">∞</span>
                  <span className="line" />
                </div>
                <p className="landing-eyebrow">Skills — what I work with</p>
                <h2 className="landing-section-title">{stack.stack}</h2>
                <p className="orbit-hint">Hover a logo to see it in context</p>
              </>
            )}
          </div>
        </div>

        <div className="orbit-tabs reveal">
          {skillsOrbit.map((s, i) => (
            <button
              key={s.stack}
              type="button"
              className={`orbit-tab ${i === stackIndex ? "active" : ""}`}
              onClick={() => selectStack(i)}
            >
              {s.stack}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
