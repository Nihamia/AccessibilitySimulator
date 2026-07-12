import * as THREE from "three";
import mapboxgl from "mapbox-gl";
import { createElderlyAgent } from "../objects/ElderlyAgent";

export function createThreeLayer() {
  let scene;
  let camera;
  let renderer;

  return {
    id: "threejs-layer",
    type: "custom",
    renderingMode: "3d",

    onAdd(map, gl) {
      scene = new THREE.Scene();

      camera = new THREE.Camera();

      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });

      renderer.autoClear = false;

      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(100, 100, 100);

      scene.add(light);

      scene.add(createElderlyAgent());
    },

    render(gl, matrix) {
    const m = new THREE.Matrix4().fromArray(matrix);

    camera.projectionMatrix = m;

    renderer.resetState();
    renderer.render(scene, camera);
    },
  };
}