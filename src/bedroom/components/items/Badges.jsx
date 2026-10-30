import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { careerTimeline } from "#constants";
import { badgeColor, placeLogo, shortTitle } from "../../utils/badges";
import { reducedMotion } from "../../utils/motion";
import { yearRange } from "../../utils/period";
import usePickable from "../../hooks/usePickable";
import { isTaken } from "../../store/selectors";
import WallCatcher from "./WallCatcher";

const { damp } = THREE.MathUtils;

const BADGE_W = 0.2;
const BADGE_H = 0.3;
const GAP = 0.34; // hook to hook along the rail
const RAIL_Y = 0.33;
const HOOK_Y = RAIL_Y - 0.012; // where each lanyard hangs (the swing pivot)
const HOOK_Z = 0.05;
const STRAP_DROP = 0.2; // hook down to the badge clip
const STRAP_SPREAD = 0.04; // half the gap between the strap ends at the clip
const BADGE_Y = -STRAP_DROP - 0.012 - BADGE_H / 2; // badge centre below the hook

const SWAY = 0.025; // idle swing on the hook, radians
const LEAN = -0.22; // hover: the badge tips toward you
const TAKE_Z = 0.42; // how far in front of the wall a picked-up badge is held
const TAKE_SCALE = 1.3;
const UNHOOK_Y = 0.05; // lifted this far to clear the hook
const PICK_S = 0.8; // seconds from hook to hand
const RETURN_S = 0.65; // seconds from hand back to hook
// Over this slice of pick progress the 3D badge fades out as the DOM badge
// fades in on top of it (and back again on the way down), so the hand-off is
// a crossfade rather than a pop.
const FADE_FROM = 0.7;
const WOBBLE = 0.12; // swing when a badge is hung back on its hook

// 0..1 ease over the [a, b] slice of progress t.
const ease = (t, a, b) => {
  const x = Math.min(Math.max((t - a) / (b - a), 0), 1);
  return x * x * (3 - 2 * x);
};

const INK = "#1f1b33";

// Logos load once each and are shared by every badge from that place; each
// badge redraws once its logo has loaded.
const logos = new Map();
const loadLogo = (url) => {
  if (!logos.has(url)) {
    logos.set(
      url,
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      }),
    );
  }
  return logos.get(url);
};

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

// Badge front, kept to what reads at a glance: lanyard slot, a stripe in the
// place's colour, the place's logo, the role and the dates.
const badgeTexture = (entry) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = Math.round((512 * BADGE_H) / BADGE_W);
  const ctx = canvas.getContext("2d");
  const W = canvas.width;

  ctx.fillStyle = "#f8f7f3";
  ctx.fillRect(0, 0, W, canvas.height);
  ctx.fillStyle = "#c9c6bd";
  ctx.beginPath();
  ctx.roundRect(W / 2 - 50, 22, 100, 18, 9);
  ctx.fill();

  ctx.fillStyle = badgeColor(entry);
  ctx.fillRect(0, 56, W, 22);

  // Logo panel; the logo itself is drawn in (scaled to fit) once it loads.
  const logoBox = { x: 36, y: 112, w: W - 72, h: 260, pad: 26 };
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#e2dfd6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(logoBox.x, logoBox.y, logoBox.w, logoBox.h, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.font = "bold 40px system-ui, sans-serif";
  wrap(ctx, shortTitle(entry.title), W - 72, 2).forEach((l, i) => {
    ctx.fillText(l, W / 2, 448 + i * 48);
  });

  // Dates, set apart by size alone under a hairline: the years big, the exact
  // months under them.
  ctx.fillStyle = "rgba(31,27,51,0.12)";
  ctx.fillRect(56, 548, W - 112, 2);
  ctx.fillStyle = INK;
  ctx.font = "bold 76px Georgia, serif";
  ctx.fillText(yearRange(entry.period), W / 2, 636);
  ctx.font = "bold 32px system-ui, sans-serif";
  ctx.fillStyle = "rgba(31,27,51,0.75)";
  ctx.fillText(entry.period.replace(/\s+[—–-]\s+/, " → "), W / 2, 694, W - 112);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const logo = placeLogo(entry);
  if (logo) {
    loadLogo(logo).then((img) => {
      if (!img) return;
      const maxW = logoBox.w - logoBox.pad * 2;
      const maxH = logoBox.h - logoBox.pad * 2;
      const s = Math.min(maxW / img.width, maxH / img.height);
      const w = img.width * s;
      const h = img.height * s;
      ctx.drawImage(img, logoBox.x + (logoBox.w - w) / 2, logoBox.y + (logoBox.h - h) / 2, w, h);
      tex.needsUpdate = true;
    });
  }
  return tex;
};

// Two straps from the hook down to the clip, in a narrow V.
const Lanyard = ({ color }) => {
  const len = Math.hypot(STRAP_SPREAD, STRAP_DROP);
  const angle = Math.atan2(STRAP_SPREAD, STRAP_DROP);
  return (
    <>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * STRAP_SPREAD) / 2, -STRAP_DROP / 2, 0]} rotation={[0, 0, side * angle]}>
          <boxGeometry args={[0.016, len, 0.002]} />
          <meshStandardMaterial color={color} roughness={0.8} transparent />
        </mesh>
      ))}
      {/* Metal clip */}
      <mesh position={[0, -STRAP_DROP - 0.004, 0.001]}>
        <boxGeometry args={[0.03, 0.022, 0.006]} />
        <meshStandardMaterial color="#c9c9d1" metalness={0.8} roughness={0.3} transparent />
      </mesh>
    </>
  );
};

