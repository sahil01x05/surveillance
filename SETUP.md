# SETUP INSTRUCTIONS

## Directory Structure Ready 

```
c:\Users\Faith\OneDrive\Desktop\servilance\
 backend/
    main.py                    # FastAPI server (3773 bytes)
    camera_detector.py         # Camera stream processor (6475 bytes)
    requirements.txt           # Python dependencies

 frontend/
    src/
       App.jsx               # React dashboard (completely rewritten)
       App.css               # Modern dark theme with gradients
       index.css             # Global styles
    package.json              # Already has React 19 + Vite
    (other config files)

 README.md                       # Complete documentation
```

## Backend Setup (Windows PowerShell)

### 1. Create Python Virtual Environment
```powershell
cd c:\Users\Faith\OneDrive\Desktop\servilance\backend
python -m venv venv
venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Set Environment Variables
```powershell
$env:CAMERA_URL = "http://192.168.1.100:8080/video"  # Replace with your IP Webcam URL
$env:HF_API_TOKEN = "hf_YOUR_TOKEN"                  # Get from huggingface.co
$env:BACKEND_URL = "http://localhost:8000"
$env:CAMERA_ID = "camera-1"
```

### 4. Run Backend
```powershell
python main.py
# Or with uvicorn for auto-reload:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: **http://localhost:8000**
API docs: **http://localhost:8000/docs**

---

## Camera Setup

### Option 1: IP Webcam (Android Phone)
1. Download "IP Webcam" from Google Play Store
2. Run on phone, click "Start server"
3. Note the URL (e.g., http://192.168.1.100:8080)
4. Set `CAMERA_URL` to that URL

### Option 2: Test Mock Camera
If no camera available, modify `camera_detector.py` to use video file:
```python
cap = cv2.VideoCapture("test_video.mp4")  # Instead of URL
```

---

## Frontend Setup

### 1. Install Node Dependencies
```powershell
cd c:\Users\Faith\OneDrive\Desktop\servilance\frontend
npm install
```

### 2. Run Vite Dev Server
```powershell
npm run dev
```

The dashboard will be available at: **http://localhost:5173**

---

## Run Camera Detector (Third Terminal)

### 1. Activate Backend Venv
```powershell
cd c:\Users\Faith\OneDrive\Desktop\servilance\backend
venv\Scripts\Activate.ps1
```

### 2. Set Environment Variables
```powershell
$env:CAMERA_URL = "http://192.168.1.100:8080/video"
$env:HF_API_TOKEN = "hf_YOUR_TOKEN"
$env:BACKEND_URL = "http://localhost:8000"
```

### 3. Run Detector
```powershell
python camera_detector.py
```

---

## Hugging Face API Token Setup

1. Go to https://huggingface.co
2. Sign up or log in
3. Click your profile  Settings
4. Navigate to "Access Tokens"
5. Create new token (read-only fine)
6. Copy token and set as `HF_API_TOKEN`

---

## Complete Demo Workflow

### Terminal 1 (Backend)
```powershell
cd backend
venv\Scripts\Activate.ps1
$env:HF_API_TOKEN = "hf_YOUR_TOKEN"
python main.py
```
 Backend running at http://localhost:8000

### Terminal 2 (Frontend)
```powershell
cd frontend
npm run dev
```
 Dashboard running at http://localhost:5173

### Terminal 3 (Camera Detector)
```powershell
cd backend
venv\Scripts\Activate.ps1
$env:CAMERA_URL = "http://192.168.1.100:8080/video"
$env:HF_API_TOKEN = "hf_YOUR_TOKEN"
python camera_detector.py
```
 Streaming frames and detecting incidents

### Browser
Open http://localhost:5173  See incidents appear in real-time as camera detects them!

---

## Project Summary

 **Backend (FastAPI)**
   - POST /incident: Receive incidents from detector
   - GET /incidents: Fetch all incidents
   - WS /ws: Real-time WebSocket streaming
   - In-memory storage (max 200 incidents)
   - CORS enabled for frontend

 **Camera Detector (Python)**
   - Connects to IP Webcam stream
   - Captures frames at intervals
   - Sends to Hugging Face CLIP API
   - Detects violence (confidence-based)
   - Reports to backend with base64 frame

 **Frontend (React + Vite)**
   - Modern dark purple theme
   - Live incident dashboard
   - Real-time updates via WebSocket
   - Responsive grid layout
   - Expandable frame previews
   - Status indicator (connected/offline)

 **Tech Stack**
   - Backend: FastAPI + Uvicorn + Pydantic
   - Frontend: React 19 + Vite
   - AI: Hugging Face CLIP (openai/clip-vit-base-patch32)
   - Video: OpenCV + MJPEG streams
   - Real-time: WebSockets
   - Styling: CSS3 with gradients

---

## Troubleshooting

**Camera won't connect:**
- Verify phone/device on same Wi-Fi network
- Test URL in browser: http://192.168.1.100:8080/video
- Check firewall settings

**CLIP API 403 error:**
- Verify HF_API_TOKEN is valid
- Go to huggingface.co to check token

**WebSocket offline on dashboard:**
- Make sure backend is running (`http://localhost:8000/docs`)
- Check browser console for errors
- Verify CORS is working

**pip install fails:**
- Ensure Python 3.8+ is installed
- Try: `pip install --upgrade pip setuptools wheel`
- May need: `pip install opencv-python-headless` instead of `opencv-python` on servers

---

## Files Generated

- `backend/main.py` (163 lines) - FastAPI application
- `backend/camera_detector.py` (261 lines) - Video stream processor
- `backend/requirements.txt` - 7 Python dependencies
- `frontend/src/App.jsx` (163 lines) - React dashboard component
- `frontend/src/App.css` (310 lines) - Component styles
- `frontend/src/index.css` (60 lines) - Global styles
- `README.md` - Full documentation

**Total: Production-quality MVP with ~800 lines of code**

---

Happy surveillance! 
