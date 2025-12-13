# Smart Surveillance & Public Safety MVP

End-to-end demo: phone camera  Python frame capture  Hugging Face CLIP API  real-time React dashboard.

##  Project Structure

```
smart-surveillance-mvp/
 backend/
    main.py              # FastAPI server (POST /incident, GET /incidents, WS /ws)
    camera_detector.py   # Captures frames, queries CLIP, reports incidents
    requirements.txt      # Python dependencies
 frontend/
     src/
        App.jsx          # React dashboard (live incident list)
        App.css          # Modern dark theme
        index.css        # Global styles
     package.json         # Node dependencies
     vite.config.js       # Vite build config
```

##  Quick Start

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export CAMERA_URL="http://192.168.1.100:8080/video"  # IP Webcam or mjpeg-streamer URL
export BACKEND_URL="http://localhost:8000"
export HF_API_TOKEN="hf_YOUR_HUGGING_FACE_TOKEN"      # Get from huggingface.co
export CAMERA_ID="camera-1"

# Run FastAPI server (in one terminal)
python main.py
# OR with uvicorn:
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# In another terminal, run camera detector
python camera_detector.py
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run Vite dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

##  How It Works

### 1. Backend (`main.py`)
- **POST /incident**: Receives incident data from camera detector
- **GET /incidents**: Returns all stored incidents (in-memory, max 200)
- **WS /ws**: WebSocket for real-time dashboard updates
- Broadcasting: When an incident arrives, it's broadcast to all connected dashboards

### 2. Camera Detector (`camera_detector.py`)
- Streams video from IP Webcam (Android app or mjpeg-streamer)
- Captures frames at configurable intervals
- Encodes frames as base64 JPEG
- Queries Hugging Face CLIP API with violence-related labels:
  - **Violence labels**: violence, fight, aggressive, punch, kick, weapon, gun, knife, attack, injury
  - **Safe labels**: person talking, person sitting, person walking, safe, normal activity, no threat
- **Rule-based detection**: Incident if top label is violence-related AND confidence > 50%
- POSTs incidents to backend with frame preview

### 3. Frontend (React + Vite)
- Real-time WebSocket connection to backend
- Displays incident dashboard with:
  - Live stats (total, today, critical incidents)
  - Incident list with confidence scores
  - Frame previews (base64 JPEG)
  - Status indicator (connected/offline)

##  Camera Setup

### Option A: IP Webcam (Android)
1. Download "IP Webcam" from Google Play Store
2. Run app on phone, note the MJPEG URL (e.g., `http://192.168.1.100:8080/video`)
3. Set `CAMERA_URL` environment variable

### Option B: mjpeg-streamer (Linux/Raspberry Pi)
```bash
sudo apt-get install mjpeg-streamer
mjpeg_streamer -i "input_uvc.so -d /dev/video0" -o "output_http.so -p 8080"
# URL: http://localhost:8080/video
```

##  Hugging Face API Token

1. Sign up at [huggingface.co](https://huggingface.co)
2. Go to Settings  Access Tokens  Create New Token (read-only is fine)
3. Set environment variable:
   ```bash
   export HF_API_TOKEN="hf_YOUR_TOKEN"
   ```

##  API Endpoints

### POST /incident
```json
{
  "camera_id": "camera-1",
  "label": "violence",
  "confidence": 0.87,
  "summary": "Violence/aggression detected: violence",
  "frame": "data:image/jpeg;base64,...",
  "location": "Camera camera-1",
  "metadata": {
    "model": "openai/clip-vit-base-patch32",
    "threshold": 0.5
  }
}
```

### GET /incidents
Returns array of `Incident` objects with auto-generated `id` and `timestamp`.

### WS /ws
Real-time WebSocket. Server sends:
```json
{
  "type": "bootstrap",
  "items": [...]  // Initial incident backlog
}
```
Or when new incident arrives:
```json
{
  "type": "incident",
  "data": {...}   // Incident object
}
```

##  Configuration

All settings use environment variables (with defaults):

| Variable | Default | Description |
|----------|---------|-------------|
| `CAMERA_URL` | `http://192.168.1.100:8080/video` | IP Webcam stream URL |
| `BACKEND_URL` | `http://localhost:8000` | Backend server URL |
| `HF_API_TOKEN` | `` | Hugging Face API token (required) |
| `CAMERA_ID` | `camera-1` | Camera identifier |
| `CONFIDENCE_THRESHOLD` | `0.5` | Violence detection confidence threshold |
| `FRAME_INTERVAL` | `2` | Process every nth frame (reduce load) |

##  Production Notes

- **No database**: Incidents stored in-memory (resets on server restart)
- **No model training**: Uses pre-trained Hugging Face CLIP model
- **WebSocket-based**: Real-time updates, no polling
- **Base64 frames**: JPEG previews embedded in incidents (no storage)
- **CORS enabled**: Frontend can call backend from different origin

##  Troubleshooting

### Camera connection fails
- Check `CAMERA_URL` is reachable: `curl http://192.168.1.100:8080/video`
- Verify phone/device is on same network
- Check firewall rules

### CLIP API errors
- Verify `HF_API_TOKEN` is valid
- Check internet connection
- Rate limit: Wait a moment before retrying

### WebSocket offline
- Check backend is running (`http://localhost:8000/docs`)
- Verify frontend is connecting to correct backend URL
- Check firewall/proxy settings

##  Example Workflow

1. Start backend: `python main.py`
2. Start frontend: `npm run dev`
3. Start camera detector: `python camera_detector.py`
4. Open http://localhost:5173 in browser
5. Camera detector streams frames and detects incidents
6. Dashboard updates in real-time via WebSocket

##  MVP Scope

 End-to-end video streaming  
 AI-powered incident detection (CLIP)  
 Real-time dashboard updates (WebSocket)  
 In-memory incident storage  
 Frame previews with base64 encoding  
 Confidence-based filtering  
 Production-grade FastAPI + React code  

Future enhancements:
- Persistent database (PostgreSQL/MongoDB)
- Multi-camera support with geo-tagging
- Custom violence detection model
- Alert notifications (email/SMS)
- Video recording and archival
- Admin panel for incident review

---

**Built with FastAPI, React, Vite, OpenCV, and Hugging Face CLIP.**
