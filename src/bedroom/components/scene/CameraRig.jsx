import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import useBootStore from "#shared/store/boot";
import useBedroomStore from "../../store/useBedroomStore";
import { HOME_VIEW, getItem } from "../../data/items";
import { reducedMotion } from "../../utils/motion";
import { laptopScreen } from "../../store/laptopScreen";

const { clamp, damp, degToRad } = THREE.MathUtils;

const DRAG_SPEED = 0.004; // radians per dragged pixel
const PITCH_MIN = degToRad(-35);
const PITCH_MAX = degToRad(25);
const FLIGHT = reducedMotion ? 0 : 1.1;

const HOME_POS = new THREE.Vector3(...HOME_VIEW.position);

// Yaw 0 looks down -z; positive yaw turns left, positive pitch looks up.
const lookDir = (yaw, pitch, out) =>
  out.set(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));

const homeDir = new THREE.Vector3(...HOME_VIEW.target).sub(HOME_POS).normalize();
const HOME_YAW = Math.atan2(-homeDir.x, -homeDir.z);
const HOME_PITCH = Math.asin(homeDir.y);

// First-person camera: stands at HOME_VIEW and looks around by dragging; flies
// to an item's view when one is focused and back when it closes; zooms into
// the laptop screen when the visitor boots the computer.
const CameraRig = () => {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const focused = useBedroomStore((s) => s.focused);
  const phase = useBootStore((s) => s.phase);
  const boot = useBootStore((s) => s.boot);

  const rig = useRef({
    pos: HOME_POS.clone(),
    look: HOME_POS.clone().add(homeDir),
    yaw: HOME_YAW,
    pitch: HOME_PITCH,
    targetYaw: HOME_YAW,
    targetPitch: HOME_PITCH,
    free: true, // look-around active (home view, not flying)
    tween: null,
  });

  // Drag to look around. Listeners live on the canvas so panels and buttons
  // over it don't rotate the view.
  useEffect(() => {
    const el = gl.domElement;
    let drag = null;
    const onDown = (e) => {
      drag = { x: e.clientX, y: e.clientY, moved: 0 };
    };
    const onMove = (e) => {
      if (!drag) return;
      const r = rig.current;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (!r.free) return;
      // Full 360° turn: yaw is left unbounded (it just keeps accumulating).
      r.targetYaw += dx * DRAG_SPEED;
      r.targetPitch = clamp(r.targetPitch + dy * DRAG_SPEED, PITCH_MIN, PITCH_MAX);
      if (drag.moved > 8) {
        document.getElementById("bedroom")?.classList.add("dragging");
        const { hintSeen, dismissHint } = useBedroomStore.getState();
        if (!hintSeen) dismissHint();
      }
    };
    const onUp = () => {
      drag = null;
      document.getElementById("bedroom")?.classList.remove("dragging");
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  // Fly to the focused item, or back home (keeping the last look direction).
  useEffect(() => {
    const r = rig.current;
    if (phase !== "landing") return;
    r.tween?.kill();

    let toPos;
    let toLook;
    if (focused) {
      const { view } = getItem(focused);
      toPos = view.position;
      toLook = view.target;
      r.free = false;
    } else {
      // Already home (first mount): nothing to fly.
      if (r.free) return;
      toPos = HOME_VIEW.position;
      toLook = lookDir(r.yaw, r.pitch, new THREE.Vector3()).add(HOME_POS).toArray();
    }

    const tl = gsap.timeline({
      defaults: { duration: FLIGHT, ease: "power2.inOut" },
      onComplete: () => {
        if (!useBedroomStore.getState().focused) r.free = true;
      },
    });
    tl.to(r.pos, { x: toPos[0], y: toPos[1], z: toPos[2] }, 0);
    tl.to(r.look, { x: toLook[0], y: toLook[1], z: toLook[2] }, 0);
    r.tween = tl;
  }, [focused, phase]);

  // Boot: dive into the laptop screen, then hand off to the boot screen.
  useEffect(() => {
    if (phase !== "entering") return;
    const r = rig.current;
    r.tween?.kill();
    r.free = false;
    const { center, normal } = laptopScreen;
    const end = center.clone().addScaledVector(normal, 0.11);
    const tl = gsap.timeline({ onComplete: boot, defaults: { ease: "power3.inOut" } });
    tl.to(r.look, { x: center.x, y: center.y, z: center.z, duration: reducedMotion ? 0 : 0.5 }, 0);
    tl.to(r.pos, { x: end.x, y: end.y, z: end.z, duration: reducedMotion ? 0 : 1.2 }, 0);
    r.tween = tl;
    return () => tl.kill();
  }, [phase, boot]);

  useEffect(() => () => rig.current.tween?.kill(), []);

  useFrame((_, dt) => {
    const r = rig.current;
    if (r.free) {
      r.yaw = damp(r.yaw, r.targetYaw, 8, dt);
      r.pitch = damp(r.pitch, r.targetPitch, 8, dt);
      lookDir(r.yaw, r.pitch, r.look).add(r.pos);
    }
    camera.position.copy(r.pos);
    camera.lookAt(r.look);
  });

  return null;
};

export default CameraRig;
