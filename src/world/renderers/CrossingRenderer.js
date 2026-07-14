export function renderCrossings(map) {

    map.addLayer({

        id: "crossing",

        type: "circle",

        source: "clementi",

        filter: [
            "any",

            [
                "==",
                ["get", "highway"],
                "crossing"
            ],

            [
                "has",
                "crossing"
            ]
        ],

        paint: {
            "circle-radius": 8,
            "circle-color": "#ff0000",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2
        }

    });

}