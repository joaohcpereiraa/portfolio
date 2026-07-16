import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Hero from "./Hero";
import Journey from "./Journey";
import Skills from "./Skills";
import Projects from "./Projects";
import useBootStore from "#store/boot";
import useLandingStore from "#store/landing";
import MacbookScene from "./MacbookScene";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const rootRef = useRef(null);
  const phase = useBootStore((s) => s.phase);

  useGSAP(
    () => {
      const root = rootRef.current;
      const scroller = root.querySelector(".landing-scroller");

      // Fade each info card up as it scrolls into view.
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, scroller, start: "top 88%" },
        });
      });

      // Shift the backdrop colour as each section reaches the viewport centre.
      const bgStops = [
        { trigger: ".landing-hero-section", color: "#06070d" },
        { trigger: ".landing-journey", color: "#070b14" },
        { trigger: ".landing-skills", color: "#0a0816" },
        { trigger: ".landing-projects", color: "#0d0712" },
        { trigger: ".landing-pc", color: "#000000" },
      ];
      bgStops.forEach(({ trigger, color }) => {
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

      // Pinned PC section: reveal + rotate the laptop with its own scroll progress.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".landing-pc",
          scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) =>
            useLandingStore.getState().setProgress(self.progress),
        },
      });
      tl.fromTo(".landing-glow", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0);
      tl.fromTo(
        ".landing-canvas",
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.6 },
        0,
      );
      tl.fromTo(
        ".landing-tip",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.25 },
        0.75,
      );
    },
    { scope: rootRef },
  );

  // When entering, fade to black to cover the swap to the boot screen.
  useGSAP(
    () => {
      if (phase !== "entering") return;
      gsap.to(".landing-fade", { opacity: 1, duration: 1.1, ease: "power2.in" });
    },
    { dependencies: [phase], scope: rootRef },
  );

  return (
    <div id="landing" ref={rootRef}>
      <div className="landing-stars" />

      <div className="landing-scroller">
        <section className="landing-section landing-hero-section">
          <Hero />
        </section>

        <Journey />
        <Skills />
        <Projects />

        {/* Pinned laptop reveal — scroll spins it from the Apple logo to the screen. */}
        <div className="landing-pc">
          <div className="landing-stage">
            <div className="landing-glow" />
            <div className="landing-canvas">
              <MacbookScene />
            </div>
            <p className="landing-tip">Click the screen to enter</p>
          </div>
        </div>
      </div>

      <span className="landing-frame tl" />
      <span className="landing-frame tr" />
      <span className="landing-frame bl" />
      <span className="landing-frame br" />

      <div className="landing-fade" />

      <div className="small-screen">
        <p>This experience is designed for desktop/tablet screens only.</p>
      </div>
    </div>
  );
};

export default Landing;
