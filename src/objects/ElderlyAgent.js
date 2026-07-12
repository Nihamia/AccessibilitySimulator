import * as THREE from "three";
import mapboxgl from "mapbox-gl";

export function createElderlyAgent() {

    // Clementi MRT
    const mercator = mapboxgl.MercatorCoordinate.fromLngLat(
        [103.7650, 1.3151],
        20
    );

    const scale = 1;

    // Create a group to represent the person
    const elderly = new THREE.Group();

    // Body
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16),
        new THREE.MeshStandardMaterial({
            color: 0x4CAF50
        })
    );

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 16, 16),
        new THREE.MeshStandardMaterial({
            color: 0xFFD6A5
        })
    );

    // Move the head above the body
    head.position.y = 0.9;

    // Add body and head to the group
    elderly.add(body);
    elderly.add(head);

    // Position the whole person
    elderly.position.set(
        mercator.x,
        mercator.y,
        mercator.z
    );

    // Scale the whole person
    elderly.scale.set(
        scale,
        scale,
        scale
    );

    return elderly;
}