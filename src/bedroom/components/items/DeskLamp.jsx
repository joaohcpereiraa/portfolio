import * as THREE from "three";
import useLampSwitch from "../../hooks/useLampSwitch";

const BULB_ON = [3, 1.9, 0.9];
const BULB_OFF = [0.3, 0.27, 0.22]; // unlit glass
const METAL = "#2b2545";

// Desk lamp on the left of the desk: a round base, a thin stem and a cone
// shade over the bulb. Starts off; click it to switch it on and off. y 0 =
// desk top.
const DeskLamp = () => {
  const { on, handlers } = useLampSwitch("desk-lamp");

  return (
    <group {...handlers}>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.02, 20]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.32, 8]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.09, 0.11, 20, 1, true]} />
        <meshStandardMaterial color={METAL} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={on ? BULB_ON : BULB_OFF} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.25, 0]} intensity={on ? 1.8 : 0} distance={2.2} color="#ffb46b" />
    </group>
  );
};

export default DeskLamp;
