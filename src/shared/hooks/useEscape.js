import { useEffect } from "react";

// Calls onEscape when Escape is pressed. Capture phase + preventDefault, so an
// overlay on top gets the key first and whatever is behind it ignores it.
const useEscape = (onEscape) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onEscape();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onEscape]);
};

export default useEscape;
