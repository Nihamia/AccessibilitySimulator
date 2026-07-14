export function renderRoads(map) {

    map.addLayer({

        id: "roads",

        type: "line",

        source: "clementi",

        filter: [
            "match",
            ["get", "highway"],
            [
                "primary",
                "primary_link",
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

}