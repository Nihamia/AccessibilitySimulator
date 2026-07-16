import "./style.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapillary-js/dist/mapillary.css";

import { createMap } from "./map";
import { createStreetViewPanel } from "./streetView/streetViewPanel";
import {
  bindStreetViewProviderSelects,
  createStreetViewManager,
  STREET_VIEW_PROVIDERS,
} from "./streetView/streetViewManager";

createMap();

const streetViewPanel = createStreetViewPanel();
const streetViewContainer = streetViewPanel.querySelector(
  "#street-view-container",
);
const streetViewManager = createStreetViewManager(streetViewContainer);

const providerControls = bindStreetViewProviderSelects(
  streetViewManager,
  document.getElementById("streetViewProvider"),
  document.getElementById("streetViewProviderPanel"),
);

providerControls.setProvider(STREET_VIEW_PROVIDERS.GOOGLE);

document.getElementById("showStreetView")?.addEventListener("click", () => {
  streetViewPanel.classList.remove("is-hidden");
});
