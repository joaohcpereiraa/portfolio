import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { landingProjects } from "#constants";
import useBedroomStore from "../../../store/useBedroomStore";
import { assetUrl } from "#shared/utils/assetUrl";
import { reducedMotion } from "../../../utils/motion";
import usePickedCard from "../../../hooks/usePickedCard";
import TipBar from "../TipBar";
import Pager from "../Pager";

// How long the card takes to flip away; matches .project-card.flipping in
// index.css.
const FLIP_MS = reducedMotion ? 0 : 380;

// The back of the picked poster: once the 3D poster has flown over and turned
// around, this card finishes the flip and shows the project. Previous / Next
// (or the arrow keys) swap posters. Leaving flips it back, and only then does
// the poster return to the wall. With none picked, a small bar offers Back.
const ProjectCard = () => {
  const requestClose = useBedroomStore((s) => s.requestClose);
  const { shownIndex, leaving: flipping, go } = usePickedCard({ count: landingProjects.length, leaveMs: FLIP_MS });
  const project = shownIndex === null ? null : landingProjects[shownIndex];

  if (!project) return <TipBar onBack={requestClose} hint="Pick a poster" />;

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
          <Pager className="project-card-nav" index={shownIndex} count={landingProjects.length} onGo={go} label="project" />
        </footer>
      </article>
    </div>
  );
};

export default ProjectCard;
