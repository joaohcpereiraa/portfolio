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

      <div className="projects-grid">
        {landingProjects.map((p) => (
          <article key={p.id} className="project-card reveal">
            <div className="project-card-top">
              <h3>{p.name}</h3>
              <p className="project-tagline">{p.tagline}</p>
            </div>

            <p className="project-desc">{p.description}</p>

            <ul className="project-stack">
              {p.stack.map((t) => (
                <li key={t}>{t}</li>
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
                <ArrowUpRight size={15} />
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
