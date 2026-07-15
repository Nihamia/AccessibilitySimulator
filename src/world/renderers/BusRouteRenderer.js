import {
    renderLiveBus,
    moveLiveBusSmoothly
} from "./LiveBusRenderer";
import {
    renderMovingBus
} from "./BusSimulationRenderer";
import {
    buildRoadGraph,
    findNearestRoadNode,
    findShortestPath
} from "../routing/RoadNetwork";

export async function renderBusRoutes(map) {

    const roadGraph = buildRoadGraph();

    console.log(
        "Road graph ready:",
        Object.keys(roadGraph).length
    );

    try {

        const busStopsResponse = await fetch(
            "http://localhost:3000/api/busStops"
        );

        const busRoutesResponse = await fetch(
            "http://localhost:3000/api/busRoutes"
        );

        if (!busStopsResponse.ok) {
            throw new Error(
                `Bus stops request failed: ${busStopsResponse.status}`
            );
        }

        if (!busRoutesResponse.ok) {
            throw new Error(
                `Bus routes request failed: ${busRoutesResponse.status}`
            );
        }

        const busStops = await busStopsResponse.json();
        const busRoutes = await busRoutesResponse.json();

        console.log("Bus stops:", busStops.length);
        console.log("Bus routes:", busRoutes.length);


        // ==========================
        // Bus stop coordinate lookup
        // ==========================

        const stopLookup = {};

        busStops.forEach(stop => {

            stopLookup[stop.BusStopCode] = [
                stop.Longitude,
                stop.Latitude
            ];

        });


        // ==========================
        // TEST ROAD ROUTING
        // ==========================

        const testStops = Object.values(stopLookup);

        if (testStops.length >= 2) {

            const startCoordinate = testStops[0];
            const endCoordinate = testStops[1];

            console.log(
                "Test start coordinate:",
                startCoordinate
            );

            console.log(
                "Test end coordinate:",
                endCoordinate
            );

            const startNode = findNearestRoadNode(
                roadGraph,
                startCoordinate
            );

            const endNode = findNearestRoadNode(
                roadGraph,
                endCoordinate
            );

            console.log(
                "Start road node:",
                startNode
            );

            console.log(
                "End road node:",
                endNode
            );

            const testPath = findShortestPath(
                roadGraph,
                startNode,
                endNode
            );

            console.log(
                "Test road path:",
                testPath
            );

            console.log(
                "Test path nodes:",
                testPath.length
            );

        }


        // ==========================
        // Routes touching Clementi
        // ==========================

        const clementiRoutes = busRoutes.filter(route =>
            stopLookup[route.BusStopCode]
        );

        console.log(
            "Clementi route records:",
            clementiRoutes.length
        );


        // ==========================
        // Group by Service + Direction
        // ==========================

        const routeGroups = {};

        clementiRoutes.forEach(route => {

            const key =
                `${route.ServiceNo}-${route.Direction}`;

            if (!routeGroups[key]) {
                routeGroups[key] = [];
            }

            routeGroups[key].push(route);

        });

        console.log(
            "Route groups:",
            Object.keys(routeGroups)
        );


        // ==========================
        // Convert to GeoJSON
        // ==========================

        const features = [];

        Object.entries(routeGroups).forEach(
            ([key, routes]) => {

                routes.sort(
                    (a, b) =>
                        a.StopSequence - b.StopSequence
                );

        const stopCoordinates = routes
            .map(route =>
                stopLookup[route.BusStopCode]
            )
            .filter(Boolean);

        if (stopCoordinates.length < 2) {
            return;
        }


        // ==========================
        // Build road-following path
        // ==========================

        const coordinates = [];

        for (
            let index = 0;
            index < stopCoordinates.length - 1;
            index++
        ) {

            const startCoordinate =
                stopCoordinates[index];

            const endCoordinate =
                stopCoordinates[index + 1];

            const startNode = findNearestRoadNode(
                roadGraph,
                startCoordinate
            );

            const endNode = findNearestRoadNode(
                roadGraph,
                endCoordinate
            );

            const roadPath = findShortestPath(
                roadGraph,
                startNode,
                endNode
            );

            if (roadPath.length === 0) {

                console.warn(
                    `No road path for ${key}`,
                    startCoordinate,
                    endCoordinate
                );

                continue;

            }

            if (coordinates.length > 0) {
                roadPath.shift();
            }

            coordinates.push(...roadPath);

        }

        if (coordinates.length < 2) {
            return;
        }

                const [serviceNo, direction] =
                    key.split("-");

                features.push({

                    type: "Feature",

                    geometry: {
                        type: "LineString",
                        coordinates
                    },

                    properties: {
                        serviceNo,
                        direction
                    }

                });

            }
        );


        const routeGeoJson = {

            type: "FeatureCollection",

            features

        };

        console.log(
            "Drawable route lines:",
            features.length
        );

        if (features.length > 0) {
            const testRoute = features[0];

            console.log(
                "Tracking live bus route:",
                testRoute.properties
            );

            const serviceNo =
                testRoute.properties.serviceNo;

            const clementiStopCodes =
                Object.keys(stopLookup);

            let liveBusMarker = null;

            async function updateLiveBusPosition() {
                for (const busStopCode of clementiStopCodes) {
                    try {
                        const response = await fetch(
                            `http://localhost:3000/api/busArrival/${busStopCode}`
                        );

                        if (!response.ok) {
                            continue;
                        }

                        const arrivalData =
                            await response.json();

                        const service =
                            arrivalData.Services?.find(
                                item =>
                                    item.ServiceNo === serviceNo
                            );

                        if (!service) {
                            continue;
                        }

                        const buses = [
                            service.NextBus,
                            service.NextBus2,
                            service.NextBus3
                        ];

                        const liveBus = buses.find(bus => {
                            const lng =
                                Number(bus?.Longitude);

                            const lat =
                                Number(bus?.Latitude);

                            const monitored =
                                Number(bus?.Monitored);

                            return (
                                monitored === 1 &&
                                Number.isFinite(lng) &&
                                Number.isFinite(lat) &&
                                lng !== 0 &&
                                lat !== 0
                            );
                        });

                        if (!liveBus) {
                            continue;
                        }

                        const coordinate = [
                            Number(liveBus.Longitude),
                            Number(liveBus.Latitude)
                        ];

                            if (liveBusMarker) {
                                moveLiveBusSmoothly(
                                    liveBusMarker,
                                    coordinate
                                );
                            } else {
                            liveBusMarker = renderLiveBus(
                                map,
                                coordinate,
                                serviceNo
                            );
                        }

                        console.log(
                            "Live bus position updated:",
                            coordinate
                        );

                        // Stop after finding one valid live bus
                        return;
                    } catch (error) {
                        console.error(
                            `Failed to load live bus data for ${busStopCode}`,
                            error
                        );
                    }
                }

                console.warn(
                    `No monitored live position found for bus ${serviceNo}`
                );
            }

            // Get the first position immediately
            await updateLiveBusPosition();

            // Request a newer position every 20 seconds
            setInterval(
                updateLiveBusPosition,
                20000
            );
        }


        // ==========================
        // Add Mapbox source
        // ==========================

        map.addSource("busRoutes", {

            type: "geojson",

            data: routeGeoJson

        });


        // ==========================
        // Render route lines
        // ==========================

        map.addLayer({

            id: "bus-routes",

            type: "line",

            source: "busRoutes",

            layout: {

                "line-join": "round",

                "line-cap": "round"

            },

            paint: {

                "line-color": "#00e676",

                "line-width": 5,

                "line-opacity": 0.8

            }

        });

    } catch (error) {

        console.error(
            "Failed to render bus routes:",
            error
        );

    }

}