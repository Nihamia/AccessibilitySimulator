import clementi from "../data/clementi.json";

export function addGeoJson(map) {
    if (map.getSource("clementi")) return;

    map.addSource("clementi", {
        type: "geojson",
        data: clementi
    });

    // ======================
    // Roads
    // ======================

    map.addLayer({
        id: "roads",

        type: "line",

        source: "clementi",

        filter: [
            "match",
            ["get", "highway"],
            [
                "primary",
                "secondary",
                "tertiary",
                "residential",
                "service"
            ],
            true,
            false
        ],

        paint: {
            "line-color": "#555555",
            "line-width": 4
        }
    });

    // ======================
    // Footpaths
    // ======================

    map.addLayer({
        id: "footpaths",

        type: "line",

        source: "clementi",

        filter: [
            "match",
            ["get", "highway"],
            [
                "footway"
            ],
            true,
            false
        ],

        paint: {
            "line-color": "#ff9800",
            "line-width": 3
        }
    });

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

    // ======================
    // MRT Track
    // ======================

    map.addLayer({
        id: "railway",

        type: "line",

        source: "clementi",

        filter: [
            "==",
            ["get", "railway"],
            "subway"
        ],

        paint: {
            "line-color": "#d32f2f",
            "line-width": 6
        }
    });

    // ======================
    // MRT Platforms
    // ======================

    map.addLayer({
        id: "platform",

        type: "fill",

        source: "clementi",

        filter: [
            "==",
            ["get", "railway"],
            "platform"
        ],

        paint: {
            "fill-color": "#8e24aa",
            "fill-opacity": 0.5
        }
    });

}