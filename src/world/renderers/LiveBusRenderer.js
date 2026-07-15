import mapboxgl from "mapbox-gl";

export function renderLiveBus(
    map,
    coordinate,
    serviceNo
) {
    if (
        !Array.isArray(coordinate) ||
        coordinate.length !== 2
    ) {
        return null;
    }

    const [lng, lat] = coordinate;

    if (
        !Number.isFinite(lng) ||
        !Number.isFinite(lat) ||
        lng === 0 ||
        lat === 0
    ) {
        return null;
    }

    const busElement =
        document.createElement("div");

    busElement.textContent = "🚌";
    busElement.style.fontSize = "28px";
    busElement.style.cursor = "pointer";

    const marker = new mapboxgl.Marker({
        element: busElement,
        anchor: "center"
    })
        .setLngLat(coordinate)
        .setPopup(
            new mapboxgl.Popup({
                offset: 25
            }).setHTML(`
                <b>Bus ${serviceNo}</b>
                <br>
                Live LTA position
            `)
        )
        .addTo(map);

    return marker;
}

export function moveLiveBusSmoothly(
    marker,
    targetCoordinate,
    duration = 18000
) {
    if (
        !marker ||
        !Array.isArray(targetCoordinate) ||
        targetCoordinate.length !== 2
    ) {
        return;
    }

    const startPosition = marker.getLngLat();

    const startCoordinate = [
        startPosition.lng,
        startPosition.lat
    ];

    const startTime = performance.now();

    if (marker.animationFrame) {
        cancelAnimationFrame(
            marker.animationFrame
        );
    }

    function animate(currentTime) {
        const elapsed =
            currentTime - startTime;

        const progress = Math.min(
            elapsed / duration,
            1
        );

        // Makes the movement start and stop gently
        const smoothProgress =
            progress * progress *
            (3 - 2 * progress);

        const lng =
            startCoordinate[0] +
            (
                targetCoordinate[0] -
                startCoordinate[0]
            ) * smoothProgress;

        const lat =
            startCoordinate[1] +
            (
                targetCoordinate[1] -
                startCoordinate[1]
            ) * smoothProgress;

        marker.setLngLat([lng, lat]);

        if (progress < 1) {
            marker.animationFrame =
                requestAnimationFrame(animate);
        } else {
            marker.animationFrame = null;
        }
    }

    marker.animationFrame =
        requestAnimationFrame(animate);
}