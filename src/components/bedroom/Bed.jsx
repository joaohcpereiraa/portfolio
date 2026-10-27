import { RoundedBox } from "@react-three/drei";

const FRAME = "#2f2547";
const HEADBOARD = "#463a75";
const SHEET = "#cfc8f0";
const DUVET = "#5a4fb0";
const PILLOW = "#e6e3f7";

// Bed in the back-left corner, kept to a few soft shapes: frame, padded
// headboard, mattress, duvet with its top folded back, two pillows. Local: x
// across the bed, -z toward the headboard, y 0 = floor. The duvet's top sits
// at y 0.555, where the phone lies (see items.js).
const BedBody = () => (
  <group>
    <RoundedBox args={[1.42, 0.24, 2.02]} radius={0.04} position={[0, 0.14, 0]}>
      <meshStandardMaterial color={FRAME} roughness={0.75} />
    </RoundedBox>
    <RoundedBox args={[1.46, 0.62, 0.1]} radius={0.05} smoothness={5} position={[0, 0.62, -0.97]}>
      <meshStandardMaterial color={HEADBOARD} roughness={0.95} />
    </RoundedBox>

    <RoundedBox args={[1.34, 0.18, 1.94]} radius={0.06} smoothness={5} position={[0, 0.35, 0.01]}>
      <meshStandardMaterial color={SHEET} roughness={0.95} />
    </RoundedBox>

    {[-0.32, 0.32].map((x) => (
      <RoundedBox key={x} args={[0.5, 0.12, 0.3]} radius={0.055} smoothness={6} position={[x, 0.5, -0.72]}>
        <meshStandardMaterial color={PILLOW} roughness={1} />
      </RoundedBox>
    ))}

    <RoundedBox args={[1.42, 0.2, 1.36]} radius={0.07} smoothness={6} position={[0, 0.455, 0.32]}>
      <meshStandardMaterial color={DUVET} roughness={1} />
    </RoundedBox>
    <RoundedBox args={[1.43, 0.06, 0.22]} radius={0.03} smoothness={5} position={[0, 0.535, -0.27]}>
      <meshStandardMaterial color={SHEET} roughness={1} />
    </RoundedBox>
  </group>
);

// Floating shelf above the headboard with a few cozy things on it. Local: x
// along the shelf, +z into the room, y 0 = top of the plank.
const SHELF_WOOD = "#4a3562";
const BOOKS = [
  { w: 0.03, h: 0.2, color: "#5b4f9e" },
  { w: 0.026, h: 0.17, color: "#a8573a" },
  { w: 0.034, h: 0.21, color: "#2f6f68" },
  { w: 0.024, h: 0.18, color: "#b9a37a" },
  { w: 0.03, h: 0.19, color: "#3f5f9e" },
];
const STEMS = [-0.25, 0.05, 0.3];

