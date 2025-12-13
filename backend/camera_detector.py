"""
Camera detector script for Smart Surveillance MVP.

Connects to an IP Webcam stream, captures frames, sends to Hugging Face CLIP API,
detects violence/aggressive behavior, and reports incidents to the backend.
"""

import base64
import io
import json
import os
import time
from typing import Optional

import cv2
import httpx
import requests
from PIL import Image

# Configuration
CAMERA_URL = os.getenv("CAMERA_URL", "http://192.168.1.100:8080/video")
# Example: use IP Webcam app on Android or mjpeg-streamer
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "")
CAMERA_ID = os.getenv("CAMERA_ID", "camera-1")
CONFIDENCE_THRESHOLD = 0.5
FRAME_INTERVAL = 2  # Process every nth frame to reduce load

# Hugging Face CLIP model endpoint
HF_API_URL = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32"

# Violence/safety labels
VIOLENCE_LABELS = [
    "violence", "fight", "aggressive", "punch", "kick",
    "weapon", "gun", "knife", "attack", "injury"
]
SAFE_LABELS = [
    "person talking", "person sitting", "person walking", "safe",
    "normal activity", "no threat"
]


def query_clip_model(image_base64: str) -> dict:
    """
    Query Hugging Face CLIP API with an image and violence-related labels.
    
    Returns:
        {
            "labels": list of labels,
            "scores": list of confidence scores,
            "top_label": highest-confidence label,
            "top_score": confidence of top label
        }
    """
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {
        "inputs": {
            "image": image_base64,
            "candidate_labels": VIOLENCE_LABELS + SAFE_LABELS,
        }
    }
    
    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        result = response.json()
        
        # CLIP returns scores in order of candidate labels
        labels = payload["inputs"]["candidate_labels"]
        scores = result.get("scores", [])
        
        top_idx = scores.index(max(scores)) if scores else 0
        return {
            "labels": labels,
            "scores": scores,
            "top_label": labels[top_idx] if top_idx < len(labels) else "unknown",
            "top_score": scores[top_idx] if top_idx < len(scores) else 0.0,
        }
    except Exception as e:
        print(f"Error querying CLIP: {e}")
        return {
            "labels": VIOLENCE_LABELS + SAFE_LABELS,
            "scores": [0.0] * (len(VIOLENCE_LABELS) + len(SAFE_LABELS)),
            "top_label": "error",
            "top_score": 0.0,
        }


def detect_violence(clip_result: dict) -> bool:
    """
    Rule-based logic: check if top label is violence-related AND confidence is high.
    """
    top_label = clip_result["top_label"].lower()
    top_score = clip_result["top_score"]
    
    is_violence = any(v_label in top_label for v_label in VIOLENCE_LABELS)
    return is_violence and top_score >= CONFIDENCE_THRESHOLD


def frame_to_base64(frame) -> str:
    """Convert OpenCV frame to base64 JPEG string."""
    _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
    return base64.b64encode(buffer).decode("utf-8")


def report_incident(frame_base64: str, label: str, confidence: float, summary: str) -> Optional[dict]:
    """
    POST incident to backend /incident endpoint.
    """
    payload = {
        "camera_id": CAMERA_ID,
        "label": label,
        "confidence": float(confidence),
        "summary": summary,
        "frame": frame_base64,
        "location": f"Camera {CAMERA_ID}",
        "metadata": {
            "model": "openai/clip-vit-base-patch32",
            "threshold": CONFIDENCE_THRESHOLD,
        },
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/incident",
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
        print(f" Incident reported: {label} ({confidence:.2%})")
        return response.json()
    except Exception as e:
        print(f" Failed to report incident: {e}")
        return None


def stream_from_camera() -> None:
    """
    Main loop: capture frames from IP Webcam, detect violence, report incidents.
    """
    print(f"Connecting to camera at {CAMERA_URL}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Camera ID: {CAMERA_ID}")
    
    cap = cv2.VideoCapture(CAMERA_URL)
    if not cap.isOpened():
        print("ERROR: Could not open camera stream. Check CAMERA_URL.")
        return
    
    frame_count = 0
    start_time = time.time()
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("WARNING: Failed to read frame. Reconnecting...")
                cap.release()
                time.sleep(2)
                cap = cv2.VideoCapture(CAMERA_URL)
                continue
            
            frame_count += 1
            
            # Process every FRAME_INTERVAL-th frame
            if frame_count % FRAME_INTERVAL != 0:
                continue
            
            # Resize for faster processing
            resized = cv2.resize(frame, (640, 480))
            frame_b64 = frame_to_base64(resized)
            
            # Query CLIP model
            print(f"[Frame {frame_count}] Querying CLIP model...")
            clip_result = query_clip_model(frame_b64)
            
            # Check for violence
            if detect_violence(clip_result):
                summary = f"Violence/aggression detected: {clip_result['top_label']}"
                report_incident(
                    frame_base64=frame_b64,
                    label=clip_result["top_label"],
                    confidence=clip_result["top_score"],
                    summary=summary,
                )
            else:
                print(f"[Frame {frame_count}] Top label: {clip_result['top_label']} ({clip_result['top_score']:.2%}) - Safe")
            
            # Rate limiting
            time.sleep(0.5)
    
    except KeyboardInterrupt:
        print("\nShutdown signal received. Exiting...")
    finally:
        cap.release()
        elapsed = time.time() - start_time
        print(f"Processed {frame_count} frames in {elapsed:.1f} seconds")


if __name__ == "__main__":
    print("=" * 60)
    print("Smart Surveillance MVP - Camera Detector")
    print("=" * 60)
    stream_from_camera()