// One badge on its hook. It sways a little; hover tips it toward you. Picked
// up, it lifts off the hook, then swings over to you on its lanyard (tipping
// toward you and leaning into the sideways pull) and is held up facing you,
// where the DOM badge card takes over. Put back, it travels the same path in
// reverse and wobbles on its hook before settling.
const Badge = ({ entry, index, x }) => {
  const groupRef = useRef(null);
  const { hoverRef, handlers } = usePickable("experience", index);
  const pickRef = useRef(0); // 0 = on the hook, 1 = held in front of you
  const wobbleRef = useRef(null); // clock time the badge was hung back
  const leanRef = useRef(0);
  const texture = useMemo(() => badgeTexture(entry), [entry]);
  const color = badgeColor(entry);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }, dt) => {
    const g = groupRef.current;
    const selected = isTaken("experience", index);

    const was = pickRef.current;
    const p = reducedMotion
      ? Number(selected)
      : Math.min(Math.max(was + (selected ? dt / PICK_S : -dt / RETURN_S), 0), 1);
    pickRef.current = p;
    const t = clock.elapsedTime;
    if (was > 0 && p === 0 && !reducedMotion) wobbleRef.current = t;

    const lift = ease(p, 0, 0.3); // up off the hook
    const fly = ease(p, 0.2, 1); // over to you
    const arc = Math.sin(Math.PI * fly); // 0 at both ends, 1 mid-flight
    // The wobble starts from rest (sin(0) = 0) the moment it's hung back and
    // dies away, so landing on the hook never jerks it sideways.
    const since = wobbleRef.current === null ? Infinity : t - wobbleRef.current;
    const wobble = since < 4 ? Math.sin(since * 5) * WOBBLE * Math.exp(-1.8 * since) : 0;
    const sway = reducedMotion ? 0 : Math.sin(t * 1.3 + index * 1.7) * SWAY + wobble;
    const lean = hoverRef.current && p === 0 ? LEAN : 0;

    g.position.set(-x * fly, UNHOOK_Y * lift * (1 - fly), 0.03 * lift + (TAKE_Z - 0.03) * fly);
    leanRef.current = reducedMotion ? lean : damp(leanRef.current, lean, 8, dt);
    g.rotation.x = leanRef.current - 0.45 * arc;
    // Lean into the sideways pull: a badge left of centre trails to the left.
    g.rotation.z = sway * (1 - lift) + Math.sign(x) * 0.22 * arc;
    g.scale.setScalar(1 + (TAKE_SCALE - 1) * fly);

    const opacity = 1 - ease(p, FADE_FROM, 1);
    g.visible = opacity > 0.01;
    g.traverse((o) => {
      if (o.material) o.material.opacity = opacity;
    });
  });

  return (
    <group position={[x, HOOK_Y, HOOK_Z]}>
      <group ref={groupRef} {...handlers}>
        <Lanyard color={color} />
        <RoundedBox args={[BADGE_W, BADGE_H, 0.006]} radius={0.012} position={[0, BADGE_Y, 0]}>
          <meshStandardMaterial color="#f8f7f3" roughness={0.5} transparent />
        </RoundedBox>
        <mesh position={[0, BADGE_Y, 0.0035]}>
          <planeGeometry args={[BADGE_W - 0.008, BADGE_H - 0.008]} />
          <meshStandardMaterial map={texture} roughness={0.45} transparent />
        </mesh>
      </group>
    </group>
  );
};

// Wooden peg rail with one hook per badge.
const Rail = ({ xs }) => (
  <group position={[0, RAIL_Y, 0]}>
    <RoundedBox args={[GAP * xs.length + 0.12, 0.06, 0.03]} radius={0.008} position={[0, 0, 0.015]}>
      <meshStandardMaterial color="#6b4a33" roughness={0.8} />
    </RoundedBox>
    {xs.map((x) => (
      <group key={x} position={[x, -0.01, 0.03]}>
        <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
          <meshStandardMaterial color="#b9b9c4" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.006, 0.026]}>
          <cylinderGeometry args={[0.005, 0.005, 0.016, 8]} />
          <meshStandardMaterial color="#b9b9c4" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    ))}
  </group>
);

// One lanyard + ID badge per career entry, in date order, hanging from a peg
// rail on the wall above the desk. Local +z faces into the room.
const Badges = () => {
  const xs = careerTimeline.map((_, i) => (i - (careerTimeline.length - 1) / 2) * GAP);
  return (
    <group>
      <WallCatcher focusId="experience" width={GAP * careerTimeline.length + 0.6} height={1} z={0.005} />
      <Rail xs={xs} />
      {careerTimeline.map((entry, i) => (
        <Badge key={entry.id} entry={entry} index={i} x={xs[i]} />
      ))}
    </group>
  );
};

export default Badges;
