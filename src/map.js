import mapboxgl from "mapbox-gl";
import { createThreeLayer } from "./layers/threeLayer";

// Use environment variable for API key
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
export function createMap() {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",

    // Clementi MRT
    center: [103.7650, 1.3151],

    zoom: 16,
    pitch: 45,
    bearing: -17.6,
    antialias: true,
  });

map.addControl(new mapboxgl.NavigationControl());

map.on("style.load", () => {
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
  map.addLayer(createThreeLayer());
});

return map;
}