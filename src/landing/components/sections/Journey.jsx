import { careerTimeline } from "#constants";
import SectionTitle from "../ui/SectionTitle";

const Journey = () => (
  <section className="landing-section landing-journey">
    <div className="landing-section-inner">
      <header className="landing-section-head reveal">
        <SectionTitle eyebrow="Where I've been" title="Journey" />
      </header>

      <ol className="timeline">
        {careerTimeline.map((entry) => (
          <li key={entry.id} className="timeline-entry reveal">
            <span className="timeline-dot" />
            <article className="timeline-card">
              <div className="timeline-meta">
                <span className="timeline-period">{entry.period}</span>
                <span className={`timeline-tag ${entry.type}`}>
                  {entry.type === "work" ? "Work" : "Education"}
                </span>
              </div>
              <h3>{entry.title}</h3>
              <p className="timeline-place">{entry.place}</p>
              <p className="timeline-desc">{entry.description}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Journey;
