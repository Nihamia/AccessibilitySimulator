import mapboxgl from "mapbox-gl";

export async function renderBusStops(map) {

    try {

        const response = await fetch("http://localhost:3000/api/busStops");

        const busStops = await response.json();

        console.log(`Rendering ${busStops.length} bus stops`);

        busStops.forEach(stop => {

            new mapboxgl.Marker({
                color: "#2196F3"
            })
            .setLngLat([stop.Longitude, stop.Latitude])
            .setPopup(
                new mapboxgl.Popup().setHTML(`
                    <b>${stop.Description}</b><br>
                    Bus Stop: ${stop.BusStopCode}<br>
                    ${stop.RoadName}
                `)
            )
            .addTo(map);

        });

    } catch (error) {

        console.error("Failed to load bus stops:", error);

    }

}