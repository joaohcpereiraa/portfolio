import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { careerTimeline } from "#constants";
import useBedroomStore from "#store/bedroom";
import { reducedMotion } from "../motion";

const { damp } = THREE.MathUtils;

const NOTE_COLOR = { work: "#ffd166", education: "#7dd3fc" };
const NOTE_W = 0.22;
const NOTE_H = 0.19;
const SPAN_X = 0.4; // notes run from -SPAN_X to +SPAN_X across the board
const ROW_Y = 0.15; // zig-zag: even notes on the top row, odd on the bottom
const LIFT = 0.035;
// A picked note is unpinned and flies to the middle of the board, toward the
// viewer, fading as it arrives; the DOM card (TimelineCard) unfolds there.
const TAKE_Z = 0.35;
const TAKE_SCALE = 1.6;
const TAKE_SPEED = 7;
const PIN_Y = NOTE_H / 2 - 0.015; // pin offset from the note's centre
const PIN_Z = 0.034; // where the string wraps round the pin, just above the paper

// Zig-zag layout in date order, so the red string reads left to right.
const layout = (count) =>
  Array.from({ length: count }, (_, i) => ({
    x: count === 1 ? 0 : -SPAN_X + (i * SPAN_X * 2) / (count - 1),
    y: i % 2 === 0 ? ROW_Y : -ROW_Y,
    tilt: (((i * 53) % 9) - 4) * 0.018,
  }));

// "Sep 2022 — Jun 2025" → "2022"; "2026 — 2028 (expected)" → "2026".
const startYear = (period) => period.match(/\d{4}/)?.[0] ?? "";

// "ISEP — Instituto Superior…" → "ISEP".
const shortPlace = (place) => place.split(" — ")[0];

