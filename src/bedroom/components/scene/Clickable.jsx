import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import useBedroomStore from "../../store/useBedroomStore";
import { getItem } from "../../data/items";
import { reducedMotion } from "../../utils/motion";
import { canInteract, isDrag } from "../../utils/pointer";

// Wraps one portfolio object in the room: places it at its spot, floats a
// pulsing marker above it so visitors can tell it's clickable, outlines it
// and shows its label on hover, and focuses it on click (not on drag).
const Clickable = ({ id, children }) => {
  const { label, spot, marker, quiet } = getItem(id);
  const hovered = useBedroomStore((s) => s.hovered === id);
  const focused = useBedroomStore((s) => s.focused);
  const markerRef = useRef(null);

  useFrame(({ clock }) => {
    const m = markerRef.current;
    if (!m) return;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 3 + marker[0] * 5) * 0.25;
    m.scale.setScalar(pulse);
  });

  const handleOver = (e) => {
    e.stopPropagation();
    if (!canInteract()) return;
    useBedroomStore.getState().setHovered(id);
  };
  const handleOut = () => {
    if (useBedroomStore.getState().hovered === id) useBedroomStore.getState().setHovered(null);
  };
  const handleClick = (e) => {
    e.stopPropagation();
    if (!canInteract() || isDrag(e)) return;
    if (useBedroomStore.getState().focused !== id) useBedroomStore.getState().focus(id);
  };

  return (
    <>
      <group
        position={spot.position}
        rotation={spot.rotation}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        {/* No outline once focused: the object is the whole view then. */}
        <Select enabled={hovered && focused !== id}>{children}</Select>
      </group>

      {!focused && !quiet && (
        <mesh ref={markerRef} position={marker} raycast={() => null}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color={[0.9, 2.2, 3]} toneMapped={false} />
        </mesh>
      )}

      {hovered && focused !== id && !quiet && (
        <Html position={[marker[0], marker[1] + 0.08, marker[2]]} center style={{ pointerEvents: "none" }}>
          <div className="bedroom-label">{label}</div>
        </Html>
      )}
    </>
  );
};

export default Clickable;
