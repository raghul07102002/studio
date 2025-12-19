"use client";

import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// This is to fix the default icon issue with leaflet in React
const DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

type TravelMapProps = {
  entries: {
    lat: number;
    lng: number;
  }[];
};

export default function TravelMap({ entries }: TravelMapProps) {
  const path = entries.map(e => [e.lat, e.lng]) as [number, number][];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden bg-white">
      <MapContainer
        key={JSON.stringify(path)} // Force re-render when path changes to update bounds
        center={path.length > 0 ? path[0] : [22.9734, 78.6569]}
        bounds={path.length > 1 ? path : undefined}
        zoom={path.length > 0 ? undefined : 5}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {path.length > 0 && (
          <>
            <Polyline positions={path} color="#14b8a6" weight={3}/>
            {path.map((pos, idx) => (
              <Marker key={idx} position={pos} />
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
