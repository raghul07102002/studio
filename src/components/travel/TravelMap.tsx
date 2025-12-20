
"use client";

import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TravelEntry, TravelMode } from "@/lib/types";
import ReactDOMServer from 'react-dom/server';

const createSvgIcon = (svg: string) => {
    return L.divIcon({
        html: svg,
        className: 'bg-background rounded-full p-1 shadow-md border border-primary/50',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

const icons: Record<TravelMode, L.DivIcon> = {
    car: createSvgIcon(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1 16v5c0 .6.4 1 1 1h2"/><path d="M14 17H9"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>`
    ),
    bike: createSvgIcon(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike"><path d="M4.5 10.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5S9 17 9 14.5s-2-4.5-4.5-4.5zM15 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="m15 12-3.5 4.5 4 4"/><path d="m18.5 4.5 4 4"/></svg>`
    ),
    bus: createSvgIcon(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`
    ),
    train: createSvgIcon(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-train-track"><path d="M2 17 17 2"/><path d="m2 14 8 8"/><path d="m5 11 8 8"/><path d="m8 8 8 8"/><path d="m11 5 8 8"/><path d="M14 2 22 10"/><path d="M7 22 22 7"/></svg>`
    ),
    flight: createSvgIcon(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`
    ),
    walk: createSvgIcon(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-footprints"><path d="M4 16v-2.38c0-1.47 1.2-2.69 2.69-2.69H9.5a2.5 2.5 0 0 1 2.5 2.5v1.88"/><path d="M10 17.5V22"/><path d="M13.5 12.12c1.47 0 2.69 1.22 2.69 2.69V17h-2.38a2.5 2.5 0 0 1-2.5-2.5V12"/><path d="M14 12V7.5"/><path d="M4.5 10.12c-1.47 0-2.69-1.22-2.69-2.69V5h2.38a2.5 2.5 0 0 1 2.5 2.5v2.62"/><path d="M7 10.5V6"/><circle cx="12" cy="4" r="2"/></svg>`
    ),
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
