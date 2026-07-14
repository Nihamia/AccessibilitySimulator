const API_KEY = import.meta.env.VITE_LTA_API_KEY;

const BASE_URL = "https://datamall2.mytransport.sg/ltaodataservice";

export async function getBusStops() {
    const response = await fetch(`${BASE_URL}/BusStops`, {
        headers: {
            "AccountKey": API_KEY,
            "accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`LTA API Error: ${response.status}`);
    }

    return await response.json();
}