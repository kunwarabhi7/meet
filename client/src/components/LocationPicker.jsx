// components/LocationPicker.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng); // send to parent
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function LocationPicker({ setLocation }) {
  return (
    <MapContainer
      center={[28.6139, 77.209]} // Default to Delhi
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
  );
}
