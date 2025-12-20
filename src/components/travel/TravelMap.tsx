
"use client";

import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TravelEntry, TravelMode } from "@/lib/types";

const ICON_SIZE = 32;

const base = {
  iconSize: [ICON_SIZE, ICON_SIZE] as [number, number],
  iconAnchor: [ICON_SIZE / 2, ICON_SIZE] as [number, number],
  popupAnchor: [0, -ICON_SIZE] as [number, number],
  shadowUrl: "/map-icons/shadow.png",
  shadowSize: [40, 40] as [number, number],
  shadowAnchor: [20, 38] as [number, number],
};

const transportIcons: Record<TravelMode, L.Icon> = {
  car: L.icon({ ...base, iconUrl: "/map-icons/car.png" }),
  bike: L.icon({ ...base, iconUrl: "/map-icons/bike.png" }),
  bus: L.icon({ ...base, iconUrl: "/map-icons/bus.png" }),
  train: L.icon({ ...base, iconUrl: "/map-icons/train.png" }),
  flight: L.icon({ ...base, iconUrl: "/map-icons/flight.png" }),
  walk: L.icon({ ...base, iconUrl: "/map-icons/walk.png" }),
};


const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});


type TravelMapProps = {
  entries: TravelEntry[];
};

export default function TravelMap({ entries }: TravelMapProps) {
    const segments = entries.map(e => ({
        path: [ [e.from.coords.lat, e.from.coords.lng], [e.to.coords.lat, e.to.coords.lng] ] as [number, number][],
        mode: e.mode
    }));

    const allCoords = entries.flatMap(e => [e.from.coords, e.to.coords]).filter(c => c && c.lat && c.lng);

    const bounds = allCoords.length > 0
        ? new L.LatLngBounds(allCoords.map(c => [c.lat, c.lng]))
        : undefined;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden bg-white">
      <MapContainer
        key={JSON.stringify(entries.map(e => e.id))} // Force re-render when entries change
        center={allCoords.length > 0 ? [allCoords[0].lat, allCoords[0].lng] : [22.9734, 78.6569]}
        bounds={bounds}
        zoom={allCoords.length > 0 ? undefined : 5}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {segments.map((segment, idx) => (
            <Polyline key={idx} positions={segment.path} color="#14b8a6" weight={3}/>
        ))}

        {entries.map((entry, idx) => (
            <Marker key={`marker-to-${entry.id}`} position={[entry.to.coords.lat, entry.to.coords.lng]} icon={transportIcons[entry.mode] || defaultIcon} />
        ))}
         {entries.length > 0 && (
          <Marker 
            key={`marker-from-${entries[0].id}`} 
            position={[entries[0].from.coords.lat, entries[0].from.coords.lng]} 
            icon={transportIcons[entries[0].mode] || defaultIcon} 
          />
        )}
      </MapContainer>
    </div>
  );
}
