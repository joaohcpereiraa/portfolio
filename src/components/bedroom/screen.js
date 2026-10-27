import * as THREE from "three";

// World-space centre and facing of the laptop screen, filled by Laptop once
// the model mounts and read by CameraRig to dive into it on boot.
export const laptopScreen = {
  center: new THREE.Vector3(),
  normal: new THREE.Vector3(0, 0, 1),
};
