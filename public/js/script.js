const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Sending location:", { latitude, longitude });
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

// Initialize Leaflet map
const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Store markers by client ID
const markers = {};

// Listen for location updates
socket.on("receive-location", (data) => {
    console.log("Updating map with data:", data);
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        // Update marker position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    // Center map on the last received location
    map.setView([latitude, longitude], 15);
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
