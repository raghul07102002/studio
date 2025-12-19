'use client';
import { useEffect, useRef, memo } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { TravelEntry } from "@/lib/types";
import { getStateByCode, indianStates } from "@/data/stateData";
import type { LatLngExpression, LatLngBoundsExpression } from "leaflet";
import L from 'leaflet';

interface TravelMapProps {
  entries: TravelEntry[];
}

const RouteLayer = ({ entries }: { entries: TravelEntry[] }) => {
  const map = useMap();
  const routeLayersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    // Clear existing routes and markers
    routeLayersRef.current.forEach((layer) => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    routeLayersRef.current = [];

    if (entries.length === 0) {
      map.setView([22.9734, 78.6569], 5);
      return;
    };

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const visitedStates = new Set<string>();
    const drawnRoutes: L.Layer[] = [];

    sortedEntries.forEach((entry) => {
      const from = getStateByCode(entry.fromState);
      const to = getStateByCode(entry.toState);

      if (from && to) {
        visitedStates.add(entry.fromState);
        visitedStates.add(entry.toState);
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

    entries.forEach((entry, index) => {
        const from = getStateByCode(entry.fromState);
        const to = getStateByCode(entry.toState);
        if(from && to) {
            const polyline = new L.Polyline([from.center as LatLngExpression, to.center as LatLngExpression], {
                color: `hsl(${(index * 40) % 360}, 70%, 50%)`,
                weight: 3,
                opacity: 0.8,
                dashArray: "8, 4",
            });
            polyline.addTo(map);
            drawnRoutes.push(polyline);
        }
    })


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

    return () => {
      routeLayersRef.current.forEach((layer) => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [entries, map]);

  return null;
};

const MemoizedRouteLayer = memo(RouteLayer);

const TravelMap = ({ entries }: TravelMapProps) => {
  return (
    <MapContainer
      center={[22.9734, 78.6569]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {indianStates.map((state) => (
        <CircleMarker
          key={state.code}
          center={state.center as LatLngExpression}
          pathOptions={{
            radius: 4,
            fillColor: "hsl(var(--muted-foreground))",
            fillOpacity: 0.3,
            color: "hsl(var(--border))",
            weight: 1,
          }}
        >
          <Tooltip direction="top">{state.name}</Tooltip>
        </CircleMarker>
      ))}
      <MemoizedRouteLayer entries={entries} />
    </MapContainer>
  );
};

export default TravelMap;
