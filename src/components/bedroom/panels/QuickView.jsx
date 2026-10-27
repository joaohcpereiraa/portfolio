import { useEffect } from "react";
import { Download, X } from "lucide-react";
import { aboutCard, careerTimeline, landingProjects, profile, socials, techStack } from "#constants";
import { assetUrl } from "../../../utils/assetUrl";

const PHOTO_URL = assetUrl("/images/joao.png");
const CV_URL = assetUrl("/files/resumee.pdf");
const EMAIL = aboutCard.rows.find((r) => r.label === "email").value;
const LOCATION = aboutCard.rows.find((r) => r.label === "based in")?.value;

const SKILL_GROUPS = ["Frontend", "Backend", "Database", "Dev Tools"];
const skills = techStack.filter((g) => SKILL_GROUPS.includes(g.category));
const experience = careerTimeline.filter((t) => t.type === "work").reverse();

// Quick view: the whole portfolio on one ruled index card, for anyone who'd
// rather not explore the room (or whose device struggles with 3D). Section
// names sit in the card's margin; every line of text rides the ruling.
const QuickView = ({ onClose }) => {
  useEffect(() => {
    // Capture phase + preventDefault so Escape doesn't also close a room item.
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <div className="quickview-wrap" onClick={onClose}>
      <article className="quickview" role="dialog" aria-label="Quick view" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="quickview-close" onClick={onClose} aria-label="Close quick view">
          <X size={18} />
        </button>

        <header className="quickview-head">
          <div>
            <h2>{profile.name}</h2>
            <p>
              {profile.role}
              {LOCATION && ` in ${LOCATION}`}
            </p>
          </div>
          <img src={PHOTO_URL} alt={profile.name} />
        </header>

        <p className="quickview-bio">{profile.bio}</p>

        <div className="quickview-actions">
          <a href={CV_URL} download className="quickview-cv">
            <Download size={15} /> Download CV
          </a>
          <a href={`mailto:${EMAIL}`}>Email me</a>
          {socials.map((s) => (
            <a key={s.id} href={s.link} target="_blank" rel="noreferrer">
              {s.text}
            </a>
          ))}
        </div>

        <section className="quickview-row">
          <h3>Work</h3>
          <ul>
            {experience.map((job) => (
              <li key={job.id}>
                <strong>{job.title}</strong> at {job.place}
                <time>{job.period}</time>
              </li>
            ))}
          </ul>
        </section>

        <section className="quickview-row">
          <h3>Projects</h3>
          <ul>
            {landingProjects.map((p) => (
              <li key={p.id}>
                {p.link ? (
                  <a href={assetUrl(p.link)} target="_blank" rel="noreferrer">
                    {p.name}
                  </a>
                ) : (
                  <strong>{p.name}</strong>
                )}{" "}
                {p.summary}
              </li>
            ))}
          </ul>
        </section>

        <section className="quickview-row">
          <h3>Skills</h3>
          <ul>
            {skills.map((g) => (
              <li key={g.category}>
                <em>{g.category}</em> {g.items.join(", ")}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
};

export default QuickView;
