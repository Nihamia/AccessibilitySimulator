export function renderFootpaths(map) {

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
                "footway",
                "corridor",
                "steps",
                "cycleway"
            ],
            true,
            false
        ],

        paint: {
            "line-color": "#ff9800",
            "line-width": 3
        }
    });

}