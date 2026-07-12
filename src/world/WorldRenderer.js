import mapboxgl from "mapbox-gl";
import { LANDMARKS } from "./landmarks";

export function addLandmarks(map) {

    LANDMARKS.forEach((landmark) => {

        // Create marker
        const marker = new mapboxgl.Marker()
            .setLngLat([landmark.lng, landmark.lat])
            .addTo(map);

        // Create popup
        const popup = new mapboxgl.Popup({
            offset: 25
        }).setText(landmark.name);

        marker.setPopup(popup);

        // Create label
        const label = document.createElement("div");
        label.className = "landmark-label";
        label.textContent = landmark.name;

        new mapboxgl.Marker({
            element: label,
            anchor: "top"
        })
            .setLngLat([landmark.lng, landmark.lat])
            .addTo(map);
    });

}