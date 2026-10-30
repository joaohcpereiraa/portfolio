import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const { clamp, damp } = THREE.MathUtils;

// Little astronaut-bot built from primitives (no model download). Limbs are
// driven by `liveRef`, a mutable object the scene rewrites every frame with the
// current pose weights (wave / point / sit / fly / jet), scroll velocity and
// pointer position. Facing +z, roughly 2.85 units tall, centred on the origin.
const Robot = ({ liveRef }) => {
  const head = useRef(null);
  const eyes = useRef(null);
  const armR = useRef(null);
  const armL = useRef(null);
  const legR = useRef(null);
  const legL = useRef(null);
  const flames = useRef([]);

  const mats = useMemo(
    () => ({
      shell: new THREE.MeshStandardMaterial({ color: "#eef2f8", roughness: 0.35, metalness: 0.1 }),
      joint: new THREE.MeshStandardMaterial({ color: "#8b93a7", roughness: 0.5, metalness: 0.4 }),
      accent: new THREE.MeshStandardMaterial({ color: "#3b82f6", roughness: 0.4, metalness: 0.2 }),
      visor: new THREE.MeshStandardMaterial({ color: "#0a0f1f", roughness: 0.15, metalness: 0.6 }),
      glow: new THREE.MeshBasicMaterial({ color: "#7dd3fc" }),
      flame: new THREE.MeshBasicMaterial({
        color: "#60a5fa",
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      core: new THREE.MeshBasicMaterial({
        color: "#e0f2fe",
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    }),
    [],
  );

  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { wave, point, sit, fly, jet, vel, px, py, ry, calm } = liveRef.current;
    const sway = calm ? 0 : Math.sin(t * 1.6);
    const waveOsc = calm ? 0 : Math.sin(t * 9) * 0.35;
    const trail = clamp(vel * 0.25, -0.4, 0.4);

    // Head follows the pointer, partly undoing the body's yaw so it keeps
    // glancing back at the viewer.
    const facing = Math.atan2(Math.sin(ry), Math.cos(ry));
    head.current.rotation.y = damp(head.current.rotation.y, clamp(px * 0.7 - facing * 0.5, -0.9, 0.9), 6, dt);
    head.current.rotation.x = damp(head.current.rotation.x, -py * 0.35, 6, dt);

    eyes.current.scale.y = t % 3.8 < 0.12 ? 0.15 : 1;

    // Right arm (viewer's left) does the waving and pointing.
    armR.current.rotation.z = -(2.5 + waveOsc) * wave - 0.2 * point - 0.08 - 0.25 * fly;
    armR.current.rotation.x = -1.4 * point + 0.6 * fly + sway * 0.05;
    armL.current.rotation.z = 0.08 + 0.25 * fly + 0.15 * sit;
    armL.current.rotation.x = 0.6 * fly - 0.3 * sit - sway * 0.05;

    // Legs fold forward to sit, trail back in flight and swing with scroll speed.
    legR.current.rotation.x = -1.45 * sit + 0.35 * fly + trail + sway * 0.06;
    legL.current.rotation.x = -1.45 * sit + 0.25 * fly + trail - sway * 0.06;
    legR.current.rotation.z = -0.25 * sit;
    legL.current.rotation.z = 0.25 * sit;

    // Jetpack thrust grows with scroll speed.
    const thrust = jet + Math.min(Math.abs(vel) * 0.6, 1);
    flames.current.forEach((f) => {
      if (!f) return;
      const flicker = calm ? 1 : 0.85 + Math.random() * 0.3;
      const w = 0.8 + thrust * 0.4;
      f.visible = thrust > 0.02;
      f.scale.set(w, (0.15 + thrust * 1.1) * flicker, w);
    });
  });

  return (
    <group position={[0, -0.35, 0]}>
      {/* Torso */}
      <mesh material={mats.shell}>
        <capsuleGeometry args={[0.42, 0.4, 8, 20]} />
      </mesh>
      <mesh position={[0, -0.18, 0]} material={mats.accent}>
        <cylinderGeometry args={[0.44, 0.44, 0.08, 24]} />
      </mesh>
      <mesh position={[0, 0.12, 0.425]} material={mats.glow}>
        <circleGeometry args={[0.07, 20]} />
      </mesh>
      <mesh position={[0, 0.52, 0]} material={mats.joint}>
        <cylinderGeometry args={[0.12, 0.14, 0.12, 16]} />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 0.95, 0]}>
        <mesh scale={[1.12, 0.92, 1]} material={mats.shell}>
          <sphereGeometry args={[0.48, 32, 24]} />
        </mesh>
        <RoundedBox args={[0.78, 0.4, 0.2]} radius={0.09} position={[0, 0, 0.36]} material={mats.visor} />
        <group ref={eyes} position={[0, 0, 0.47]}>
          {[-0.15, 0.15].map((x) => (
            <mesh key={x} position={[x, 0, 0]} material={mats.glow}>
              <capsuleGeometry args={[0.045, 0.08, 4, 8]} />
            </mesh>
          ))}
        </group>
        {[-0.54, 0.54].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />
          </mesh>
        ))}
        <mesh position={[0, 0.59, 0]} material={mats.joint}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        </mesh>
        <mesh position={[0, 0.76, 0]} material={mats.glow}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
      </group>

      {/* Arms: pivot at the shoulder, hang along -y */}
      {[
        [armR, -0.56],
        [armL, 0.56],
      ].map(([ref, x]) => (
        <group key={x} ref={ref} position={[x, 0.22, 0]}>
          <mesh material={mats.joint}>
            <sphereGeometry args={[0.13, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.3, 0]} material={mats.shell}>
            <capsuleGeometry args={[0.1, 0.32, 6, 12]} />
          </mesh>
          <mesh position={[0, -0.58, 0]} material={mats.accent}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
        </group>
      ))}

      {/* Legs: pivot at the hip */}
      {[
        [legR, -0.2],
        [legL, 0.2],
      ].map(([ref, x]) => (
        <group key={x} ref={ref} position={[x, -0.55, 0]}>
          <mesh position={[0, -0.2, 0]} material={mats.shell}>
            <capsuleGeometry args={[0.12, 0.22, 6, 12]} />
          </mesh>
          <RoundedBox args={[0.26, 0.16, 0.34]} radius={0.06} position={[0, -0.45, 0.04]} material={mats.accent} />
        </group>
      ))}

      {/* Jetpack */}
      <RoundedBox args={[0.62, 0.7, 0.26]} radius={0.08} position={[0, 0.05, -0.48]} material={mats.joint} />
      {[-0.17, 0.17].map((x, i) => (
        <group key={x} position={[x, -0.37, -0.48]}>
          <mesh material={mats.joint}>
            <cylinderGeometry args={[0.08, 0.11, 0.14, 16]} />
          </mesh>
          {/* Scaled from the nozzle mouth, so cones hang tip-down below it. */}
          <group ref={(el) => (flames.current[i] = el)} position={[0, -0.07, 0]}>
            <mesh position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]} material={mats.flame}>
              <coneGeometry args={[0.09, 0.5, 14]} />
            </mesh>
            <mesh position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]} material={mats.core}>
              <coneGeometry args={[0.045, 0.3, 10]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

export default Robot;
