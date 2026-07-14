import clementi from "../../data/clementi.json";

const ROAD_TYPES = [
    "primary",
    "primary_link",
    "secondary",
    "tertiary",
    "residential",
    "service"
];

export function getRoadFeatures() {

    const roads = clementi.features.filter(feature => {

        const highway = feature.properties?.highway;
        const geometryType = feature.geometry?.type;

        return (
            ROAD_TYPES.includes(highway) &&
            geometryType === "LineString"
        );

    });

    console.log(
        "Road features found:",
        roads.length
    );

    return roads;
}


function createNodeKey(coordinate) {

    const [lng, lat] = coordinate;

    return `${lng},${lat}`;

}


function calculateDistance(pointA, pointB) {

    const [lng1, lat1] = pointA;
    const [lng2, lat2] = pointB;

    const dx = lng2 - lng1;
    const dy = lat2 - lat1;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


export function buildRoadGraph() {

    const roads = getRoadFeatures();

    const graph = {};

    roads.forEach(road => {

        const coordinates =
            road.geometry.coordinates;

        const oneway =
            road.properties?.oneway;

        const isOneWay =
            oneway === "yes" ||
            oneway === "1" ||
            oneway === true;

        for (
            let index = 0;
            index < coordinates.length - 1;
            index++
        ) {

            const currentCoordinate =
                coordinates[index];

            const nextCoordinate =
                coordinates[index + 1];

            const currentKey =
                createNodeKey(currentCoordinate);

            const nextKey =
                createNodeKey(nextCoordinate);

            const distance = calculateDistance(
                currentCoordinate,
                nextCoordinate
            );

            if (!graph[currentKey]) {

                graph[currentKey] = {
                    coordinate: currentCoordinate,
                    neighbours: []
                };

            }

            if (!graph[nextKey]) {

                graph[nextKey] = {
                    coordinate: nextCoordinate,
                    neighbours: []
                };

            }

            graph[currentKey].neighbours.push({
                node: nextKey,
                distance
            });

            if (!isOneWay) {

                graph[nextKey].neighbours.push({
                    node: currentKey,
                    distance
                });

            }

        }

    });

    console.log(
        "Road graph nodes:",
        Object.keys(graph).length
    );

    return graph;
}


export function findNearestRoadNode(
    graph,
    coordinate
) {

    let nearestNode = null;
    let nearestDistance = Infinity;

    Object.entries(graph).forEach(
        ([nodeKey, node]) => {

            const distance = calculateDistance(
                coordinate,
                node.coordinate
            );

            if (distance < nearestDistance) {

                nearestDistance = distance;
                nearestNode = nodeKey;

            }

        }
    );

    return nearestNode;
}


export function findShortestPath(
    graph,
    startNode,
    endNode
) {

    const distances = {};
    const previous = {};

    const unvisited = new Set(
        Object.keys(graph)
    );

    Object.keys(graph).forEach(nodeKey => {

        distances[nodeKey] = Infinity;
        previous[nodeKey] = null;

    });

    distances[startNode] = 0;

    while (unvisited.size > 0) {

        let currentNode = null;
        let smallestDistance = Infinity;

        unvisited.forEach(nodeKey => {

            if (
                distances[nodeKey] <
                smallestDistance
            ) {

                smallestDistance =
                    distances[nodeKey];

                currentNode = nodeKey;

            }

        });

        if (
            currentNode === null ||
            smallestDistance === Infinity
        ) {

            break;

        }

        if (currentNode === endNode) {
            break;
        }

        unvisited.delete(currentNode);

        graph[currentNode].neighbours.forEach(
            neighbour => {

                if (
                    !unvisited.has(neighbour.node)
                ) {
                    return;
                }

                const newDistance =
                    distances[currentNode] +
                    neighbour.distance;

                if (
                    newDistance <
                    distances[neighbour.node]
                ) {

                    distances[neighbour.node] =
                        newDistance;

                    previous[neighbour.node] =
                        currentNode;

                }

            }
        );

    }

    if (
        distances[endNode] === Infinity
    ) {

        return [];

    }

    const path = [];

    let currentNode = endNode;

    while (currentNode !== null) {

        path.unshift(
            graph[currentNode].coordinate
        );

        currentNode =
            previous[currentNode];

    }

    return path;
}