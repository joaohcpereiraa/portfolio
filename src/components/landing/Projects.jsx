import { ArrowUpRight } from "lucide-react";
import { landingProjects } from "#constants";
import { assetUrl } from "../../utils/assetUrl";

const Projects = () => (
  <section className="landing-section landing-projects">
    <div className="landing-section-inner">
      <header className="landing-section-head reveal">
        <div className="landing-rule">
          <span className="line" />
          <span className="mark">∞</span>
          <span className="line" />
        </div>
        <p className="landing-eyebrow">Selected work</p>
        <h2 className="landing-section-title">Projects</h2>
      </header>

      <div className="projects-list">
        {landingProjects.map((p, i) => (
          <article
            key={p.id}
            className={`project-feature reveal ${i % 2 === 1 ? "flip" : ""}`}
          >
            {/* mac-style window chrome to match the desktop simulation theme */}
            <div className="project-frame">
              <div className="project-frame-bar">
                <span />
                <span />
                <span />
                <p>{p.name.toLowerCase().replace(/\s+/g, "-")}.app</p>
              </div>
              {p.image ? (
                <img className="project-shot" src={p.image} alt={p.name} />
              ) : (
                <div
                  className="project-cover"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent[0]}, ${p.accent[1]})`,
                  }}
                >
                  <span className="project-cover-initial">{p.name[0]}</span>
                  <div className="project-cover-icons">
                    {p.stack
                      .filter((t) => t.icon)
                      .map((t) => (
                        <img key={t.name} src={t.icon} alt="" />
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="project-info">
              <p className="project-tagline">{p.tagline}</p>
              <h3>{p.name}</h3>
              <p className="project-desc">{p.description}</p>

              <ul className="project-stack">
                {p.stack.map((t) => (
                  <li key={t.name}>
                    {t.icon && <img src={t.icon} alt="" />}
                    {t.name}
                  </li>
                ))}
              </ul>

              {p.link && (
                <a
                  className="project-link"
                  href={assetUrl(p.link)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.linkLabel || "View"}
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
