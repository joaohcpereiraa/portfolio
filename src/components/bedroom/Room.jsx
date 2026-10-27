import { ROOM } from "./items";
import Rug from "./Rug";

const { half, height } = ROOM;

// Colours above 1 with toneMapped off are what the bloom pass picks up.
const PINK = [2.2, 0.8, 1.9];
const CYAN = [0.7, 1.8, 2.2];
const MOON = [2.2, 2.1, 1.7];

// Night sky seen through the window: a few fixed "random" stars.
const STARS = Array.from({ length: 26 }, (_, i) => [
  ((i * 37) % 100) / 100 - 0.5,
  ((i * 61) % 100) / 100 - 0.5,
]);

// Walls, floor, ceiling, the window with the moon, neon strips and lights.
const Room = () => {

  return (
    <group>
      {/* Floor + rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[half * 2, half * 2]} />
        <meshStandardMaterial color="#1d1733" roughness={0.85} />
      </mesh>
      <Rug />

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[half * 2, half * 2]} />
        <meshStandardMaterial color="#120f24" roughness={1} />
      </mesh>

      {/* Walls: back, front, left, right */}
      <mesh position={[0, height / 2, -half]}>
        <planeGeometry args={[half * 2, height]} />
        <meshStandardMaterial color="#251e47" roughness={0.95} />
      </mesh>
      <mesh position={[0, height / 2, half]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[half * 2, height]} />
        <meshStandardMaterial color="#1e1a3c" roughness={0.95} />
      </mesh>
      <mesh position={[-half, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[half * 2, height]} />
        <meshStandardMaterial color="#211b42" roughness={0.95} />
      </mesh>
      <mesh position={[half, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[half * 2, height]} />
        <meshStandardMaterial color="#211b42" roughness={0.95} />
      </mesh>

      {/* Window on the left wall, above the bed */}
      <group position={[-half + 0.01, 1.65, -1.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[1.1, 0.95]} />
          <meshBasicMaterial color="#0c1238" />
        </mesh>
        {STARS.map(([x, y], i) => (
          <mesh key={i} position={[x * 1.0, y * 0.85, 0.002]}>
            <circleGeometry args={[i % 3 === 0 ? 0.008 : 0.005, 6]} />
            <meshBasicMaterial color={[1.6, 1.6, 1.8]} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0.28, 0.22, 0.003]}>
          <circleGeometry args={[0.09, 32]} />
          <meshBasicMaterial color={MOON} toneMapped={false} />
        </mesh>
        {/* Frame + cross bars */}
        {[
          [0, 0.495, 1.18, 0.05],
          [0, -0.495, 1.18, 0.05],
          [-0.565, 0, 0.05, 1.04],
          [0.565, 0, 0.05, 1.04],
          [0, 0, 1.1, 0.03],
          [0, 0, 0.03, 0.95],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.02]}>
            <boxGeometry args={[w, h, 0.04]} />
            <meshStandardMaterial color="#3b3166" roughness={0.6} />
          </mesh>
        ))}
        {/* Sill */}
        <mesh position={[0, -0.53, 0.07]}>
          <boxGeometry args={[1.25, 0.04, 0.16]} />
          <meshStandardMaterial color="#3b3166" roughness={0.6} />
        </mesh>
      </group>

      {/* Neon strips along the top of the back and right walls */}
      <mesh position={[0, height - 0.18, -half + 0.03]}>
        <boxGeometry args={[half * 2 - 0.2, 0.025, 0.025]} />
        <meshBasicMaterial color={PINK} toneMapped={false} />
      </mesh>
      <mesh position={[half - 0.03, height - 0.18, 0]}>
        <boxGeometry args={[0.025, 0.025, half * 2 - 0.2]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>

      {/* Lighting: soft even fill, moonlight from the window, and gentle neon
          washes (kept low so the walls don't turn into a pink-to-blue gradient). */}
      <hemisphereLight args={["#57538f", "#15122a", 0.85]} />
      <directionalLight position={[-6, 3.5, -1.5]} intensity={0.7} color="#8fa3ff" />
      <pointLight position={[0, 2.35, -2.1]} intensity={3.5} distance={6} color="#e07fd0" />
      <pointLight position={[2.1, 2.35, 0.2]} intensity={2.6} distance={6} color="#6fbde6" />
    </group>
  );
};

export default Room;
