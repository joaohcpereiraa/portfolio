import { useState } from "react";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import { careerTimeline } from "#constants";
import useBedroomStore from "../../../store/useBedroomStore";
import { badgeColor, placeLogo, shortPlace } from "../../../utils/badges";
import { reducedMotion } from "../../../utils/motion";
import { durationLabel, periodEnds } from "../../../utils/period";
import usePickedCard from "../../../hooks/usePickedCard";
import ExperiencePanel from "./ExperiencePanel";
import TipBar from "../TipBar";
import Pager from "../Pager";

// How long the badge takes to drop away; matches .badge-card.leaving in
// index.css.
const LEAVE_MS = reducedMotion ? 0 : 380;

// The picked-up ID badge, held up in front of you: the same badge as on the
// rail (lanyard, colour stripe, logo) with just the role, its dates and what
// you did there. It fades in with a soft swing as the 3D badge arrives
// and fades out. Previous / Next (or the arrow keys) swap badges. Leaving
// fades it out while the 3D badge fades back in on its way to the hook. With
// none picked, a small bar offers Back and the whole timeline as a list.
const BadgeCard = () => {
  const setNoteIndex = useBedroomStore((s) => s.setNoteIndex);
  const requestClose = useBedroomStore((s) => s.requestClose);
  const [showList, setShowList] = useState(false);
  // The 3D badge starts back to its hook as this one starts dropping away, so
  // the two crossfade.
  const { shownIndex, leaving, go } = usePickedCard({
    count: careerTimeline.length,
    leaveMs: LEAVE_MS,
    keys: !showList,
    releaseEarly: true,
  });
  const entry = shownIndex === null ? null : careerTimeline[shownIndex];

  if (!entry) {
    return (
      <>
        <TipBar onBack={requestClose} hint="Pick a badge">
          <button type="button" onClick={() => setShowList((v) => !v)} aria-pressed={showList}>
            <List size={14} /> View as list
          </button>
        </TipBar>
        {showList && (
          <ExperiencePanel
            onClose={() => setShowList(false)}
            onPick={(i) => {
              setShowList(false);
              setNoteIndex(i);
            }}
          />
        )}
      </>
    );
  }

  const logo = placeLogo(entry);
  const [from, to] = periodEnds(entry.period);

  return (
    <div className="badge-card-wrap">
      {/* Remount per badge so the swing-in replays. */}
      <article
        className={`badge-card ${leaving ? "leaving" : ""}`}
        key={entry.id}
        style={{ "--accent": badgeColor(entry) }}
      >
        <span className="badge-card-lanyard" aria-hidden="true" />
        <span className="badge-card-clip" aria-hidden="true" />
        <span className="badge-card-slot" aria-hidden="true" />

        <span className="badge-card-band" aria-hidden="true" />

        <div className="badge-card-logo">
          {logo ? <img src={logo} alt={shortPlace(entry.place)} /> : <strong>{shortPlace(entry.place)}</strong>}
        </div>

        {/* The dates are the first thing to read: start → end, then how long. */}
        <div className="badge-card-when">
          <p>
            <span>From</span>
            <strong>{from}</strong>
          </p>
          <ArrowRight className="badge-card-arrow" size={18} aria-hidden="true" />
          <p>
            <span>To</span>
            <strong>{to ?? from}</strong>
          </p>
        </div>
        <p className="badge-card-duration">{durationLabel(entry.period)}</p>

        <h3>{entry.title}</h3>
        <p className="badge-card-desc">{entry.description}</p>

        <footer className="badge-card-footer">
          <button type="button" className="badge-card-back" onClick={requestClose}>
            <ArrowLeft size={14} /> Back
          </button>
          <Pager className="badge-card-nav" index={shownIndex} count={careerTimeline.length} onGo={go} label="role" />
        </footer>
      </article>
    </div>
  );
};

export default BadgeCard;
