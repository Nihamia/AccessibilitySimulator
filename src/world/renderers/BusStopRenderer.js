import mapboxgl from "mapbox-gl";

export async function renderBusStops(map) {

    try {

        const response = await fetch("http://localhost:3000/api/busStops");

        const busStops = await response.json();

        console.log(`Rendering ${busStops.length} bus stops`);

        busStops.forEach(stop => {

            const marker = new mapboxgl.Marker({
                color: "#2196F3"
            })
                .setLngLat([stop.Longitude, stop.Latitude])
                .addTo(map);

            marker.getElement().addEventListener("click", async () => {

                console.log(`Loading arrivals for ${stop.BusStopCode}...`);
        

                const response = await fetch(
                    `http://localhost:3000/api/busArrival/${stop.BusStopCode}`
                );

                const arrivals = await response.json();
                let html = `
                <h3>${stop.Description}</h3>
                <b>Bus Stop ${stop.BusStopCode}</b><br>
                ${stop.RoadName}
                <hr>
                `;
                arrivals.Services.forEach(service => {

                    const arrivalTime = new Date(service.NextBus.EstimatedArrival);
                    const now = new Date();

                    const minutes = Math.max(
                        0,
                        Math.round((arrivalTime - now) / 60000)
                    );

                    html += `
                        <div style="margin-bottom:8px;">
                            🚌 <b>${service.ServiceNo}</b>
                            - ${minutes === 0 ? "Arriving" : `${minutes} min`}
                        </div>
                    `;

                });
                new mapboxgl.Popup({
                    offset: 25
                })
                .setLngLat([stop.Longitude, stop.Latitude])
                .setHTML(html)
                .addTo(map);

                console.log(arrivals);

            });

        });


    } catch (error) {

        console.error("Failed to load bus stops:", error);

    }

}