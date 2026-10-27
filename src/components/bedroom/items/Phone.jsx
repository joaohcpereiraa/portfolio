import { RoundedBox } from "@react-three/drei";

// App-icon dots on the glowing lock screen.
const DOTS = [
  [-0.018, 0.04, [2.4, 0.6, 1.8]],
  [0.018, 0.04, [0.5, 1.4, 2.6]],
  [-0.018, 0.0, [0.6, 2.2, 1.0]],
  [0.018, 0.0, [2.6, 1.6, 0.4]],
];

// Phone lying face-up on the bed, screen lit.
const Phone = () => (
  <group>
    <RoundedBox args={[0.075, 0.01, 0.155]} radius={0.004} position={[0, 0.005, 0]}>
      <meshStandardMaterial color="#14121f" roughness={0.3} metalness={0.4} />
    </RoundedBox>
    <mesh position={[0, 0.0105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.066, 0.142]} />
      <meshBasicMaterial color={[0.35, 0.45, 1.3]} toneMapped={false} />
    </mesh>
    {DOTS.map(([x, z, color], i) => (
      <mesh key={i} position={[x, 0.011, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.009, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    ))}
    <pointLight position={[0, 0.08, 0]} intensity={0.25} distance={0.6} color="#7c8cff" />
  </group>
);

export default Phone;
