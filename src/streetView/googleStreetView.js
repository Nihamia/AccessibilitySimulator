import { onAgentPositionChange } from "../simulation/agentState";
import { loadGoogleMaps } from "./loadGoogleMaps";

const UPDATE_INTERVAL_MS = 500;
const MIN_MOVE_METERS = 3;
const PANORAMA_RADIUS_METERS = 50;

function haversineMeters(lng1, lat1, lng2, lat2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function showPlaceholder(container, message) {
  container.innerHTML = `
    <div class="street-view-placeholder">
      <p>${message}</p>
    </div>
  `;
}

export async function createGoogleStreetView(container) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    showPlaceholder(
      container,
      'Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your <code>.env</code> file.',
    );
    return { destroy() {} };
  }

  try {
    const maps = await loadGoogleMaps(apiKey);
    container.innerHTML = "";

    const panorama = new maps.StreetViewPanorama(container, {
      addressControl: false,
      fullscreenControl: true,
      motionTracking: false,
      motionTrackingControl: false,
      showRoadLabels: false,
    });
    const service = new maps.StreetViewService();

    let lastQueryPosition = null;
    let lastQueryTime = 0;
    let pending = false;
    let currentPano = null;

    function syncToPosition(position, bearing) {
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

      service.getPanorama(
        {
          location: { lat: position.lat, lng: position.lng },
          radius: PANORAMA_RADIUS_METERS,
          source: maps.StreetViewSource.OUTDOOR,
        },
        (data, status) => {
          pending = false;

          if (status !== maps.StreetViewStatus.OK) return;

          const panoId = data.location.pano;
          if (panoId === currentPano) {
            panorama.setPov({ heading: bearing, pitch: 0 });
            return;
          }

          currentPano = panoId;
          panorama.setPano(panoId);
          panorama.setPov({ heading: bearing, pitch: 0 });
        },
      );
    }

    const unsubscribe = onAgentPositionChange(syncToPosition);

    return {
      destroy() {
        unsubscribe();
        maps.event.clearInstanceListeners(panorama);
      },
    };
  } catch (error) {
    console.error("Google Street View failed to initialize:", error);
    showPlaceholder(
      container,
      "Google Street View failed to load. Check your API key and enable the Maps JavaScript API.",
    );
    return { destroy() {} };
  }
}
