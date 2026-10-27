import { useEffect } from "react";
import { reducedMotion } from "../motion";

const DRAG_START = 4; // px before a press becomes a drag (so taps still click)
const FRICTION = 0.94; // per-frame velocity decay for the flick

// Phone-style scrolling with the mouse: drag the content to scroll and flick
// it to keep it gliding. Touch already scrolls natively, so only mouse/pen
// presses are handled. A drag swallows the click that would follow it.
const useDragScroll = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let drag = null;
    let velocity = 0;
    let raf = 0;
    let suppressClick = false;

    const glide = () => {
      velocity *= FRICTION;
      el.scrollTop -= velocity;
      if (Math.abs(velocity) > 0.3) raf = requestAnimationFrame(glide);
    };

    const onDown = (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      cancelAnimationFrame(raf);
      drag = { y: e.clientY, startY: e.clientY, last: performance.now(), moving: false };
      velocity = 0;
    };
    const onMove = (e) => {
      if (!drag) return;
      if (!drag.moving && Math.abs(e.clientY - drag.startY) < DRAG_START) return;
      if (!drag.moving) {
        drag.moving = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add("dragging");
      }
      const dy = e.clientY - drag.y;
      const now = performance.now();
      el.scrollTop -= dy;
      velocity = (dy / Math.max(now - drag.last, 1)) * 16; // px per ~frame
      drag.y = e.clientY;
      drag.last = now;
    };
    const onUp = () => {
      if (!drag) return;
      suppressClick = drag.moving;
      el.classList.remove("dragging");
      drag = null;
      if (!reducedMotion && Math.abs(velocity) > 1) raf = requestAnimationFrame(glide);
    };
    const onClick = (e) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    // Stop links/images starting a native drag-and-drop instead of scrolling.
    const onDragStart = (e) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [ref]);
};

export default useDragScroll;
