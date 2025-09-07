"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

type Vehicle = {
  id: string | null;
  route_id: string | null;
  position?: { lat?: number; lon?: number; bearing?: number };
};

export default function VehiclesMap({ route }: { route: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:8000/vehicles?route=${route}`);
      const data = await res.json();
      setVehicles(data);
    }
    load();
    const t = setInterval(load, 10000); // refresh every 10s
    return () => clearInterval(t);
  }, [route]);

  return (
    <MapContainer center={[43.6532, -79.3832]} zoom={12} style={{ height: "60vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehicles.filter(v => v.position?.lat && v.position?.lon).map(v => (
        <Marker key={`${v.id}-${Math.random()}`} position={[v.position!.lat!, v.position!.lon!]}>
          <Popup>
            <div className="text-sm">
              <div><b>Route</b>: {v.route_id ?? "?"}</div>
              <div><b>Vehicle</b>: {v.id ?? "?"}</div>
              <div><b>Bearing</b>: {v.position?.bearing ?? "?"}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
