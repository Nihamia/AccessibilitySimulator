export function renderRailways(map) {

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
    // MRT Platform
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