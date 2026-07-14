import * as THREE from "three";
import mapboxgl from "mapbox-gl";

export const AGENT_ORIGIN = [103.765, 1.3151];
export const AGENT_ALTITUDE = 5;

const ROUTE = [
  [103.765, 1.3151],
  [103.7654, 1.3148],
  [103.7658, 1.3145],
  [103.7662, 1.3142],
];

// Convert longitude and latitude to local coordinates
function toLocal(lng, lat, anchor, scale) {
  const mercator = mapboxgl.MercatorCoordinate.fromLngLat(
    [lng, lat],
    AGENT_ALTITUDE,
  );

  return new THREE.Vector3(
    (mercator.x - anchor.x) / scale,
    (mercator.z - anchor.z) / scale,
    -(mercator.y - anchor.y) / scale,
  );
}

const anchor = mapboxgl.MercatorCoordinate.fromLngLat(
  AGENT_ORIGIN,
  AGENT_ALTITUDE,
);
const scale = anchor.meterInMercatorCoordinateUnits();

export const MRT_TO_HAWKER = ROUTE.map(([lng, lat]) =>
  toLocal(lng, lat, anchor, scale),
);
