import { useState } from "react";
import useBedroomStore from "../store/useBedroomStore";
import { canInteract, isDrag } from "../utils/pointer";

// On/off switch for a decor lamp (not a portfolio item, so no marker or
// focus). Starts off; hovering shows the pointer cursor (hover id `id`), and a
// click toggles it. Clicks stop at the lamp so they don't reach the room
// (which would close whatever is open).
const useLampSwitch = (id) => {
  const [on, setOn] = useState(false);

  const handlers = {
    onPointerOver: (e) => {
      e.stopPropagation();
      if (canInteract()) useBedroomStore.getState().setHovered(id);
    },
    onPointerOut: () => {
      if (useBedroomStore.getState().hovered === id) useBedroomStore.getState().setHovered(null);
    },
    onClick: (e) => {
      e.stopPropagation();
      if (!canInteract() || isDrag(e)) return;
      setOn((v) => !v);
    },
  };

  return { on, handlers };
};

export default useLampSwitch;
