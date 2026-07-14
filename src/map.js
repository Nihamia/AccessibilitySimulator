import { addGeoJson } from "./world/GeoJsonRenderer";
import { addLandmarks } from "./world/WorldRenderer";
import mapboxgl from "mapbox-gl";
import { createThreeLayer } from "./layers/threeLayer";

// Use environment variable for API key
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
function addSimulationLayers(map) {
    const style = map.getStyle();
    const layers = style.layers;

    const labelLayerId = layers.find(
        (layer) =>
            layer.type === "symbol" &&
            layer.layout &&
            layer.layout["text-field"]
    )?.id;

    // Some styles (e.g. pure satellite) have no "composite" source.
    // Don't let buildings block the Three.js agent layer.
    if (style.sources?.composite && !map.getLayer("3d-buildings")) {
        map.addLayer(
            {
                id: "3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,

                paint: {
                    "fill-extrusion-color": "#aaa",

                    "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "height"],
                    ],

                    "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "min_height"],
                    ],

                    "fill-extrusion-opacity": 0.8,
                },
            },
            labelLayerId
        );
    }

    try {
        addLandmarks(map);
        addGeoJson(map);
    } catch (err) {
        console.error("Failed to add map overlays:", err);
    }

    // Always ensure Three.js agent layer exists and is drawn on top
    if (!map.getLayer("threejs-layer")) {
        map.addLayer(createThreeLayer());
    } else {
        map.moveLayer("threejs-layer");
    }
}
export function createMap() {
  const map = new mapboxgl.Map({
      container: "map",

      style: "mapbox://styles/mapbox/satellite-streets-v12",

      center: [103.7650, 1.3151],

      zoom: 18.3,
      pitch: 65,
      bearing: -28,

      minZoom: 17,
      maxZoom: 20,

      antialias: true,
  });
  const bounds = [
    [103.7638, 1.3138],
    [103.7668, 1.3162]
];

map.setMaxBounds(bounds);

map.addControl(new mapboxgl.NavigationControl());

const mapStyle = document.getElementById("mapStyle");

mapStyle.addEventListener("change", (e) => {
    map.setStyle(e.target.value);
});

map.on("style.load", () => {
    addSimulationLayers(map);
});

return map;
}