# Smart Surveillance MVP - Demo Startup Script
# This script helps you start all components of the surveillance system

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Smart Surveillance MVP - Demo Setup  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend/main.py")) {
    Write-Host "ERROR: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "STEP 1: Environment Setup" -ForegroundColor Yellow
Write-Host "Please ensure you have set these environment variables:" -ForegroundColor White
Write-Host "  - CAMERA_URL (e.g., http://192.168.1.100:8080/video)" -ForegroundColor Gray
Write-Host "  - HF_API_TOKEN (from huggingface.co)" -ForegroundColor Gray
Write-Host "  - BACKEND_URL (default: http://localhost:8000)" -ForegroundColor Gray
Write-Host "  - CAMERA_ID (default: camera-1)" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "Have you set up environment variables? (y/n)"
if ($continue -ne "y") {
    Write-Host ""
    Write-Host "Setting example environment variables..." -ForegroundColor Yellow
    $env:BACKEND_URL = "http://localhost:8000"
    $env:CAMERA_ID = "camera-1"
    Write-Host "  BACKEND_URL = $env:BACKEND_URL" -ForegroundColor Green
    Write-Host "  CAMERA_ID = $env:CAMERA_ID" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: You still need to set:" -ForegroundColor Red
    Write-Host "  `$env:CAMERA_URL = 'http://YOUR_PHONE_IP:8080/video'" -ForegroundColor Yellow
    Write-Host "  `$env:HF_API_TOKEN = 'hf_YOUR_TOKEN_HERE'" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "STEP 2: Install Dependencies" -ForegroundColor Yellow
Write-Host "Choose installation method:" -ForegroundColor White
Write-Host "  1. Install both backend and frontend" -ForegroundColor Gray
Write-Host "  2. Install backend only (Python)" -ForegroundColor Gray
Write-Host "  3. Install frontend only (Node.js)" -ForegroundColor Gray
Write-Host "  4. Skip installation (already installed)" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
        Push-Location backend
        if (-not (Test-Path "venv")) {
            python -m venv venv
        }
        .\venv\Scripts\Activate.ps1
        pip install -r requirements.txt
        Pop-Location
        
        Write-Host ""
        Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
        Push-Location frontend
        npm install
        Pop-Location
    }
    "2" {
        Write-Host ""
        Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
        Push-Location backend
        if (-not (Test-Path "venv")) {
            python -m venv venv
        }
        .\venv\Scripts\Activate.ps1
        pip install -r requirements.txt
        Pop-Location
    }
    "3" {
        Write-Host ""
        Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
        Push-Location frontend
        npm install
        Pop-Location
    }
}

Write-Host ""
Write-Host "STEP 3: Start Components" -ForegroundColor Yellow
Write-Host "The system requires 3 separate terminal windows:" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 1 (Backend API):" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor Gray
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "  python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 (Frontend Dashboard):" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 3 (Camera Detector):" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor Gray
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "  python camera_detector.py" -ForegroundColor Gray
Write-Host ""
Write-Host "QUICK START COMMAND (run each in separate terminals):" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Terminal 1" -ForegroundColor Green
Write-Host "cd backend; .\venv\Scripts\Activate.ps1; python main.py" -ForegroundColor White
Write-Host ""
Write-Host "# Terminal 2" -ForegroundColor Green
Write-Host "cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "# Terminal 3" -ForegroundColor Green
Write-Host "cd backend; .\venv\Scripts\Activate.ps1; python camera_detector.py" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "After all components are running:" -ForegroundColor Yellow
Write-Host "  Open browser: http://localhost:5173" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
