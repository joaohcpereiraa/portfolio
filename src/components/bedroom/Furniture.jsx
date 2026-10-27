import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import Bed from "./Bed";
import Door from "./Door";

const WARM = [3, 1.9, 0.9];

const Wood = (props) => <meshStandardMaterial color="#4a3562" roughness={0.7} {...props} />;

// Everything in the room that isn't clickable: bed (Bed.jsx), desk, chair, nightstand,
// shelf planks, lamp, plant, fairy lights. Built from simple shapes in the
// late-night palette.
const Furniture = () => (
  <group>
    <Bed />

    {/* Nightstand between bed and desk */}
    <RoundedBox args={[0.45, 0.5, 0.4]} radius={0.03} position={[-0.82, 0.25, -2.25]}>
      <Wood />
    </RoundedBox>

    {/* Desk against the back wall */}
    <group position={[0.4, 0, -2.2]}>
      <mesh position={[0, 0.725, 0]}>
        <boxGeometry args={[1.4, 0.05, 0.6]} />
        <Wood />
      </mesh>
      {[-0.66, 0.66].map((x) => (
        <mesh key={x} position={[x, 0.35, 0]}>
          <boxGeometry args={[0.05, 0.7, 0.56]} />
          <Wood color="#3e2d55" />
        </mesh>
      ))}
      {/* Desk lamp */}
      <group position={[-0.52, 0.75, -0.12]}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.02, 20]} />
          <meshStandardMaterial color="#2b2545" />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.32, 8]} />
          <meshStandardMaterial color="#2b2545" />
        </mesh>
        <mesh position={[0, 0.34, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.09, 0.11, 20, 1, true]} />
          <meshStandardMaterial color="#2b2545" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshBasicMaterial color={WARM} toneMapped={false} />
        </mesh>
        <pointLight position={[0, 0.25, 0]} intensity={1.8} distance={2.2} color="#ffb46b" />
      </group>
    </group>

    {/* Desk chair, pulled out a little */}
    <group position={[-0.1, 0, -1.55]} rotation={[0, 0.45, 0]}>
      <RoundedBox args={[0.46, 0.07, 0.44]} radius={0.03} position={[0, 0.47, 0]}>
        <meshStandardMaterial color="#2b2545" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.46, 0.48, 0.06]} radius={0.03} position={[0, 0.75, 0.21]}>
        <meshStandardMaterial color="#2b2545" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 10]} />
        <meshStandardMaterial color="#555070" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.03, 5]} />
        <meshStandardMaterial color="#555070" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>

    {/* Wall shelf planks on the right wall (cozy clutter on the lower one, the robot on top) */}
    {[1.2, 1.6].map((y) => (
      <mesh key={y} position={[2.37, y - 0.015, -0.9]}>
        <boxGeometry args={[0.25, 0.03, 1.0]} />
        <Wood />
      </mesh>
    ))}
    {/* Plant in the back-right corner */}
    <group position={[2.12, 0, -2.12]}>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.16, 0.12, 0.34, 20]} />
        <meshStandardMaterial color="#3d3366" roughness={0.8} />
      </mesh>
      {[
        [0, 0.55, 0, 0.2],
        [0.12, 0.45, 0.06, 0.15],
        [-0.1, 0.48, -0.05, 0.16],
        [0.03, 0.72, -0.04, 0.13],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color="#2f6b5e" roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>

    <Door />
  </group>
);

export default Furniture;
