import { useEffect, useMemo } from "react";
import * as THREE from "three";

const DOOR = "#33284e";
const TRIM = "#261d3b";
const BRASS = "#c9a25e";

// "Do not disturb" style sign: rounded card with a little moon.
const signTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f1e3cf";
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 240, 36);
  ctx.fill();
  ctx.strokeStyle = "#2a2340";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(24, 24, 464, 208, 26);
  ctx.stroke();

  // Crescent moon
  ctx.fillStyle = "#e8a54b";
  ctx.beginPath();
  ctx.arc(110, 128, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f1e3cf";
  ctx.beginPath();
  ctx.arc(130, 112, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2a2340";
  ctx.textBaseline = "middle";
  ctx.font = "bold 46px Georgia, serif";
  ctx.fillText("Coding…", 182, 104);
  ctx.font = "26px 'Roboto Mono', monospace";
  ctx.fillText("do not disturb", 184, 160);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
};

// Door on the wall behind the visitor, seen from inside the room (its face
// points to -z): a frame, two recessed panels, a brass lever handle and a
// sign hanging from a nail. Local: x along the wall (+x is the visitor's left
// when facing the door), y up from the floor.
const Door = () => {
  const sign = useMemo(() => signTexture(), []);
  useEffect(() => () => sign.dispose(), [sign]);

  return (
    <group position={[-1.3, 0, 2.48]}>
      {/* Frame + slab */}
      {[
        [-0.48, 1.02, 0.06, 2.08],
        [0.48, 1.02, 0.06, 2.08],
        [0, 2.04, 1.02, 0.06],
      ].map(([x, y, w, h]) => (
        <mesh key={`${x}${y}`} position={[x, y, -0.005]}>
          <boxGeometry args={[w, h, 0.05]} />
          <meshStandardMaterial color={TRIM} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.9, 2.0, 0.04]} />
        <meshStandardMaterial color={DOOR} roughness={0.7} />
      </mesh>

      {/* Recessed panels (a raised moulding outline on each) */}
      {[
        [1.45, 0.62],
        [0.6, 0.78],
      ].map(([y, h]) =>
        [
          [0, h / 2, 0.62, 0.02],
          [0, -h / 2, 0.62, 0.02],
          [-0.3, 0, 0.02, h],
          [0.3, 0, 0.02, h],
        ].map(([x, dy, w, hh]) => (
          <mesh key={`${y}-${x}-${dy}`} position={[x, y + dy, -0.024]}>
            <boxGeometry args={[w, hh, 0.012]} />
            <meshStandardMaterial color={TRIM} roughness={0.65} />
          </mesh>
        )),
      )}

      {/* Lever handle on a round rose, plus a keyhole plate below */}
      <group position={[-0.36, 0.98, -0.022]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.01, 24]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.05, 12]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0.055, 0, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.009, 0.1, 4, 10]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.11, 0]}>
          <boxGeometry args={[0.03, 0.07, 0.006]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.11, -0.0035]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.005, 12]} />
          <meshBasicMaterial color="#0b0915" />
        </mesh>
      </group>

      {/* Sign hanging from a nail on a string */}
      <mesh position={[0, 1.88, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.02, 8]} />
        <meshStandardMaterial color="#c9c9d1" metalness={0.7} roughness={0.3} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.06, 1.835, -0.03]} rotation={[0, 0, side * 0.95]}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.13, 4]} />
          <meshStandardMaterial color="#2a2340" />
        </mesh>
      ))}
      <mesh position={[0, 1.71, -0.032]} rotation={[0, Math.PI, 0.03]}>
        <planeGeometry args={[0.3, 0.15]} />
        <meshStandardMaterial map={sign} transparent roughness={0.9} />
      </mesh>
    </group>
  );
};

export default Door;
