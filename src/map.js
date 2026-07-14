import { addGeoJson } from "./world/GeoJsonRenderer";
import { renderWorld } from "./world/WorldRenderer";
import mapboxgl from "mapbox-gl";
import { createThreeLayer } from "./layers/threeLayer";

// Use environment variable for API key
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
function addSimulationLayers(map) {

    const layers = map.getStyle().layers;

    const labelLayerId = layers.find(
        (layer) =>
            layer.type === "symbol" &&
            layer.layout &&
            layer.layout["text-field"]
    )?.id;

    map.addLayer(
        {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,

            paint: {
                "fill-extrusion-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "height"],
                    0,
                    "#d8d8d8",
                    20,
                    "#bdbdbd",
                    60,
                    "#9e9e9e",
                    120,
                    "#7a7a7a"
                ],

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

                "fill-extrusion-opacity": 0.96,
            },
        },
        labelLayerId
    );

    map.addLayer(createThreeLayer());

    renderWorld(map);

    addGeoJson(map);
}
export function createMap() {
  const map = new mapboxgl.Map({
      container: "map",

      style: "mapbox://styles/mapbox/satellite-streets-v12",

      center: [103.7650, 1.3151],

      zoom: 19.2,
      pitch: 78,
      bearing: -35,

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
map.dragRotate.enable();
map.touchZoomRotate.enableRotation();

const mapStyle = document.getElementById("mapStyle");

mapStyle.addEventListener("change", (e) => {
    map.setStyle(e.target.value);
});

map.on("style.load", () => {
    map.setFog({
    color: "rgb(220,235,255)",
    "high-color": "rgb(36,92,223)",
    "horizon-blend": 0.15,
    "space-color": "rgb(11,11,25)",
    "star-intensity": 0.15
});

map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14
});

map.setTerrain({
    source: "mapbox-dem",
    exaggeration: 1.2
});
    addSimulationLayers(map);
});

return map;
}