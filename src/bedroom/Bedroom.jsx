import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Outline, Selection } from "@react-three/postprocessing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FileText } from "lucide-react";
import useBootStore from "#shared/store/boot";
import useBedroomStore from "./store/useBedroomStore";
import { HOME_VIEW } from "./data/items";
import CameraRig from "./components/scene/CameraRig";
import Scene from "./components/scene/Scene";
import Loader from "./components/ui/Loader";
import RoomErrorBoundary from "./components/ui/RoomErrorBoundary";
import BadgeCard from "./components/ui/cards/BadgeCard";
import PhoneScreen from "./components/ui/phone/PhoneScreen";
import HandheldScreen from "./components/ui/handheld/HandheldScreen";
import ProjectCard from "./components/ui/cards/ProjectCard";
import CvCard from "./components/ui/cards/CvCard";
import TipBar from "./components/ui/TipBar";
import Landing from "#landing/Landing";

// The landing experience: a first-person 3D bedroom at night. Every portfolio
// section lives on an object in the room; the laptop leads to the desktop.
const Bedroom = () => {
  const rootRef = useRef(null);
  const phase = useBootStore((s) => s.phase);
  const focused = useBedroomStore((s) => s.focused);
  const hovered = useBedroomStore((s) => s.hovered);
  const hintSeen = useBedroomStore((s) => s.hintSeen);
  const close = useBedroomStore((s) => s.close);
  const cvPicked = useBedroomStore((s) => s.noteIndex !== null);
  const [quickView, setQuickView] = useState(false);

  // Fresh room on every visit (e.g. after powering off from the desktop).
  useEffect(() => {
    useBedroomStore.getState().reset();
  }, []);

  useEffect(() => {
    if (focused && !useBedroomStore.getState().hintSeen) {
      useBedroomStore.getState().dismissHint();
    }
  }, [focused]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !e.defaultPrevented && useBedroomStore.getState().focused) {
        useBedroomStore.getState().requestClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // When entering, fade to black to cover the swap to the boot screen.
  useGSAP(
    () => {
      if (phase !== "entering") return;
      gsap.to(".bedroom-fade", { opacity: 1, duration: 1.1, delay: 0.2, ease: "power2.in" });
    },
    { dependencies: [phase], scope: rootRef },
  );


  return (
    <div id="bedroom" ref={rootRef} className={hovered ? "hovering" : ""}>
      <RoomErrorBoundary>
        <Canvas
          camera={{ position: HOME_VIEW.position, fov: 60, near: 0.02, far: 30 }}
          gl={{ antialias: true }}
          // 1x on purpose: bloom + outline at 1.5x halved the frame rate
          // (~45 vs ~100 FPS measured), for barely visible sharpness.
          dpr={1}
          frameloop={phase === "landing" || phase === "entering" ? "always" : "never"}
        >
          <color attach="background" args={["#07060f"]} />
          <Selection>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
            <EffectComposer autoClear={false} multisampling={4}>
              <Outline blur xRay={false} edgeStrength={4} visibleEdgeColor={0x9be7ff} hiddenEdgeColor={0x9be7ff} />
              <Bloom mipmapBlur luminanceThreshold={1} intensity={0.9} />
            </EffectComposer>
          </Selection>
          <CameraRig />
        </Canvas>

        <Loader />
      </RoomErrorBoundary>

      {!hintSeen && !focused && (
        <p className="bedroom-hint">Drag to look around · click things that glow</p>
      )}

      {phase === "landing" && (
        <button type="button" className="bedroom-quick" onClick={() => setQuickView(true)}>
          <FileText size={14} /> Quick view
        </button>
      )}

      {focused === "computer" && phase === "landing" && (
        <TipBar onBack={close} hint="Click the screen to start" />
      )}

      {focused === "cv" && phase === "landing" && cvPicked && (
        <CvCard onClose={() => useBedroomStore.getState().setNoteIndex(null)} />
      )}

      {focused === "phone" && phase === "landing" && <PhoneScreen onClose={close} />}
      {focused === "experience" && phase === "landing" && <BadgeCard />}
      {focused === "tech" && phase === "landing" && <HandheldScreen onClose={close} />}
      {focused === "projects" && phase === "landing" && <ProjectCard />}

      {quickView && phase === "landing" && <Landing onClose={() => setQuickView(false)} />}

      <div className="bedroom-fade" />

      <div className="small-screen">
        <p>This experience is designed for desktop/tablet screens only.</p>
        <button type="button" onClick={() => setQuickView(true)}>
          See the quick view instead
        </button>
      </div>
    </div>
  );
};

export default Bedroom;
