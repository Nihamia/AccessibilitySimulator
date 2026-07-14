import * as THREE from "three";

/**
 * Local-space mesh in meters (Y-up).
 * Georeferencing is applied by the Mapbox custom layer, not here.
 */
export function createElderlyAgent() {
  const elderly = new THREE.Group();

  // depthTest: false so Mapbox 3D buildings cannot occlude the agent
  const bodyMat = new THREE.MeshBasicMaterial({
    color: 0x00ff66,
    depthTest: false,
    depthWrite: false,
  });
  const headMat = new THREE.MeshBasicMaterial({
    color: 0xffd6a5,
    depthTest: false,
    depthWrite: false,
  });

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1.6, 16),
    bodyMat,
  );

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), headMat);
  head.position.y = 1.15;

  elderly.add(body);
  elderly.add(head);

  // Render after map geometry within the Three.js pass
  body.renderOrder = 999;
  head.renderOrder = 999;

  return elderly;
}
