import { useRef } from "react";
import { X } from "lucide-react";
import useEscape from "#shared/hooks/useEscape";
import useScrollEffects from "./hooks/useScrollEffects";
import Hero from "./components/sections/Hero";
import Journey from "./components/sections/Journey";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";

// Quick view: the whole portfolio as one scrolling page (hero, journey,
// skills, projects) over the room, for anyone who'd rather not explore in 3D
// or whose device struggles with it. Close (or Escape) goes back to the room.
const Landing = ({ onClose }) => {
  const rootRef = useRef(null);

  // Escape closes only the quick view, not a room item behind it.
  useEscape(onClose);

  useScrollEffects(rootRef);

  return (
    <div id="landing" ref={rootRef} role="dialog" aria-label="Quick view">
      <div className="landing-stars" />

      <div className="landing-scroller">
        <section className="landing-section landing-hero-section">
          <Hero />
        </section>

        <Journey />
        <Skills />
        <Projects />
      </div>

      <span className="landing-frame tl" />
      <span className="landing-frame tr" />
      <span className="landing-frame bl" />
      <span className="landing-frame br" />

      <button type="button" className="landing-close" onClick={onClose} aria-label="Back to the room">
        <X size={18} />
      </button>
    </div>
  );
};

export default Landing;
