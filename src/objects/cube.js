import * as THREE from "three";
import mapboxgl from "mapbox-gl";

export function createCube() {
  // Clementi MRT
  const mercator = mapboxgl.MercatorCoordinate.fromLngLat(
    [103.7650, 1.3151],
    20
  );

  const scale = mercator.meterInMercatorCoordinateUnits();

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshStandardMaterial({
      color: "red",
    })
  );

  cube.position.set(
    mercator.x,
    mercator.y,
    mercator.z
  );

  cube.scale.set(scale, scale, scale);

  return cube;
}