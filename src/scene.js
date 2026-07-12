import * as THREE from "three";

export function createThreeScene(canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.Camera();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderer.autoClear = false;

  const light = new THREE.DirectionalLight(0xffffff, 3);

  light.position.set(100, 100, 100);

  scene.add(light);

  return {
    scene,
    camera,
    renderer,
    THREE
  };
}