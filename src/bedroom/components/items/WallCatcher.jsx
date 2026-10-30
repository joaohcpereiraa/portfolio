import useBedroomStore from "../../store/useBedroomStore";
import { isDrag } from "../../utils/pointer";

// With a group of items open (posters, badges), clicking the wall around them
// puts the open one back; the view stays on the group. Only there while
// focused, so it never shows up in the hover outline.
const WallCatcher = ({ focusId, width, height, z = 0 }) => {
  const focused = useBedroomStore((s) => s.focused === focusId);
  if (!focused) return null;

  const handleClick = (e) => {
    if (isDrag(e)) return;
    e.stopPropagation();
    useBedroomStore.getState().setNoteIndex(null);
  };

  return (
    <mesh position={[0, 0, z]} onClick={handleClick}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
};

export default WallCatcher;
