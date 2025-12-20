
"use client";

import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TravelEntry, TravelMode } from "@/lib/types";
import { renderToStaticMarkup } from 'react-dom/server';
import { Car, Bike, Bus, Train, Plane, Footprints } from "lucide-react";

// Default icon for fallback, required by Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const createSvgIcon = (icon: React.ReactElement) => {
    const iconHtml = renderToStaticMarkup(icon);
    return L.divIcon({
        html: iconHtml,
        className: 'bg-primary text-primary-foreground rounded-full p-2 shadow-lg border-2 border-primary-foreground',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

const transportIcons: Record<TravelMode, L.DivIcon> = {
  car: createSvgIcon(<Car className="w-4 h-4" />),
  bike: createSvgIcon(<Bike className="w-4 h-4" />),
  bus: createSvgIcon(<Bus className="w-4 h-4" />),
  train: createSvgIcon(<Train className="w-4 h-4" />),
  flight: createSvgIcon(<Plane className="w-4 h-4" />),
  walk: createSvgIcon(<Footprints className="w-4 h-4" />),
};

const defaultIcon = transportIcons.car;

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
