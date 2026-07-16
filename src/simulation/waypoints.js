import * as THREE from "three";
import mapboxgl from "mapbox-gl";

// Clementi MRT → footpath → hawker → crossing
export const ROUTE_WAYPOINTS = [
  [103.764632, 1.314583], // near Clementi MRT / Ave 3
  [103.76458, 1.31373], // footpath heading south
  [103.7647, 1.3135], // near Soon Huat Cooked Food
  [103.764812, 1.313329], // mid-path
  [103.764948, 1.312964], // approaching crossing area
  [103.7651, 1.312802], // near crossing
  [103.765237, 1.31266], // route end
];

export const AGENT_ORIGIN = ROUTE_WAYPOINTS[0];
export const AGENT_ALTITUDE = 5;

function toLocal(lng, lat, anchor, scale) {
  const mercator = mapboxgl.MercatorCoordinate.fromLngLat(
    [lng, lat],
    AGENT_ALTITUDE,
  );

  return new THREE.Vector3(
    (mercator.x - anchor.x) / scale,
    // Keep movement on the map plane (latitude is mapped to Three.Z).
    // Altitude is constant in our simulation, so Mercator Z delta is ~0.
    (mercator.z - anchor.z) / scale,
    // Flip sign to match the orientation expected by `threeLayer.js`.
    (mercator.y - anchor.y) / scale,
  );
}

const anchor = mapboxgl.MercatorCoordinate.fromLngLat(
  AGENT_ORIGIN,
  AGENT_ALTITUDE,
);
const scale = anchor.meterInMercatorCoordinateUnits();

export const MRT_TO_HAWKER = ROUTE_WAYPOINTS.map(([lng, lat]) =>
  toLocal(lng, lat, anchor, scale),
);
