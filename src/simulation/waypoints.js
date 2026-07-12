import * as THREE from "three";
import mapboxgl from "mapbox-gl";

function gps(lng, lat, altitude = 20) {

    const mercator =
        mapboxgl.MercatorCoordinate.fromLngLat(
            [lng, lat],
            altitude
        );

    const scale = mercator.meterInMercatorCoordinateUnits();

    return new THREE.Vector3(
        mercator.x,
        mercator.y,
        mercator.z
    ).multiplyScalar(scale);

}

export const MRT_TO_HAWKER = [

    gps(103.7650, 1.3151),

    gps(103.7654, 1.3148),

    gps(103.7658, 1.3145),

    gps(103.7662, 1.3142)

];