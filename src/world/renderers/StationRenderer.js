export function renderStation(map) {

    map.addLayer({

        id: "station",

        type: "fill",

        source: "clementi",

        filter: [
            "==",
            ["get", "railway"],
            "station"
        ],

        paint: {
            "fill-color": "#1565c0",
            "fill-opacity": 0.5
        }

    });

}