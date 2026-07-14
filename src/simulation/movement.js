import * as THREE from "three";

export class Movement {
  constructor(object, waypoints, speed = 0.5) {
    this.object = object;
    this.waypoints = waypoints;
    this.speed = speed;
    this.current = 0;
  }

  /**
   * Update the movement of the object
   * @param {number} delta - The time difference between the current and last frame in seconds
   */
  update(delta) {
    if (this.current >= this.waypoints.length) return;

    const target = this.waypoints[this.current];

    this.object.position.lerp(target, delta * this.speed);

    if (this.object.position.distanceTo(target) < 0.001) {
      this.current++;
    }
  }
}
