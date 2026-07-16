const listeners = new Set();

let position = null;
let bearing = 0;

export function getAgentPosition() {
  return position;
}

export function getAgentBearing() {
  return bearing;
}

export function setAgentPosition(lng, lat, nextBearing) {
  position = { lng, lat };
  bearing = nextBearing;
  listeners.forEach((fn) => fn(position, bearing));
}

export function onAgentPositionChange(fn) {
  listeners.add(fn);
  if (position) fn(position, bearing);
  return () => listeners.delete(fn);
}
