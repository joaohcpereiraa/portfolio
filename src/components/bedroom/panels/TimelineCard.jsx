import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { careerTimeline } from "#constants";
import useBedroomStore from "#store/bedroom";
import { reducedMotion } from "../motion";

// How long the fold-up (details close, then the note shrinks away) takes;
// matches .note-card.folding in index.css.
const FOLD_MS = reducedMotion ? 0 : 620;

// The picked sticky note, unfolded in front of the board: the top half is the
// note's face (year, title, place); the bottom half folds open to reveal the
// story. Previous / Next (or the arrow keys) follow the red string. Leaving a
// note plays it in reverse: it folds up, shrinks, and only then does the 3D
// note fly back to its pin. With no note open, a small bar offers Back.
const TimelineCard = () => {
  const noteIndex = useBedroomStore((s) => s.noteIndex);
  const closing = useBedroomStore((s) => s.closing);
  const setNoteIndex = useBedroomStore((s) => s.setNoteIndex);
  const requestClose = useBedroomStore((s) => s.requestClose);
  const [shownIndex, setShownIndex] = useState(noteIndex);

  // Opening a note from the bare board needs no fold first: show it now.
  if (shownIndex === null && noteIndex !== null && !closing) setShownIndex(noteIndex);

  const folding = shownIndex !== null && (closing || noteIndex !== shownIndex);
  const entry = shownIndex === null ? null : careerTimeline[shownIndex];
  const last = careerTimeline.length - 1;

  // The shown note is the one off the board.
  useEffect(() => {
    useBedroomStore.getState().setTakenIndex(shownIndex);
  }, [shownIndex]);

  // Once folded away: close the board, or show the next note (or none).
  useEffect(() => {
    if (!folding) return;
    const id = setTimeout(() => {
      const { closing: isClosing, close, noteIndex: next } = useBedroomStore.getState();
      if (isClosing) close();
      else setShownIndex(next);
    }, FOLD_MS);
    return () => clearTimeout(id);
  }, [folding]);

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

  if (!entry) {
    return (
      <div className="bedroom-computer-tip">
        <button type="button" onClick={requestClose}>
          <ArrowLeft size={14} /> Back
        </button>
        <span>Pick a note</span>
      </div>
    );
  }

  const year = entry.period.match(/\d{4}/)?.[0];

  return (
    <div className="note-card-wrap">
      {/* Remount per note so the fly-in + unfold replays. */}
      <article className={`note-card ${entry.type} ${folding ? "folding" : ""}`} key={entry.id}>
        <button type="button" className="note-card-back" onClick={requestClose}>
          <ArrowLeft size={14} /> Back
        </button>

        <header className="note-card-face">
          <span className="note-card-pin" />
          <div className="note-card-meta">
            <span className="note-card-tag">{entry.type === "work" ? "Work" : "Education"}</span>
            <span>{entry.period}</span>
          </div>
          <p className="note-card-year">{year}</p>
          <h3>{entry.title}</h3>
          <p className="note-card-place">{entry.place}</p>
        </header>

        <div className="note-card-fold">
          <p>{entry.description}</p>
          <nav className="note-card-nav">
            <button type="button" onClick={() => go(shownIndex - 1)} disabled={shownIndex === 0}>
              <ChevronLeft size={16} /> Previous
            </button>
            <span>
              {shownIndex + 1} / {careerTimeline.length}
            </span>
            <button type="button" onClick={() => go(shownIndex + 1)} disabled={shownIndex === last}>
              Next <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      </article>
    </div>
  );
};

export default TimelineCard;