const Books = () => {
  let x = -0.5;
  return BOOKS.map(({ w, h, color }, i) => {
    const last = i === BOOKS.length - 1;
    const pos = [x + w / 2 + (last ? 0.035 : 0), h / 2 - (last ? 0.012 : 0), 0];
    x += w + 0.002;
    return (
      <mesh key={color} position={pos} rotation={[0, 0, last ? -0.28 : 0]}>
        <boxGeometry args={[w, h, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    );
  });
};

const TrailingPlant = () => (
  <group>
    <mesh position={[0, 0.04, 0]}>
      <cylinderGeometry args={[0.045, 0.036, 0.08, 16]} />
      <meshStandardMaterial color="#d8d2c4" roughness={0.8} />
    </mesh>
    {[
      [0, 0.1, 0, 0.045],
      [-0.03, 0.09, 0.03, 0.035],
      [0.035, 0.085, 0.02, 0.035],
    ].map(([x, y, z, r]) => (
      <mesh key={r + x} position={[x, y, z]}>
        <sphereGeometry args={[r, 12, 10]} />
        <meshStandardMaterial color="#3f7d58" roughness={0.9} />
      </mesh>
    ))}
    {/* Vines spilling over the front edge */}
    {[-0.025, 0.03].map((x, i) =>
      [0, 1, 2, 3].map((k) => (
        <mesh key={x * 10 + k} position={[x + (k % 2) * 0.008, 0.05 - k * 0.045 - i * 0.02, 0.06 + Math.min(k, 1) * 0.02]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#4b8f66" roughness={0.9} />
        </mesh>
      )),
    )}
  </group>
);

const CandleStack = () => (
  <group>
    <mesh position={[0, 0.0125, 0]} rotation={[0, 0.15, 0]}>
      <boxGeometry args={[0.17, 0.025, 0.12]} />
      <meshStandardMaterial color="#7b6fb8" roughness={0.85} />
    </mesh>
    <mesh position={[0.01, 0.0425, 0]} rotation={[0, -0.1, 0]}>
      <boxGeometry args={[0.15, 0.035, 0.11]} />
      <meshStandardMaterial color="#b9a37a" roughness={0.85} />
    </mesh>
    {/* Candle in a glass jar */}
    <mesh position={[0, 0.095, 0]}>
      <cylinderGeometry args={[0.03, 0.03, 0.07, 16]} />
      <meshStandardMaterial color="#f3e6cf" roughness={0.6} emissive="#ffb46b" emissiveIntensity={0.35} />
    </mesh>
    <mesh position={[0, 0.137, 0]}>
      <sphereGeometry args={[0.008, 8, 8]} />
      <meshBasicMaterial color={[3, 1.9, 0.9]} toneMapped={false} />
    </mesh>
    <pointLight position={[0, 0.16, 0.08]} intensity={1.2} distance={2.2} color="#ffb46b" />
  </group>
);

const LeaningFrame = () => (
  <group rotation={[-0.12, 0, 0]}>
    <mesh position={[0, 0.08, 0]}>
      <boxGeometry args={[0.13, 0.16, 0.012]} />
      <meshStandardMaterial color="#1b1730" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.08, 0.0065]}>
      <planeGeometry args={[0.1, 0.13]} />
      <meshStandardMaterial color="#8f86d0" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.06, 0.007]}>
      <circleGeometry args={[0.025, 20]} />
      <meshStandardMaterial color="#e8b07a" roughness={0.9} />
    </mesh>
  </group>
);

const Vase = () => (
  <group>
    <mesh position={[0, 0.055, 0]}>
      <sphereGeometry args={[0.045, 16, 12]} />
      <meshStandardMaterial color="#cfc8f0" roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.11, 0]}>
      <cylinderGeometry args={[0.014, 0.02, 0.04, 12]} />
      <meshStandardMaterial color="#cfc8f0" roughness={0.5} />
    </mesh>
    {STEMS.map((tilt) => (
      <group key={tilt} position={[0, 0.12, 0]} rotation={[0, 0, tilt]}>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.002, 0.002, 0.14, 4]} />
          <meshStandardMaterial color="#a08b6a" />
        </mesh>
        <mesh position={[0, 0.145, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#d9b98a" roughness={1} />
        </mesh>
      </group>
    ))}
  </group>
);

const WallShelf = () => (
  <group position={[-1.65, 1.5, -2.39]}>
    <mesh position={[0, -0.015, 0]}>
      <boxGeometry args={[1.12, 0.03, 0.2]} />
      <meshStandardMaterial color={SHELF_WOOD} roughness={0.7} />
    </mesh>
    {[-0.42, 0.42].map((x) => (
      <mesh key={x} position={[x, -0.06, -0.07]}>
        <boxGeometry args={[0.02, 0.06, 0.06]} />
        <meshStandardMaterial color="#2a1f3d" roughness={0.6} />
      </mesh>
    ))}

    <Books />
    <group position={[-0.17, 0, 0.01]}>
      <TrailingPlant />
    </group>
    <group position={[0.06, 0, 0]}>
      <CandleStack />
    </group>
    <group position={[0.27, 0, -0.04]}>
      <LeaningFrame />
    </group>
    <group position={[0.44, 0, 0]}>
      <Vase />
    </group>
  </group>
);

const Bed = () => (
  <>
    <group position={[-1.8, 0, -1.5]}>
      <BedBody />
    </group>
    <WallShelf />
  </>
);

export default Bed;
