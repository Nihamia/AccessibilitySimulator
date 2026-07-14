export function renderElevators(map) {

    map.addLayer({

        id: "elevator",

        type: "circle",

        source: "clementi",

        filter: [
            "==",
            ["get", "highway"],
            "elevator"
        ],

        paint: {
            "circle-radius": 6,
            "circle-color": "#00BCD4"
        }

    });

}