import { renderLandmarks } from "./renderers/LandmarkRenderer";
import { renderBusStops } from "./renderers/BusStopRenderer";
import { renderBusRoutes } from "./renderers/BusRouteRenderer";

export function renderWorld(map) {

    renderLandmarks(map);

    renderBusStops(map);

    renderBusRoutes(map);

}