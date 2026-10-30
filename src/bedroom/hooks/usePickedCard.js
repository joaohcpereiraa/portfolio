import { useEffect, useState } from "react";
import useBedroomStore from "../store/useBedroomStore";

// The card for a picked poster / badge, shared by ProjectCard and BadgeCard.
// `shownIndex` lags the store's noteIndex: when another item (or none) is
// picked, or the view closes, the shown card first plays its leave animation
// for `leaveMs` (`leaving` is true), then the next one is shown, or the view
// closes. The arrow keys step through the `count` items while `keys` is on.
// With `releaseEarly` the 3D item heads back as soon as the card starts
// leaving, so the two crossfade; otherwise it waits until the card is gone.
const usePickedCard = ({ count, leaveMs, keys = true, releaseEarly = false }) => {
  const noteIndex = useBedroomStore((s) => s.noteIndex);
  const closing = useBedroomStore((s) => s.closing);
  const setNoteIndex = useBedroomStore((s) => s.setNoteIndex);
  const [shownIndex, setShownIndex] = useState(noteIndex);
  const last = count - 1;

  // Picking from none needs no leave animation first.
  if (shownIndex === null && noteIndex !== null && !closing) setShownIndex(noteIndex);

  const leaving = shownIndex !== null && (closing || noteIndex !== shownIndex);

  // The shown card's item is the one taken out of the scene.
  useEffect(() => {
    useBedroomStore.getState().setTakenIndex(shownIndex);
  }, [shownIndex]);

  useEffect(() => {
    if (!leaving) return;
    if (releaseEarly) useBedroomStore.getState().setTakenIndex(null);
    const id = setTimeout(() => {
      const { closing: isClosing, close, noteIndex: next } = useBedroomStore.getState();
      if (isClosing) close();
      else setShownIndex(next);
    }, leaveMs);
    return () => clearTimeout(id);
  }, [leaving, leaveMs, releaseEarly]);

  useEffect(() => {
    if (!keys) return;
    const onKey = (e) => {
      const i = useBedroomStore.getState().noteIndex;
      if (e.key === "ArrowRight") setNoteIndex(i === null ? 0 : Math.min(i + 1, last));
      if (e.key === "ArrowLeft") setNoteIndex(i === null ? last : Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keys, last, setNoteIndex]);

  const go = (i) => setNoteIndex(Math.min(Math.max(i, 0), last));

  return { shownIndex, leaving, go };
};

export default usePickedCard;
