import { useEffect, useState } from "react";
import { reducedMotion } from "../utils/motion";

// Types `text` out two letters every `ms`, like an RPG dialogue box (the
// guide's speech bubble, the handheld's item details). Instant with reduced
// motion.
const useTypewriter = (text, ms = 22) => {
  const [count, setCount] = useState(reducedMotion ? text.length : 0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) clearInterval(id);
        return Math.min(c + 2, text.length);
      });
    }, ms);
    return () => clearInterval(id);
  }, [text, ms]);
  return text.slice(0, count);
};

export default useTypewriter;
