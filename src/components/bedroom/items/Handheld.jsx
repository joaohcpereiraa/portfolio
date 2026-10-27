import { RoundedBox } from "@react-three/drei";

const BODY = "#2b2350";
const TRIM = "#171330";

// Little pixel "sprites" on the lit screen, so it reads as a game from afar.
const PIXELS = [
  [-0.022, -0.008, [2.6, 1.7, 0.5]],
  [-0.008, -0.008, [0.6, 1.8, 2.6]],
  [0.006, -0.008, [2.4, 0.6, 1.8]],
  [-0.022, 0.006, [0.6, 2.2, 1.0]],
  [-0.008, 0.006, [1.5, 0.9, 2.8]],
];

// A retro handheld console lying face-up on the window sill, screen on. Landscape:
// local x runs along its width, -z is the top edge, y 0 = sill surface.
const Handheld = () => (
  <group>
    <RoundedBox args={[0.17, 0.022, 0.082]} radius={0.01} position={[0, 0.011, 0]}>
      <meshStandardMaterial color={BODY} roughness={0.55} />
    </RoundedBox>

    {/* Screen bezel + glowing screen */}
    <mesh position={[0, 0.0222, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.078, 0.058]} />
      <meshStandardMaterial color={TRIM} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.0224, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.066, 0.046]} />
      <meshBasicMaterial color={[0.25, 0.22, 0.75]} toneMapped={false} />
    </mesh>
    {PIXELS.map(([x, z, color], i) => (
      <mesh key={i} position={[x, 0.0226, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.01, 0.01]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    ))}

    {/* D-pad */}
    <mesh position={[-0.06, 0.024, 0.004]}>
      <boxGeometry args={[0.03, 0.005, 0.009]} />
      <meshStandardMaterial color={TRIM} />
    </mesh>
    <mesh position={[-0.06, 0.024, 0.004]}>
      <boxGeometry args={[0.009, 0.005, 0.03]} />
      <meshStandardMaterial color={TRIM} />
    </mesh>

    {/* A / B buttons */}
    {[
      [0.068, -0.004, "#ff5d8f"],
      [0.052, 0.012, "#ffd166"],
    ].map(([x, z, color]) => (
      <mesh key={color} position={[x, 0.024, z]}>
        <cylinderGeometry args={[0.0075, 0.0075, 0.005, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    ))}

    <pointLight position={[0, 0.08, 0]} intensity={0.2} distance={0.5} color="#8c7cff" />
  </group>
);

export default Handheld;
