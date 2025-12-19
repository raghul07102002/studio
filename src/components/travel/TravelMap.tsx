'use client';
import 'leaflet/dist/leaflet.css';
import type { TravelEntry } from "@/lib/types";
import { getStateByCode } from "@/data/stateData";
import type { LatLngExpression, LatLngBoundsExpression } from "leaflet";
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';


// It's important to prevent this component from re-rendering unnecessarily
// as it deals with a non-React library (Leaflet)
// We manage the map instance imperatively.

interface RouteLayerProps {
  entries: TravelEntry[];
}

const RouteLayer = ({ entries }: RouteLayerProps) => {
    const map = useMap();
    const routeLayersRef = useRef<L.Layer[]>([]);

    useEffect(() => {
        // Clear existing routes
        routeLayersRef.current.forEach((layer) => {
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        });
        routeLayersRef.current = [];

        if (entries.length === 0) {
            map.setView([22.9734, 78.6569], 5);
            return;
        }

        const visitedStates = new Set<string>();
        const drawnRoutes: L.Layer[] = [];

        entries.forEach((entry) => {
        const from = getStateByCode(entry.fromState);
        const to = getStateByCode(entry.toState);

        if (from && to) {
            visitedStates.add(entry.fromState);
            visitedStates.add(entry.toState);

            const polyline = new L.Polyline([from.center as LatLngExpression, to.center as LatLngExpression], {
            color: `hsl(${(entries.indexOf(entry) * 40) % 360}, 70%, 50%)`,
            weight: 3,
            opacity: 0.8,
            dashArray: "8, 4",
            });
            polyline.addTo(map);
            drawnRoutes.push(polyline);
        }
        });

        visitedStates.forEach((code) => {
        const state = getStateByCode(code);
        if (state) {
            const marker = new L.CircleMarker(state.center as LatLngExpression, {
            radius: 8,
            fillColor: "hsl(var(--primary))",
            fillOpacity: 0.7,
            color: "hsl(var(--primary))",
            weight: 2,
            }).bindTooltip(state.name, { permanent: false, direction: "top" });
            
            marker.addTo(map);
            drawnRoutes.push(marker);
        }
        });

        routeLayersRef.current = drawnRoutes;

        if (visitedStates.size > 0) {
        const bounds: LatLngExpression[] = [];
        visitedStates.forEach((code) => {
            const state = getStateByCode(code);
            if (state) bounds.push(state.center as LatLngExpression);
        });
        if (bounds.length > 0) {
            map.fitBounds(bounds as LatLngBoundsExpression, { padding: [50, 50] });
        }
        }
        
        // Invalidate size to make sure tiles are loaded correctly after updates
        map.invalidateSize();

    }, [entries, map]);

    return null;
}


interface TravelMapProps {
  entries: TravelEntry[];
}

const TravelMap = ({ entries }: TravelMapProps) => {
  return (
    <MapContainer
      center={[22.9734, 78.6569]}
      zoom={5}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RouteLayer entries={entries} />
    </MapContainer>
  );
};

export default TravelMap;
