import mapboxgl from "mapbox-gl";

function calculateDistance(pointA, pointB) {

    const [lng1, lat1] = pointA;
    const [lng2, lat2] = pointB;

    const earthRadius = 6371000;

    const lat1Rad =
        lat1 * Math.PI / 180;

    const lat2Rad =
        lat2 * Math.PI / 180;

    const deltaLat =
        (lat2 - lat1) * Math.PI / 180;

    const deltaLng =
        (lng2 - lng1) * Math.PI / 180;

    const a =
        Math.sin(deltaLat / 2) *
        Math.sin(deltaLat / 2) +

        Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *

        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;

}


export function renderMovingBus(
    map,
    coordinates
) {

    if (
        !Array.isArray(coordinates) ||
        coordinates.length < 2
    ) {

        console.warn(
            "Not enough coordinates to animate bus"
        );

        return;

    }


    const busElement =
        document.createElement("div");

    busElement.innerHTML = "🚌";

    busElement.style.fontSize = "28px";

    busElement.style.cursor = "pointer";


    const busMarker = new mapboxgl.Marker({

        element: busElement,

        anchor: "center"

    })
        .setLngLat(coordinates[0])
        .addTo(map);


    let currentSegment = 0;

    let distanceTravelled = 0;

    let previousTimestamp = null;


    // metres per second
    const busSpeed = 8;


    function animate(timestamp) {

        if (previousTimestamp === null) {

            previousTimestamp = timestamp;

        }


        const deltaTime =
            (timestamp - previousTimestamp) / 1000;

        previousTimestamp = timestamp;


        if (
            currentSegment >=
            coordinates.length - 1
        ) {

            currentSegment = 0;

            distanceTravelled = 0;

            busMarker.setLngLat(
                coordinates[0]
            );

        }


        const start =
            coordinates[currentSegment];

        const end =
            coordinates[currentSegment + 1];


        const segmentDistance =
            calculateDistance(
                start,
                end
            );


        distanceTravelled +=
            busSpeed * deltaTime;


        while (
            distanceTravelled >= segmentDistance &&
            currentSegment <
            coordinates.length - 1
        ) {

            distanceTravelled -=
                segmentDistance;

            currentSegment++;


            if (
                currentSegment >=
                coordinates.length - 1
            ) {

                requestAnimationFrame(animate);

                return;

            }


            const nextStart =
                coordinates[currentSegment];

            const nextEnd =
                coordinates[currentSegment + 1];

            const nextDistance =
                calculateDistance(
                    nextStart,
                    nextEnd
                );


            if (nextDistance > 0) {

                break;

            }

        }


        if (
            currentSegment <
            coordinates.length - 1
        ) {

            const currentStart =
                coordinates[currentSegment];

            const currentEnd =
                coordinates[currentSegment + 1];


            const currentDistance =
                calculateDistance(
                    currentStart,
                    currentEnd
                );


            const progress =
                currentDistance === 0
                    ? 1
                    : distanceTravelled /
                    currentDistance;


            const lng =
                currentStart[0] +
                (
                    currentEnd[0] -
                    currentStart[0]
                ) * progress;


            const lat =
                currentStart[1] +
                (
                    currentEnd[1] -
                    currentStart[1]
                ) * progress;


            busMarker.setLngLat([
                lng,
                lat
            ]);

        }


        requestAnimationFrame(animate);

    }


    requestAnimationFrame(animate);

}