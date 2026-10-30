import { useRef } from "react";
import useBedroomStore from "../store/useBedroomStore";
import { isDrag } from "../utils/pointer";
import { isTaken } from "../store/selectors";

// Pointer handling for one item of a pickable group. `hoverRef` is true while
// it's hovered with the group open and the item still in place. With the
// group open, clicking the item picks it; before that, the click bubbles to
// the Clickable, which opens the group.
const usePickable = (focusId, index) => {
  const hoverRef = useRef(false);

  const handlers = {
    onPointerOver: () => {
      if (useBedroomStore.getState().focused === focusId && !isTaken(focusId, index)) hoverRef.current = true;
    },
    onPointerOut: () => {
      hoverRef.current = false;
    },
    onClick: (e) => {
      const { focused, setNoteIndex } = useBedroomStore.getState();
      if (focused !== focusId || isDrag(e) || isTaken(focusId, index)) return;
      e.stopPropagation();
      setNoteIndex(index);
    },
  };

  return { hoverRef, handlers };
};

export default usePickable;
