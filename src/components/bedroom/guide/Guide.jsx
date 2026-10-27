import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import useBootStore from "#store/boot";
import useBedroomStore from "#store/bedroom";
import Robot from "../Robot";
import { reducedMotion } from "../motion";
import { GREETING } from "./lines";

const CLICK_THRESHOLD = 6; // px of movement below which a press counts as a click
const SCALE = 0.088; // robot model -> metres (~0.25 m tall)
const SEAT_DROP = 0.084; // the robot's seat sits this far below its centre

// Bit sits on the top plank of the right-wall shelf; to say hello it takes
// off and hovers in front of the visitor's starting view, then flies back.
const HOVER = new THREE.Vector3(0.55, 1.42, -0.2);
const SHELF = new THREE.Vector3(2.3, 1.615 + SEAT_DROP, -0.45);
const SHELF_YAW = -Math.PI / 2;
const HOVER_YAW = Math.atan2(0.3 - HOVER.x, 0.9 - HOVER.z); // toward the visitor

const FLY_IN = 2.4; // s
const FLY_OUT = 2.2; // s
const BUBBLE_AT = [0, 0.2, 0]; // above the head

// How long a line stays up: long enough to read it.
const holdFor = (text) => Math.max(3500, text.length * 60);

// Once per page load: coming back from the desktop doesn't replay it.
let welcomedThisLoad = false;

// Point on a curved flight from a to b, bowing up by `lift` in the middle.
const arc = (a, b, t, lift, out) => {
  out.lerpVectors(a, b, t);
  out.y += Math.sin(t * Math.PI) * lift;
  return out;
};
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const headingTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);

// Types `text` out a few letters at a time.
const Typed = ({ text }) => {
  const [count, setCount] = useState(reducedMotion ? text.length : 0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setCount((c) => Math.min(c + 2, text.length)), 28);
    return () => clearInterval(id);
  }, [text]);
  return text.slice(0, count);
};

