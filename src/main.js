import "./style.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapillary-js/dist/mapillary.css";

import { createMap } from "./map";
import { createStreetViewPanel } from "./streetView/streetViewPanel";
import { createMapillaryView } from "./streetView/mapillaryView";

createMap();

const streetViewPanel = createStreetViewPanel();
const streetViewContainer = streetViewPanel.querySelector(
  "#street-view-container",
);
createMapillaryView(streetViewContainer);

document.getElementById("showStreetView")?.addEventListener("click", () => {
  streetViewPanel.classList.remove("is-hidden");
});