import * as THREE from "three";
import mapboxgl from "mapbox-gl";
import { createElderlyAgent } from "../objects/ElderlyAgent";
import { Movement } from "../simulation/movement";
import {
  AGENT_ALTITUDE,
  AGENT_ORIGIN,
  MRT_TO_HAWKER,
} from "../simulation/waypoints";

export function createThreeLayer() {
  let map;
  let scene;
  let camera;
  let renderer;
  let modelTransform;
  let movement;
  let lastTime;

  return {
    id: "threejs-layer",
    type: "custom",
    renderingMode: "3d",

    onAdd(mapInstance, gl) {
      map = mapInstance;
      lastTime = performance.now();
      scene = new THREE.Scene();
      camera = new THREE.Camera();

      // Official Mapbox pattern: model stays at local origin;
      // translate / rotate / scale are folded into the camera matrix.
      const mercator = mapboxgl.MercatorCoordinate.fromLngLat(
        AGENT_ORIGIN,
        AGENT_ALTITUDE,
      );

      modelTransform = {
        translateX: mercator.x,
        translateY: mercator.y,
        translateZ: mercator.z,
        rotateX: Math.PI / 2,
        rotateY: 0,
        rotateZ: 0,
        scale: mercator.meterInMercatorCoordinateUnits(),
      };

      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });
      renderer.autoClear = false;

      const elderly = createElderlyAgent();
      scene.add(elderly);
      movement = new Movement(elderly, MRT_TO_HAWKER);
    },

    render(_gl, matrix) {
      if (!modelTransform) return;

      const now = performance.now();
      const delta = (now - lastTime) / 1000; // delta is the time difference between the current and last frame in seconds
      lastTime = now;

      movement.update(delta);

      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX,
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY,
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ,
      );

      const m = new THREE.Matrix4().fromArray(matrix);
      const l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ,
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale,
          ),
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      camera.projectionMatrix = m.multiply(l);
      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };
}
