import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import useBootStore from "#store/boot";
import useBedroomStore from "#store/bedroom";
import { assetUrl } from "../../utils/assetUrl";
import { laptopScreen } from "./screen";

const MODEL_URL = assetUrl("/models/macbook-pro.glb");

// The MacBook on the desk. The model is already in metres. Clicking it (via
// the surrounding Clickable) flies the camera to it; once there, clicking the
// lit screen boots into the desktop.
const Laptop = () => {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef(null);

  // Tag the display (the only material with an emissive map) and brighten it
  // a little so the bloom catches it. The model is ~164k triangles, too many
  // to raycast on every pointer move, so its meshes opt out of raycasting and
  // two invisible boxes (keyboard deck + lid) take the pointer instead.
  const { model, deck, lid } = useMemo(() => {
    const root = scene.clone(true);
    let screen = null;
    root.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.raycast = () => {};
      if (obj.material?.emissiveMap) {
        screen = obj;
        obj.userData.isScreen = true;
        obj.material = obj.material.clone();
        obj.material.emissiveIntensity = 1.6;
        obj.material.toneMapped = false;
      }
    });
    const box = new THREE.Box3().setFromObject(root);
    const lidBox = screen ? new THREE.Box3().setFromObject(screen) : box;
    const deckBox = box.clone();
    deckBox.max.y = Math.min(box.max.y, box.min.y + 0.02);
    const toHit = (b) => ({
      position: b.getCenter(new THREE.Vector3()).toArray(),
      size: b.getSize(new THREE.Vector3()).toArray(),
    });
    return { model: root, deck: toHit(deckBox), lid: toHit(lidBox) };
  }, [scene]);

  useLayoutEffect(() => {
    const group = groupRef.current;
    group.updateWorldMatrix(true, true);
    let screen = null;
    group.traverse((obj) => {
      if (obj.userData.isScreen) screen = obj;
    });
    if (screen) new THREE.Box3().setFromObject(screen).getCenter(laptopScreen.center);
    // The lid leans back slightly; aim a touch upward from the laptop's front.
    const quat = group.getWorldQuaternion(new THREE.Quaternion());
    laptopScreen.normal.set(0, 0.2, 1).normalize().applyQuaternion(quat);
  }, [model]);

  const handleClick = (e) => {
    if (!e.object.userData.screenHit || e.delta > 6) return;
    if (useBedroomStore.getState().focused !== "computer") return;
    e.stopPropagation();
    useBootStore.getState().enter();
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      <primitive object={model} />
      <mesh position={deck.position} visible={false}>
        <boxGeometry args={deck.size} />
      </mesh>
      <mesh position={lid.position} visible={false} userData={{ screenHit: true }}>
        <boxGeometry args={lid.size} />
      </mesh>
      {/* Screen glow spilling onto the desk. */}
      <pointLight position={[0, 0.15, 0.15]} intensity={0.6} distance={1.6} color="#bcd4ff" />
    </group>
  );
};

useGLTF.preload(MODEL_URL);

export default Laptop;
