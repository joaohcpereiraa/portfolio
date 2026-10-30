import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BACKDROPS } from "../data/backdrops";

gsap.registerPlugin(ScrollTrigger);

// Scroll effects for the quick view inside `rootRef`: each .reveal card fades
// up as it scrolls into view, and the backdrop colour shifts as each section
// reaches the middle of the viewport.
const useScrollEffects = (rootRef) => {
  useGSAP(
    () => {
      const root = rootRef.current;
      const scroller = root.querySelector(".landing-scroller");

      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, scroller, start: "top 88%" },
        });
      });

      BACKDROPS.forEach(({ trigger, color }) => {
        const setColor = () =>
          gsap.to(root, {
            backgroundColor: color,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        ScrollTrigger.create({
          trigger,
          scroller,
          start: "top center",
          end: "bottom center",
          onEnter: setColor,
          onEnterBack: setColor,
        });
      });
    },
    { scope: rootRef },
  );
};

export default useScrollEffects;
