import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { reducedMotion } from "../../utils/motion";

const LAVA = [2.8, 0.6, 1.6]; // bloom picks up values above 1
const SLEEVES = ["#e76f51", "#2a9d8f", "#f4a261", "#6d5bd0"];

// Lava lamp: wax blobs drifting up and down inside a glowing glass.
const LavaLamp = () => {
  const blobs = useRef([]);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.elapsedTime;
    blobs.current.forEach((b, i) => {
      if (b) b.position.y = 0.13 + Math.sin(t * 0.35 + i * 2.1) * 0.055;
    });
  });

  return (
    <group>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.025, 0.045, 0.08, 20]} />
        <meshStandardMaterial color="#2b2545" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.018, 0.03, 0.12, 20]} />
        <meshStandardMaterial color="#3a1640" emissive={[0.9, 0.2, 0.6]} transparent opacity={0.75} />
      </mesh>
      {[0.012, 0.009, 0.01].map((r, i) => (
        <mesh key={i} ref={(m) => (blobs.current[i] = m)} position={[(i - 1) * 0.006, 0.13, 0]}>
          <sphereGeometry args={[r, 12, 12]} />
          <meshBasicMaterial color={LAVA} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.215, 0]}>
        <cylinderGeometry args={[0.012, 0.018, 0.03, 20]} />
        <meshStandardMaterial color="#2b2545" metalness={0.6} roughness={0.35} />
      </mesh>
      <pointLight position={[0, 0.15, 0.06]} intensity={0.5} distance={0.9} color="#ff6fb0" />
    </group>
  );
};

// Bookshelf speaker facing into the room (+z), with a little power LED.
const Speaker = () => (
  <group>
    <RoundedBox args={[0.1, 0.16, 0.09]} radius={0.008} position={[0, 0.08, 0]}>
      <meshStandardMaterial color="#1b1730" roughness={0.6} />
    </RoundedBox>
    {[
      [0.05, 0.034],
      [0.115, 0.016],
    ].map(([y, r]) => (
      <mesh key={y} position={[0, y, 0.0455]}>
        <circleGeometry args={[r, 24]} />
        <meshStandardMaterial color="#0b0915" roughness={0.9} />
      </mesh>
    ))}
    <mesh position={[0.035, 0.145, 0.0455]}>
      <circleGeometry args={[0.003, 8]} />
      <meshBasicMaterial color={[0.5, 2.6, 1.6]} toneMapped={false} />
    </mesh>
  </group>
);

// Small cactus in a terracotta pot, with one arm.
const Cactus = () => (
  <group>
    <mesh position={[0, 0.035, 0]}>
      <cylinderGeometry args={[0.04, 0.032, 0.07, 16]} />
      <meshStandardMaterial color="#b5653f" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.115, 0]}>
      <capsuleGeometry args={[0.024, 0.08, 6, 12]} />
      <meshStandardMaterial color="#3f8f5a" roughness={0.8} />
    </mesh>
    <mesh position={[0.03, 0.13, 0]} rotation={[0, 0, -0.5]}>
      <capsuleGeometry args={[0.012, 0.03, 4, 10]} />
      <meshStandardMaterial color="#3f8f5a" roughness={0.8} />
    </mesh>
  </group>
);

// A few record sleeves standing in a row, the last one leaning over.
const Records = () => (
  <group>
    {SLEEVES.map((color, i) => (
      <mesh
        key={color}
        position={[i * 0.014 + (i === 3 ? 0.03 : 0), 0.1, 0]}
        rotation={[0, 0, i === 3 ? -0.3 : 0]}
      >
        <boxGeometry args={[0.006, 0.2, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    ))}
  </group>
);

// Cozy clutter on the lower shelf plank, purely for mood. Local x runs along
// the plank, +z faces into the room, y 0 = plank top.
const ShelfDecor = () => (
  <group>
    <group position={[-0.36, 0, 0]}>
      <Cactus />
    </group>
    <group position={[-0.16, 0, 0.01]}>
      <LavaLamp />
    </group>
    <group position={[0.06, 0, -0.01]} rotation={[0, -0.25, 0]}>
      <Speaker />
    </group>
    <group position={[0.27, 0, 0]}>
      <Records />
    </group>
  </group>
);

export default ShelfDecor;
