import mapboxgl from "mapbox-gl";
import { LANDMARKS } from "../landmarks";

export function renderLandmarks(map) {

    LANDMARKS.forEach((landmark) => {

        const marker = new mapboxgl.Marker()
            .setLngLat([landmark.lng, landmark.lat])
            .addTo(map);

        const popup = new mapboxgl.Popup({
            offset: 25
        }).setText(landmark.name);

        marker.setPopup(popup);

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