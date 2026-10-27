import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { landingProjects } from "#constants";
import useBedroomStore from "#store/bedroom";
import { assetUrl } from "../../../utils/assetUrl";
import { reducedMotion } from "../motion";

// How long the card takes to flip away; matches .project-card.flipping in
// index.css.
const FLIP_MS = reducedMotion ? 0 : 380;

// The back of the picked poster: once the 3D poster has flown over and turned
// around, this card finishes the flip and shows the project. Previous / Next
// (or the arrow keys) swap posters. Leaving flips it back, and only then does
// the poster return to the wall. With none picked, a small bar offers Back.
const ProjectCard = () => {
  const noteIndex = useBedroomStore((s) => s.noteIndex);
  const closing = useBedroomStore((s) => s.closing);
  const setNoteIndex = useBedroomStore((s) => s.setNoteIndex);
  const requestClose = useBedroomStore((s) => s.requestClose);
  const [shownIndex, setShownIndex] = useState(noteIndex);

  // Taking a poster down from the bare wall needs no flip-away first.
  if (shownIndex === null && noteIndex !== null && !closing) setShownIndex(noteIndex);

  const flipping = shownIndex !== null && (closing || noteIndex !== shownIndex);
  const project = shownIndex === null ? null : landingProjects[shownIndex];
  const last = landingProjects.length - 1;

  // The shown poster is the one off the wall.
  useEffect(() => {
    useBedroomStore.getState().setTakenIndex(shownIndex);
  }, [shownIndex]);

  // Once flipped away: close the wall, or show the next poster (or none).
  useEffect(() => {
    if (!flipping) return;
    const id = setTimeout(() => {
      const { closing: isClosing, close, noteIndex: next } = useBedroomStore.getState();
      if (isClosing) close();
      else setShownIndex(next);
    }, FLIP_MS);
    return () => clearTimeout(id);
  }, [flipping]);

  useEffect(() => {
    const onKey = (e) => {
      const i = useBedroomStore.getState().noteIndex;
      if (e.key === "ArrowRight") setNoteIndex(i === null ? 0 : Math.min(i + 1, last));
      if (e.key === "ArrowLeft") setNoteIndex(i === null ? last : Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last, setNoteIndex]);

  const go = (i) => setNoteIndex(Math.min(Math.max(i, 0), last));

  if (!project) {
    return (
      <div className="bedroom-computer-tip">
        <button type="button" onClick={requestClose}>
          <ArrowLeft size={14} /> Back
        </button>
        <span>Pick a poster</span>
      </div>
    );
  }

  return (
    <div className="project-card-wrap">
      {/* Remount per poster so the flip-in replays. */}
      <article className={`project-card ${flipping ? "flipping" : ""}`} key={project.id}>
        <button type="button" className="project-card-back" onClick={requestClose}>
          <ArrowLeft size={14} /> Back
        </button>

        <span className="project-card-tape" />

        {project.image ? (
          <img className="project-card-shot" src={project.image} alt={project.name} />
        ) : (
          <div
            className="project-card-shot project-card-cover"
            style={{ background: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})` }}
          >
            {project.name}
          </div>
        )}

        <div className="project-card-body">
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
          <p className="project-card-stack">{project.stack.map((t) => t.name).join(" · ")}</p>
        </div>

        <footer className="project-card-footer">
          {project.link && (
            <a className="project-card-link" href={assetUrl(project.link)} target="_blank" rel="noreferrer">
              {project.linkLabel || "View"} <ArrowUpRight size={15} />
            </a>
          )}
          <nav className="project-card-nav">
            <button type="button" onClick={() => go(shownIndex - 1)} disabled={shownIndex === 0} aria-label="Previous project">
              <ChevronLeft size={16} />
            </button>
            <span>
              {shownIndex + 1} / {landingProjects.length}
            </span>
            <button type="button" onClick={() => go(shownIndex + 1)} disabled={shownIndex === last} aria-label="Next project">
              <ChevronRight size={16} />
            </button>
          </nav>
        </footer>
      </article>
    </div>
  );
};

export default ProjectCard;
