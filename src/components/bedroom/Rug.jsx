const BASE = "#3a2d6a";
const BORDER = "#4a3d82";

const R = 1.1; // rug radius

// Round rug in the middle of the floor: a soft, slightly thick base with one
// subtle border band. y 0 = floor.
const Rug = () => (
  <group position={[0.2, 0, -0.5]}>
    <mesh position={[0, 0.006, 0]}>
      <cylinderGeometry args={[R, R + 0.01, 0.012, 96]} />
      <meshStandardMaterial color={BASE} roughness={1} />
    </mesh>
    <mesh position={[0, 0.0122, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[R - 0.16, R - 0.08, 96]} />
      <meshStandardMaterial color={BORDER} roughness={1} />
    </mesh>
  </group>
);

export default Rug;
