import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { assetUrl } from "#shared/utils/assetUrl";
import { MAP_ASPECT, MAP_PINS } from "../../data/mapPins";

const MAP_URL = assetUrl("/images/world-map.svg");

const W = 2.0;
const H = W / MAP_ASPECT;
const FRAME = 0.04;

const PIN = "#e5484d";
const HOME_PIN = "#4fd1c5";

// Framed world map with a push pin in every country visited (home in teal),
// lit by a brass picture light over the frame. Local +z faces into the room,
// origin at the map's centre.
const WorldMap = () => {
  const map = useTexture(MAP_URL, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });

  return (
    <group>
      <mesh position={[0, 0, -0.012]}>
        <boxGeometry args={[W + FRAME * 2, H + FRAME * 2, 0.025]} />
        <meshStandardMaterial color="#1b1730" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={map} roughness={0.85} />
      </mesh>

      {/* Picture light: wall arm + brass hood glowing underneath */}
      <group position={[0, H / 2 + FRAME + 0.05, 0]}>
        {[-0.28, 0.28].map((x) => (
          <mesh key={x} position={[x, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />
            <meshStandardMaterial color="#b8955a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.8, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#b8955a" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.012, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.76, 0.03]} />
          <meshBasicMaterial color={[2.6, 1.8, 1.0]} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <pointLight position={[0, H / 2 + 0.02, 0.35]} intensity={2} distance={2.2} decay={1.6} color="#ffcf99" />
      <pointLight position={[0, -0.05, 0.6]} intensity={0.5} distance={1.6} color="#ffcf99" />

      {MAP_PINS.map(({ name, home, u, v }) => (
        <group key={name} position={[(u - 0.5) * W, (0.5 - v) * H, 0]}>
          <mesh position={[0, 0, 0.008]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0012, 0.0012, 0.016, 6]} />
            <meshStandardMaterial color="#c9c9d1" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <sphereGeometry args={[home ? 0.0075 : 0.0058, 14, 10]} />
            <meshStandardMaterial color={home ? HOME_PIN : PIN} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default WorldMap;
