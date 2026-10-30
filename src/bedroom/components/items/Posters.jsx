import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { landingProjects } from "#constants";
import { reducedMotion } from "../../utils/motion";
import usePickable from "../../hooks/usePickable";
import { isTaken } from "../../store/selectors";
import WallCatcher from "./WallCatcher";

const { damp } = THREE.MathUtils;

const W = 0.44;
const H = 0.6;
const GAP = 0.62;

const LIFT = 0.03; // hover: the poster comes off the wall a little
const TAKE_Z = 0.55; // how far in front of the wall a picked poster flies
const TAKE_SCALE = 1.25;
const TAKE_SPEED = 6;

const Frame = ({ children }) => (
  <group>
    <RoundedBox args={[W + 0.06, H + 0.06, 0.025]} radius={0.008}>
      <meshStandardMaterial color="#1b1730" roughness={0.6} />
    </RoundedBox>
    {children}
  </group>
);

// Crop the image to the poster's shape (like CSS object-fit: cover) instead
// of stretching a landscape screenshot onto a portrait frame.
const coverFit = (t) => {
  t.colorSpace = THREE.SRGBColorSpace;
  const { width, height } = t.image;
  const ratio = W / H / (width / height);
  if (ratio < 1) {
    t.repeat.set(ratio, 1);
    t.offset.set((1 - ratio) / 2, 0);
  } else {
    t.repeat.set(1, 1 / ratio);
    t.offset.set(0, (1 - 1 / ratio) / 2);
  }
};

const ImagePoster = ({ image }) => {
  const tex = useTexture(image, coverFit);
  return (
    <Frame>
      <mesh position={[0, 0, 0.0135]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={tex} roughness={0.7} />
      </mesh>
    </Frame>
  );
};

// No screenshot: the project's accent colours as a two-tone poster.
const ColorPoster = ({ accent }) => (
  <Frame>
    <mesh position={[0, H / 4, 0.0135]}>
      <planeGeometry args={[W, H / 2]} />
      <meshStandardMaterial color={accent[0]} roughness={0.7} />
    </mesh>
    <mesh position={[0, -H / 4, 0.0135]}>
      <planeGeometry args={[W, H / 2]} />
      <meshStandardMaterial color={accent[1]} roughness={0.7} />
    </mesh>
  </Frame>
);

// One poster. Hover lifts it off the wall; once picked it peels away, flies
// to the middle of the view and flips over, hiding as its back turns to us,
// where the DOM project card takes over and finishes the flip. Put back, it
// flips around again and settles on the wall.
const Poster = ({ project, index, x }) => {
  const groupRef = useRef(null);
  const { hoverRef, handlers } = usePickable("projects", index);

  useFrame((_, dt) => {
    const g = groupRef.current;
    const selected = isTaken("projects", index);
    const to = selected
      ? { x: -x, z: TAKE_Z, rotX: -0.12, rotY: Math.PI, scale: TAKE_SCALE }
      : { x: 0, z: hoverRef.current ? LIFT : 0, rotX: 0, rotY: 0, scale: 1 };
    const k = (from, target, speed = TAKE_SPEED) => (reducedMotion ? target : damp(from, target, speed, dt));

    g.position.x = k(g.position.x, to.x);
    g.position.z = k(g.position.z, to.z, selected ? TAKE_SPEED : 10);
    // Peel first, flip a beat later (slower), so it reads as lift → turn.
    g.rotation.x = k(g.rotation.x, to.rotX, 8);
    g.rotation.y = k(g.rotation.y, to.rotY, selected ? 4.5 : 6);
    g.scale.setScalar(k(g.scale.x, to.scale));
    g.visible = g.rotation.y < Math.PI * 0.45;
  });

  return (
    <group position={[x, 0, 0]}>
      <group ref={groupRef} {...handlers}>
        {project.image ? <ImagePoster image={project.image} /> : <ColorPoster accent={project.accent} />}
      </group>
    </group>
  );
};

// One framed poster per project on the right wall. Local x runs along the
// wall, +z faces into the room.
const Posters = () => (
  <group>
    <WallCatcher focusId="projects" width={GAP * landingProjects.length + 0.6} height={H + 0.8} z={-0.005} />
    {landingProjects.map((p, i) => (
      <Poster key={p.id} project={p} index={i} x={(i - (landingProjects.length - 1) / 2) * GAP} />
    ))}
  </group>
);

export default Posters;
