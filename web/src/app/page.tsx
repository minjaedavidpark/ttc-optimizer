"use client";

import { useEffect, useState } from "react";
import VehiclesMap from "../components/Map";

export default function Home() {
  const [route, setRoute] = useState("29");
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:8000/trip-updates?route=${route}`);
      setUpdates(await res.json());
    }
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [route]);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Toronto Transit Optimizer (MVP)</h1>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm">Route:</label>
        <input
          className="border rounded px-3 py-2"
          value={route}
          onChange={e => setRoute(e.target.value)}
          placeholder="e.g., 29"
        />
      </div>

      <VehiclesMap route={route} />

      <h2 className="text-xl font-semibold mt-6 mb-2">Trip updates</h2>
      <ul className="text-sm space-y-1">
        {updates.slice(0, 10).map((u, i) => (
          <li key={i} className="border rounded p-2">
            trip: <b>{u.trip_id ?? "?"}</b> — route: {u.route_id ?? "?"} — stop: {u.stop_id ?? "?"} — delay(s): {u.predicted_delay_sec ?? "?"}
          </li>
        ))}
      </ul>
    </main>
  );
}
