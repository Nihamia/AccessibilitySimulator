import { renderRoads } from "./renderers/RoadRenderer";
import { renderFootpaths } from "./renderers/FootpathRenderer";
import { renderRailways } from "./renderers/RailwayRenderer";
import { renderStation } from "./renderers/StationRenderer";
import { renderCrossings } from "./renderers/CrossingRenderer";
import { renderElevators } from "./renderers/ElevatorRenderer";
import clementi from "../data/clementi.json";

console.log(clementi.features.length);

const highways = new Set();
const railways = new Set();

clementi.features.forEach(feature => {
    if (feature.properties?.highway) {
        highways.add(feature.properties.highway);
    }

    if (feature.properties?.railway) {
        railways.add(feature.properties.railway);
    }
});

console.log("Highways:", [...highways]);
console.log("Railways:", [...railways]);
const crossings = clementi.features.filter(
    feature => feature.properties?.highway === "crossing"
);

console.log("Number of crossings:", crossings.length);
console.log(crossings);

export function addGeoJson(map) {

    map.addSource("clementi", {
        type: "geojson",
        data: clementi
    });
    renderRoads(map);
    renderFootpaths(map);
    renderRailways(map);
    renderStation(map);
    renderCrossings(map);
    renderElevators(map);

    // ======================
    // Pedestrian Areas
    // ======================

    map.addLayer({
        id: "pedestrian-area",

        type: "fill",

        source: "clementi",

        filter: [
            "==",
            ["get", "highway"],
            "pedestrian"
        ],

        paint: {
            "fill-color": "#ffcc80",
            "fill-opacity": 0.6
        }
    });



}