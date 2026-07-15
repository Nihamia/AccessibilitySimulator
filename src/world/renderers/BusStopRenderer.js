import mapboxgl from "mapbox-gl";

export async function renderBusStops(map) {
    try {
        const response = await fetch(
            "http://localhost:3000/api/busStops"
        );

        if (!response.ok) {
            throw new Error(
                `Bus stops request failed: ${response.status}`
            );
        }

        const busStops = await response.json();

        console.log(
            "Rendering bus stops:",
            busStops.length
        );

        busStops.forEach(stop => {
            let refreshInterval = null;

            const marker = new mapboxgl.Marker({
                color: "#2196F3"
            })
                .setLngLat([
                    stop.Longitude,
                    stop.Latitude
                ])
                .addTo(map);

            const popup = new mapboxgl.Popup({
                offset: 25,
                closeOnClick: false
            });

            async function loadArrivals() {
                try {
                    const response = await fetch(
                        `http://localhost:3000/api/busArrival/${stop.BusStopCode}`
                    );

                    if (!response.ok) {
                        throw new Error(
                            `Bus arrival request failed: ${response.status}`
                        );
                    }

                    const arrivals = await response.json();

                    let html = `
                        <h3>${stop.Description}</h3>
                        <b>Bus Stop ${stop.BusStopCode}</b>
                        <br>
                        ${stop.RoadName}
                        <hr>
                    `;

                    if (!Array.isArray(arrivals.Services)) {
                        html += "Unable to read bus services.";
                    } else if (arrivals.Services.length === 0) {
                        html += "No arrival information.";
                    } else {
                        arrivals.Services.forEach(service => {
                            const estimatedArrival =
                                service.NextBus?.EstimatedArrival;

                            let arrivalText = "No estimate";

                            if (estimatedArrival) {
                                const arrivalTime =
                                    new Date(estimatedArrival);

                                const differenceMs =
                                    arrivalTime - new Date();

                                const minutes = Math.floor(
                                    differenceMs / 60000
                                );

                                arrivalText =
                                    minutes <= 0
                                        ? "Arriving"
                                        : `${minutes} min`;
                            }

                            html += `
                                <div style="margin-bottom: 8px;">
                                    🚌
                                    <b>${service.ServiceNo}</b>
                                    — ${arrivalText}
                                </div>
                            `;
                        });
                    }

                    popup.setHTML(html);
                } catch (error) {
                    console.error(
                        "BUS TIMING ERROR:",
                        error
                    );

                    popup.setHTML(`
                        <h3>${stop.Description}</h3>
                        <div>Failed to load bus timings.</div>
                    `);
                }
            }

            marker.getElement().addEventListener(
                "click",
                async (event) => {
                    event.stopPropagation();


                    if (refreshInterval) {
                        clearInterval(refreshInterval);
                    }


                    popup
                        .setLngLat([
                            stop.Longitude,
                            stop.Latitude
                        ])
                        .setHTML("<b>Loading arrivals...</b>")
                        .addTo(map);
                    

                    await loadArrivals();

                    refreshInterval = setInterval(
                        loadArrivals,
                        20000
                    );
                }
            );

            popup.on("close", () => {
                if (refreshInterval) {
                    clearInterval(refreshInterval);
                    refreshInterval = null;
                }
            });
        });
    } catch (error) {
        console.error(
            "BUS STOP ERROR:",
            error
        );
    }
}