// Word-wraps `text` into at most `maxLines` lines that fit `width`.
const wrap = (ctx, text, width, maxLines) => {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s+\S*$/, "")}…`;
  }
  return lines;
};

// Paper texture for one note: year, short title, place, scribbled by hand.
const noteTexture = (entry) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = Math.round((512 * NOTE_H) / NOTE_W);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = NOTE_COLOR[entry.type] ?? "#e5e7eb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#2a2340";
  ctx.font = "bold 92px Georgia, serif";
  ctx.fillText(startYear(entry.period), 36, 130);
  ctx.font = "600 44px system-ui, sans-serif";
  wrap(ctx, entry.title.split(" · ")[0], canvas.width - 72, 3).forEach((l, i) => {
    ctx.fillText(l, 36, 200 + i * 52);
  });
  ctx.font = "38px system-ui, sans-serif";
  ctx.fillStyle = "rgba(42,35,64,0.7)";
  ctx.fillText(shortPlace(entry.place), 36, canvas.height - 34);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
};

// A note that's away (faded out in front of the board) must not catch the
// pointer, or it would swallow clicks meant for the cork behind it.
function raycastWhenVisible(raycaster, hits) {
  if (this.parent?.visible) THREE.Mesh.prototype.raycast.call(this, raycaster, hits);
}

const Note = ({ entry, index, pos }) => {
  const groupRef = useRef(null);
  const matRef = useRef(null);
  const hoverRef = useRef(false);
  const texture = useMemo(() => noteTexture(entry), [entry]);

  useEffect(() => () => texture.dispose(), [texture]);

  // Hover lifts a note off the cork. The selected note is unpinned: it
  // straightens and flies to the centre, where the unfolding card takes over;
  // when another note is picked it drifts back to its pin.
  useFrame((_, dt) => {
    const { focused, takenIndex } = useBedroomStore.getState();
    const selected = focused === "timeline" && takenIndex === index;
    const g = groupRef.current;
    const mat = matRef.current;
    const to = selected
      ? { x: -pos.x, y: -pos.y, z: TAKE_Z, rot: -pos.tilt, scale: TAKE_SCALE, opacity: 0 }
      : { x: 0, y: 0, z: hoverRef.current ? LIFT : 0, rot: 0, scale: 1, opacity: 1 };
    const k = (from, target, speed = TAKE_SPEED) =>
      reducedMotion ? target : damp(from, target, speed, dt);

    g.position.x = k(g.position.x, to.x);
    g.position.y = k(g.position.y, to.y);
    g.position.z = k(g.position.z, to.z, selected ? TAKE_SPEED : 12);
    g.rotation.z = k(g.rotation.z, to.rot);
    g.scale.setScalar(k(g.scale.x, to.scale));
    // Hidden the moment it's picked (the card takes over, no ghost behind
    // it); put back, it fades in as it flies home to its pin.
    mat.opacity = selected ? 0 : k(mat.opacity, to.opacity);
    g.visible = mat.opacity > 0.01;
  });

  const isTaken = () => {
    const { focused, takenIndex } = useBedroomStore.getState();
    return focused === "timeline" && takenIndex === index;
  };

  const handleOver = () => {
    if (useBedroomStore.getState().focused === "timeline" && !isTaken()) hoverRef.current = true;
  };
  const handleOut = () => {
    hoverRef.current = false;
  };
  // Once the board is open, clicking a note jumps the story to it. Before
  // that, the click bubbles to the board's Clickable, which opens it.
  const handleClick = (e) => {
    const { focused, setNoteIndex } = useBedroomStore.getState();
    if (focused !== "timeline" || e.delta > 6 || isTaken()) return;
    e.stopPropagation();
    setNoteIndex(index);
  };

  return (
    <group position={[pos.x, pos.y, 0.017]} rotation={[0, 0, pos.tilt]}>
      <group ref={groupRef} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <mesh raycast={raycastWhenVisible}>
          <planeGeometry args={[NOTE_W, NOTE_H]} />
          <meshStandardMaterial ref={matRef} map={texture} roughness={1} transparent />
        </mesh>
      </group>
      {/* Push pin: needle into the cork + glossy head */}
      <mesh position={[0, PIN_Y, 0.008]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0018, 0.0018, 0.02, 6]} />
        <meshStandardMaterial color="#c9c9d1" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, PIN_Y, 0.02]}>
        <sphereGeometry args={[0.012, 16, 12]} />
        <meshStandardMaterial color="#e5484d" roughness={0.25} />
      </mesh>
    </group>
  );
};

// Red yarn between two pins: a thin tube that sags a little under its own
// weight, like string pulled across a real board.
const stringGeometry = (a, b) => {
  const mid = a.clone().lerp(b, 0.5);
  mid.y -= a.distanceTo(b) * 0.12;
  mid.z += 0.004;
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  return new THREE.TubeGeometry(curve, 32, 0.0022, 6, false);
};

// Where a note's pin sits on the board (the note is tilted around its centre).
const pinPoint = ({ x, y, tilt }) =>
  new THREE.Vector3(x - Math.sin(tilt) * PIN_Y, y + Math.cos(tilt) * PIN_Y, PIN_Z);

const RedString = ({ positions }) => {
  const geometries = useMemo(() => {
    const pins = positions.map(pinPoint);
    return pins.slice(1).map((b, i) => stringGeometry(pins[i], b));
  }, [positions]);

  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  return geometries.map((g, i) => (
    <mesh key={i} geometry={g} raycast={() => null}>
      <meshStandardMaterial color="#b3122a" roughness={0.85} />
    </mesh>
  ));
};

// With the board open, clicking the cork or frame (anywhere but a note) folds
// the open note up and puts it back on its pin; the view stays on the board.
// Closed, the click bubbles up to the board's Clickable, which opens it.
const handleBoardClick = (e) => {
  const { focused, setNoteIndex } = useBedroomStore.getState();
  if (focused !== "timeline" || e.delta > 6) return;
  e.stopPropagation();
  setNoteIndex(null);
};

// Cork board above the desk: one note per career entry, joined pin to pin by
// a red string in date order. Local +z faces into the room.
const CorkBoard = () => {
  const positions = useMemo(() => layout(careerTimeline.length), []);

  return (
    <group>
      <group onClick={handleBoardClick}>
        <mesh>
          <boxGeometry args={[1.1, 0.75, 0.03]} />
          <meshStandardMaterial color="#8a6a52" roughness={1} />
        </mesh>
        {/* Frame */}
        {[
          [0, 0.39, 1.16, 0.04],
          [0, -0.39, 1.16, 0.04],
          [-0.57, 0, 0.04, 0.82],
          [0.57, 0, 0.04, 0.82],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.01]}>
            <boxGeometry args={[w, h, 0.05]} />
            <meshStandardMaterial color="#3a2c55" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {careerTimeline.map((entry, i) => (
        <Note key={entry.id} entry={entry} index={i} pos={positions[i]} />
      ))}

      <RedString positions={positions} />
    </group>
  );
};

export default CorkBoard;
