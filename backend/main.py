# backend/main.py
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
import httpx
from google.transit import gtfs_realtime_pb2
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TTC Optimizer API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VEHICLES_URL = "https://bustime.ttc.ca/gtfsrt/vehicles"
TRIPS_URL = "https://bustime.ttc.ca/gtfsrt/trips"
ALERTS_URL = "https://bustime.ttc.ca/gtfsrt/alerts"

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/vehicles")
async def vehicles(route: str | None = Query(default=None, description="TTC route id, e.g., '29'")):
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(VEHICLES_URL)
        r.raise_for_status()
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(r.content)

    out = []
    for ent in feed.entity:
        if not ent.HasField("vehicle"):
            continue
        v = ent.vehicle
        rid = v.trip.route_id if v.HasField("trip") else None
        if route and rid != route:
            continue
        out.append({
            "id": v.vehicle.id if v.HasField("vehicle") else None,
            "route_id": rid,
            "trip_id": v.trip.trip_id if v.HasField("trip") else None,
            "position": {
                "lat": v.position.latitude if v.HasField("position") else None,
                "lon": v.position.longitude if v.HasField("position") else None,
                "bearing": v.position.bearing if v.HasField("position") else None
            },
            "timestamp": v.timestamp if v.HasField("timestamp") else None
        })
    return JSONResponse(out)

@app.get("/trip-updates")
async def trip_updates(route: str | None = None):
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(TRIPS_URL)
        r.raise_for_status()
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(r.content)

    out = []
    for ent in feed.entity:
        if not ent.HasField("trip_update"):
            continue
        tu = ent.trip_update
        rid = tu.trip.route_id if tu.HasField("trip") else None
        if route and rid != route:
            continue
        # summarize first stop-time-update if present
        stu = tu.stop_time_update[0] if len(tu.stop_time_update) else None
        delay = stu.arrival.delay if (stu and stu.HasField("arrival") and hasattr(stu.arrival, "delay")) else None
        out.append({
            "trip_id": tu.trip.trip_id if tu.HasField("trip") else None,
            "route_id": rid,
            "stop_id": stu.stop_id if stu else None,
            "predicted_delay_sec": delay,
            "timestamp": tu.timestamp if tu.HasField("timestamp") else None
        })
    return JSONResponse(out)
