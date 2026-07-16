import * as THREE from "three";
import { setAgentPosition } from "./agentState";

function bearingBetween([lng1, lat1], [lng2, lat2]) {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export class Movement {
  constructor(object, waypoints, geoWaypoints, speed = 0.5) {
    this.object = object;
    this.waypoints = waypoints;
    this.geoWaypoints = geoWaypoints;
    this.speed = speed;
    this.current = 1;
    this.geoPosition = { lng: geoWaypoints[0][0], lat: geoWaypoints[0][1] };
  }

  update(delta) {
    if (this.current >= this.waypoints.length) {
      const last = this.geoWaypoints[this.geoWaypoints.length - 1];
      setAgentPosition(last[0], last[1], this.getBearing());
      return;
    }

    const target = this.waypoints[this.current];
    const geoTarget = this.geoWaypoints[this.current];
    const t = Math.min(1, delta * this.speed);

    this.object.position.lerp(target, t);
    this.geoPosition.lng = THREE.MathUtils.lerp(
      this.geoPosition.lng,
      geoTarget[0],
      t,
    );
    this.geoPosition.lat = THREE.MathUtils.lerp(
      this.geoPosition.lat,
      geoTarget[1],
      t,
    );

    setAgentPosition(
      this.geoPosition.lng,
      this.geoPosition.lat,
      this.getBearing(),
    );

    if (this.object.position.distanceTo(target) < 0.001) {
      this.current++;
    }
  }

  getBearing() {
    const idx = Math.min(this.current, this.geoWaypoints.length - 1);
    const from = this.geoWaypoints[idx - 1] ?? this.geoWaypoints[0];
    const to = this.geoWaypoints[idx];
    return bearingBetween(from, to);
  }
}
