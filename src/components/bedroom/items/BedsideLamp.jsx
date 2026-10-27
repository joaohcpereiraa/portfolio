import { useState } from "react";
import * as THREE from "three";
import useBootStore from "#store/boot";
import useBedroomStore from "#store/bedroom";

const CLICK_THRESHOLD = 6; // px of movement below which a press counts as a click
const BULB_ON = [3, 1.9, 0.9];
const BULB_OFF = [0.3, 0.27, 0.22]; // unlit glass

// Small bedside lamp on the nightstand: a round ceramic base, a thin brass
// stem and a fabric drum shade lit warm from inside. Click it to switch it
// off and on (not a portfolio item, so no marker or focus). y 0 = nightstand top.
const BedsideLamp = () => {
  const [on, setOn] = useState(false); // starts off; the visitor can switch it on

  const canInteract = () => useBootStore.getState().phase === "landing";

  const handleOver = (e) => {
    e.stopPropagation();
    if (canInteract()) useBedroomStore.getState().setHovered("lamp");
  };
  const handleOut = () => {
    if (useBedroomStore.getState().hovered === "lamp") useBedroomStore.getState().setHovered(null);
  };
  // Stop the click here so it doesn't reach the room (which would close
  // whatever is open).
  const handleClick = (e) => {
    e.stopPropagation();
    if (!canInteract() || e.delta > CLICK_THRESHOLD) return;
    setOn((v) => !v);
  };

  return (
    <group onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
      <mesh position={[0, 0.055, 0]}>
        <sphereGeometry args={[0.06, 20, 16]} />
        <meshStandardMaterial color="#cfc8f0" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.04, 0.045, 0.01, 20]} />
        <meshStandardMaterial color="#cfc8f0" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />
        <meshStandardMaterial color="#b8955a" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Shade: open drum, glowing softly; the bulb shows through underneath */}
      <mesh position={[0, 0.225, 0]}>
        <cylinderGeometry args={[0.075, 0.095, 0.11, 28, 1, true]} />
        <meshStandardMaterial
          color="#f1e3cf"
          emissive="#ffb46b"
          emissiveIntensity={on ? 0.55 : 0}
          roughness={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color={on ? BULB_ON : BULB_OFF} toneMapped={false} />
      </mesh>

      <pointLight position={[0, 0.2, 0.05]} intensity={on ? 1.4 : 0} distance={2.2} color="#ffb46b" />
    </group>
  );
};

export default BedsideLamp;