// Bit, the astronaut-bot: when someone arrives it takes off from the shelf,
// hovers in front of them to say welcome, then flies back and stays quiet,
// just following the cursor with its eyes. Click it for a wave.
// The bubble floats over its head; if Bit is out of view it docks bottom-left.
const Guide = () => {
  const phase = useBootStore((s) => s.phase);
  const { active } = useProgress();

  // stage: wait | in | talk | out | seated
  const flight = useRef({ stage: welcomedThisLoad ? "seated" : "wait", t: 0 });
  const [line, setLine] = useState(null); // index into GREETING
  const root = useRef(null);
  const bubbleRef = useRef(null);
  const inView = useRef(true);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const liveRef = useRef({
    wave: 0,
    waveUntil: 0,
    point: 0,
    sit: 1,
    fly: 0,
    jet: 0,
    vel: 0,
    px: 0,
    py: 0,
    ry: SHELF_YAW,
    calm: reducedMotion,
  });

  const wave = (seconds) => {
    if (!reducedMotion) liveRef.current.waveUntil = performance.now() / 1000 + seconds;
  };

  // Start the welcome once the room has loaded.
  useEffect(() => {
    if (phase !== "landing" || active || flight.current.stage !== "wait") return;
    welcomedThisLoad = true;
    const id = setTimeout(() => {
      flight.current = { stage: "in", t: 0 };
    }, 600);
    return () => clearTimeout(id);
  }, [phase, active]);

  // Walk through the greeting; after the last line, fly to the shelf.
  useEffect(() => {
    if (line === null) return;
    const id = setTimeout(() => {
      if (line + 1 < GREETING.length) setLine(line + 1);
      else {
        setLine(null);
        flight.current = { stage: "out", t: 0 };
      }
    }, holdFor(GREETING[line]));
    return () => clearTimeout(id);
  }, [line]);

  // Eyes follow the cursor.
  useEffect(() => {
    const onMove = (e) => {
      liveRef.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      liveRef.current.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const f = flight.current;
    const live = liveRef.current;
    const g = root.current;
    let yaw = SHELF_YAW;
    let flying = 0;

    if (f.stage === "in") {
      f.t = reducedMotion ? 1 : Math.min(f.t + dt / FLY_IN, 1);
      arc(SHELF, HOVER, ease(f.t), 0.25, g.position);
      flying = 1 - f.t * 0.4;
      yaw = f.t > 0.7 ? HOVER_YAW : headingTo(SHELF, HOVER);
      if (f.t >= 1) {
        flight.current = { stage: "talk", t: 0 };
        wave(2.5);
        setLine(0);
      }
    } else if (f.stage === "talk") {
      g.position.copy(HOVER);
      if (!reducedMotion) g.position.y += Math.sin(clock.elapsedTime * 2.2) * 0.02;
      flying = 0.6;
      yaw = HOVER_YAW;
    } else if (f.stage === "out") {
      f.t = reducedMotion ? 1 : Math.min(f.t + dt / FLY_OUT, 1);
      arc(HOVER, SHELF, ease(f.t), 0.3, g.position);
      flying = 1 - f.t;
      yaw = f.t > 0.8 ? SHELF_YAW : headingTo(HOVER, SHELF);
      if (f.t >= 1) flight.current = { stage: "seated", t: 0 };
    } else {
      g.position.copy(SHELF); // wait / seated
    }

    // Pose: jets on and legs trailing in flight, sitting once on the shelf.
    const k = (from, to, speed) => (reducedMotion ? to : THREE.MathUtils.damp(from, to, speed, dt));
    live.fly = k(live.fly, flying, 5);
    live.jet = k(live.jet, flying, 5);
    live.sit = k(live.sit, f.stage === "seated" || f.stage === "wait" ? 1 : 0, 5);
    live.wave = k(live.wave, performance.now() / 1000 < live.waveUntil ? 1 : 0, 4);
    const turn = Math.atan2(Math.sin(yaw - live.ry), Math.cos(yaw - live.ry));
    live.ry = reducedMotion ? yaw : live.ry + turn * (1 - Math.exp(-5 * dt));
    g.rotation.y = live.ry;

    // Is Bit on screen? If not, the bubble docks in the corner.
    tmp.copy(g.position).y += BUBBLE_AT[1];
    tmp.project(camera);
    const visible = tmp.z < 1 && Math.abs(tmp.x) < 0.85 && Math.abs(tmp.y) < 0.85;
    if (visible !== inView.current) {
      inView.current = visible;
      bubbleRef.current?.classList.toggle("docked", !visible);
    }
  });

  // Over Bit's head when it's in view, else the bottom-left corner.
  const placeBubble = (el, cam, size) => {
    if (!inView.current) return [20, size.height - 20];
    const p = tmp.setFromMatrixPosition(el.matrixWorld).project(cam);
    return [((p.x + 1) / 2) * size.width, ((1 - p.y) / 2) * size.height];
  };

  const handleOver = (e) => {
    e.stopPropagation();
    if (useBootStore.getState().phase === "landing") useBedroomStore.getState().setHovered("guide");
  };
  const handleOut = () => {
    if (useBedroomStore.getState().hovered === "guide") useBedroomStore.getState().setHovered(null);
  };
  const handleClick = (e) => {
    e.stopPropagation();
    if (useBootStore.getState().phase === "landing" && e.delta <= CLICK_THRESHOLD) wave(1.8);
  };

  return (
    <group ref={root} position={SHELF.toArray()} rotation={[0, SHELF_YAW, 0]}>
      <group scale={SCALE} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <Robot liveRef={liveRef} />
      </group>

      {line !== null && phase === "landing" && (
        <Html position={BUBBLE_AT} calculatePosition={placeBubble} zIndexRange={[19, 0]} style={{ pointerEvents: "none" }}>
          <div
            ref={(el) => {
              bubbleRef.current = el;
              el?.classList.toggle("docked", !inView.current);
            }}
            className="guide-bubble"
          >
            <span className="guide-avatar" aria-hidden="true" />
            <p key={line} aria-live="polite">
              <Typed text={GREETING[line]} />
            </p>
          </div>
        </Html>
      )}
    </group>
  );
};

export default Guide;
