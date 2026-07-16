import { Viewer } from "mapillary-js";
import { onAgentPositionChange } from "../simulation/agentState";

const MAPILLARY_API = "https://graph.mapillary.com/images";
const UPDATE_INTERVAL_MS = 800;
const MIN_MOVE_METERS = 4;

function haversineMeters(lng1, lat1, lng2, lat2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchNearestImage(accessToken, lng, lat) {
  const params = new URLSearchParams({
    access_token: accessToken,
    fields: "id,geometry,compass_angle",
    lng: String(lng),
    lat: String(lat),
    radius: "30",
    limit: "1",
  });

  const response = await fetch(`${MAPILLARY_API}?${params}`);
  if (!response.ok) {
    throw new Error(`Mapillary API error (${response.status})`);
  }

  const payload = await response.json();
  return payload.data?.[0] ?? null;
}

export function createMapillaryView(container) {
  const accessToken = import.meta.env.VITE_MAPILLARY_TOKEN;

  if (!accessToken) {
    container.innerHTML = `
      <div class="street-view-placeholder">
        <p>Add <code>VITE_MAPILLARY_TOKEN</code> to your <code>.env</code> file.</p>
        <p>Get a free token at <a href="https://www.mapillary.com/dashboard/developers" target="_blank" rel="noreferrer">mapillary.com/dashboard/developers</a>.</p>
      </div>
    `;
    return null;
  }

  let viewer = new Viewer({
    accessToken,
    container,
  });
  let currentImageId = null;
  let lastQueryPosition = null;
  let lastQueryTime = 0;
  let pending = false;

  async function syncToPosition(position) {
    if (pending) return;

    const now = performance.now();
    if (
      lastQueryPosition &&
      now - lastQueryTime < UPDATE_INTERVAL_MS &&
      haversineMeters(
        lastQueryPosition.lng,
        lastQueryPosition.lat,
        position.lng,
        position.lat,
      ) < MIN_MOVE_METERS
    ) {
      return;
    }

    pending = true;
    lastQueryTime = now;
    lastQueryPosition = { ...position };

    try {
      const image = await fetchNearestImage(
        accessToken,
        position.lng,
        position.lat,
      );

      if (!image || image.id === currentImageId) return;

      currentImageId = image.id;
      await viewer.moveTo(image.id);
    } catch (error) {
      console.error("Mapillary street view sync failed:", error);
    } finally {
      pending = false;
    }
  }

  const unsubscribe = onAgentPositionChange(syncToPosition);

  return {
    destroy() {
      unsubscribe();
      viewer?.remove();
    },
  };
}
