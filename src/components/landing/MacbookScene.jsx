import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { assetUrl } from "../../utils/assetUrl";
import useBootStore from "../../store/boot";
import useLandingStore from "../../store/landing";

const MODEL_URL = assetUrl("/models/macbook-pro.glb");
const TARGET_SIZE = 3.2; // normalize the model's largest dimension to this
const CLICK_THRESHOLD = 6; // px of movement below which a press counts as a click

const Macbook = () => {
  const { scene } = useGLTF(MODEL_URL);
  const enter = useBootStore((s) => s.enter);
  const downRef = useRef(null);
  const groupRef = useRef(null);

  // Scroll rotates the laptop from back-to-camera (Apple logo, π) to
  // front-facing (screen, 0). Lerp toward the target each frame for smoothness.
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const { progress } = useLandingStore.getState();
    const target = THREE.MathUtils.lerp(Math.PI, 0, progress);
    group.rotation.y += (target - group.rotation.y) * 0.12;
  });

  // Center + normalize scale once, and tag the lit display mesh (the only
  // material with an emissive map) so it's the sole clickable surface.
  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((obj) => {
      if (obj.isMesh && obj.material?.emissiveMap) {
        obj.userData.isScreen = true;
      }
    });
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z);
    root.position.sub(center);
    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(scale);
    return wrapper;
  }, [scene]);

  // A click (not a drag) on the SCREEN enters. Dragging anywhere orbits.
  const handleDown = (e) => {
    if (!e.object.userData.isScreen) return;
    downRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleUp = (e) => {
    const down = downRef.current;
    downRef.current = null;
    if (!down || !e.object.userData.isScreen) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    if (moved < CLICK_THRESHOLD) enter();
  };
  const handleOver = (e) => {
    if (e.object.userData.isScreen) document.body.style.cursor = "pointer";
  };
  const handleOut = () => (document.body.style.cursor = "auto");

  return (
    <group
      ref={groupRef}
      rotation={[0, Math.PI, 0]}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      <primitive object={model} />
    </group>
  );
};

// Drives the camera zoom-into-screen transition when the user enters.
const CameraRig = () => {
  const camera = useThree((s) => s.camera);
  const phase = useBootStore((s) => s.phase);
  const boot = useBootStore((s) => s.boot);

  useEffect(() => {
    if (phase !== "entering") return;
    const tl = gsap.timeline({ onComplete: boot });
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 0.7,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
    return () => tl.kill();
  }, [phase, camera, boot]);

  return null;
};

const MacbookScene = () => {
  const phase = useBootStore((s) => s.phase);

  return (
    <Canvas
      camera={{ position: [0, 0.15, 6], fov: 35 }}
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 5]} intensity={3} />
      <directionalLight position={[-5, 3, 2]} intensity={1.2} />
      {/* Lights the camera-facing side (the lid back + Apple logo at the start). */}
      <directionalLight position={[0, 2, 9]} intensity={2.5} />
      <spotLight position={[0, 4, 6]} angle={0.5} penumbra={1} intensity={6} />
      <Suspense fallback={null}>
        {/* Synthetic studio env (no external HDR fetch) for metal reflections. */}
        <Environment resolution={256} environmentIntensity={2.2}>
          <Lightformer intensity={4} position={[0, 4, 3]} scale={[8, 4, 1]} />
          <Lightformer intensity={2} position={[-4, 1, 3]} scale={[4, 4, 1]} color="#ffffff" />
          <Lightformer intensity={2} position={[4, 1, 3]} scale={[4, 4, 1]} color="#bcd4ff" />
          {/* Big bright panel on the camera side so mirror surfaces (the logo) catch a highlight. */}
          <Lightformer intensity={5} position={[0, 1, 9]} scale={[10, 10, 1]} color="#ffffff" />
        </Environment>
        <Macbook />
      </Suspense>
      {/* Drag to orbit; locked while the enter transition plays. */}
      <OrbitControls
        enabled={phase === "landing"}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.9}
      />
      <CameraRig />
    </Canvas>
  );
};

useGLTF.preload(MODEL_URL);

export default MacbookScene;
