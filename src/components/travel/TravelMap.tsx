
"use client";

import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TravelEntry } from "@/lib/types";
import { Bike, Bus, Car, Plane, Train, Walk } from "lucide-react";
import ReactDOMServer from 'react-dom/server';

const createIcon = (IconComponent: React.FC<any>) => {
    return L.divIcon({
        html: ReactDOMServer.renderToString(<IconComponent className="text-primary" />),
        className: 'bg-background rounded-full p-1 shadow-md border',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const icons = {
    bike: createIcon(Bike),
    car: createIcon(Car),
    bus: createIcon(Bus),
    train: createIcon(Train),
    flight: createIcon(Plane),
    walk: createIcon(Walk),
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
            <Marker key={`marker-to-${entry.id}`} position={[entry.to.coords.lat, entry.to.coords.lng]} icon={icons[entry.mode] || defaultIcon} />
        ))}
         {entries.length > 0 && (
          <Marker 
            key={`marker-from-${entries[0].id}`} 
            position={[entries[0].from.coords.lat, entries[0].from.coords.lng]} 
            icon={icons[entries[0].mode] || defaultIcon} 
          />
        )}
      </MapContainer>
    </div>
  );
}
