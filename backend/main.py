"""FastAPI backend for Smart Surveillance MVP."""
from __future__ import annotations

import asyncio
from collections import deque
from datetime import datetime, timezone
from typing import Any, Deque
from uuid import uuid4

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MAX_INCIDENTS = 200


class IncidentIn(BaseModel):
    """Incident data posted from camera detector."""
    camera_id: str
    label: str
    confidence: float
    summary: str
    frame: str | None = None
    location: str | None = None
    metadata: dict[str, Any] | None = None


class Incident(BaseModel):
    """Stored incident with auto-generated id and timestamp."""
    id: str = Field(default_factory=lambda: uuid4().hex)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    camera_id: str
    label: str
    confidence: float
    summary: str
    frame: str | None = None
    location: str | None = None
    metadata: dict[str, Any] | None = None


class WebSocketManager:
    """Manages WebSocket connections for real-time dashboard updates."""

    def __init__(self) -> None:
        self._connections: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, backlog: list[dict[str, Any]]) -> None:
        """Accept connection and send existing incidents."""
        await websocket.accept()
        async with self._lock:
            self._connections.add(websocket)
        await websocket.send_json({"type": "bootstrap", "items": backlog})

    async def disconnect(self, websocket: WebSocket) -> None:
        """Remove disconnected client."""
        async with self._lock:
            self._connections.discard(websocket)

    async def broadcast(self, payload: dict[str, Any]) -> None:
        """Send payload to all connected dashboards."""
        async with self._lock:
            targets = list(self._connections)
        for ws in targets:
            try:
                await ws.send_json(payload)
            except Exception:
                await self.disconnect(ws)


app = FastAPI(title="Smart Surveillance API", version="0.1.0")
manager = WebSocketManager()
incidents: Deque[Incident] = deque(maxlen=MAX_INCIDENTS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/incident", response_model=Incident)
async def create_incident(payload: IncidentIn) -> Incident:
    """Receive incident from camera detector and broadcast to dashboards."""
    incident = Incident(
        camera_id=payload.camera_id,
        label=payload.label,
        confidence=payload.confidence,
        summary=payload.summary,
        frame=payload.frame,
        location=payload.location,
        metadata=payload.metadata,
    )
    incidents.append(incident)
    await manager.broadcast({
        "type": "incident",
        "data": incident.model_dump(mode="json"),
    })
    return incident


@app.get("/incidents", response_model=list[Incident])
async def get_incidents() -> list[Incident]:
    """Fetch all stored incidents (max 200, in-memory)."""
    return list(incidents)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """WebSocket endpoint for real-time incident updates."""
    backlog = [inc.model_dump(mode="json") for inc in incidents]
    await manager.connect(websocket, backlog)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
