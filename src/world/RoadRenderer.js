export function addRoadLayer(map) {
    map.addLayer({
        id: "roads",

        type: "line",

        source: "clementi",

        filter: [
            "all",

            ["==", "$type", "LineString"],

            [
                "match",
                ["get", "highway"],

                [
                    "motorway",
                    "trunk",
                    "primary",
                    "secondary",
                    "tertiary",
                    "residential",
                    "service"
                ],

                true,
                false
            ]
        ],

        paint: {
            "line-color": "#444444",

            "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                17, 2,
                20, 8
            ]
        }
    });
}