# 📱 IP Webcam Setup Guide

## Quick Start

### 1️⃣ Install IP Webcam App

**For Android:**
- Download **"IP Webcam"** by Pavel Khlebovich from Google Play Store
- It's free and has millions of downloads

**For iOS:**
- Download **"IP Camera Lite"** or **"EpocCam"** from App Store

### 2️⃣ Start the Camera Server

1. Open the IP Webcam app on your phone
2. Scroll to the bottom
3. Tap **"Start server"**
4. The app will show you an IP address like: `http://192.168.1.50:8080`

### 3️⃣ Verify Connection (Important!)

**Check Same Network:**
- Your phone and computer **MUST** be on the same WiFi network
- Turn off mobile data on your phone to ensure WiFi is used

**Test in Browser:**
1. On your computer, open a web browser
2. Go to the IP address shown in the app (e.g., `http://192.168.1.50:8080`)
3. You should see the IP Webcam control page with video preview
4. If it doesn't work, your devices are on different networks

### 4️⃣ Configure the Application

**In PowerShell, set the environment variable:**

```powershell
# Replace with YOUR phone's IP address from step 2
$env:CAMERA_URL = "http://192.168.1.50:8080/video"

# Example for different IP:
# $env:CAMERA_URL = "http://10.0.0.25:8080/video"
```

**Important Notes:**
- The URL must end with `/video` (not `/videos`)
- Use the exact IP address shown in your IP Webcam app
- Port is usually `8080`

### 5️⃣ Test Your Connection

Run the test script before starting the camera detector:

```powershell
cd backend
python test_camera.py
```

This will verify:
- ✅ Server is reachable
- ✅ Video endpoint is working
- ✅ OpenCV can capture frames

---

## Common Issues & Solutions

### ❌ "Connection refused" or "Connection timed out"

**Causes:**
- IP Webcam app is not running
- Wrong IP address
- Devices on different WiFi networks
- Firewall blocking connection

**Solutions:**
1. Make sure IP Webcam server is started (shows "Stop server" button)
2. Verify the IP address in the app matches your CAMERA_URL
3. Both devices must be on the **same WiFi network**
4. Try disabling Windows Firewall temporarily
5. Restart the IP Webcam app

### ❌ "Failed to open video stream"

**Causes:**
- Wrong endpoint path
- Camera already in use by another app

**Solutions:**
1. Make sure URL ends with `/video` not `/videos`
2. Try alternative endpoints:
   - `http://YOUR_IP:8080/video/mjpeg`
   - `http://YOUR_IP:8080/shot.jpg`
3. Close other apps that might be using the camera
4. Restart the IP Webcam app

### ❌ Can't find phone's IP address

**Solution:**
1. In IP Webcam app, the IP is displayed when server is running
2. Or on Android: Settings → WiFi → Tap your network → Advanced
3. Or use a network scanner app

### ❌ IP address keeps changing

**Solution:**
1. In your router settings, assign a **static IP** to your phone
2. Or reconnect to WiFi before starting IP Webcam each time
3. Update the `CAMERA_URL` environment variable when IP changes

---

## Alternative Methods

### Option 1: Use Phone's Hotspot

If you can't get same WiFi working:
1. Enable hotspot on your phone
2. Connect your computer to the phone's hotspot
3. The IP will typically be `192.168.43.1:8080`
4. Set: `$env:CAMERA_URL = "http://192.168.43.1:8080/video"`

### Option 2: Use USB Connection (Android only)

Some IP Webcam alternatives support USB:
1. Install **DroidCam** instead
2. Connect phone via USB
3. DroidCam provides a local webcam device

### Option 3: Use Built-in Webcam

For testing without a phone:
1. Set CAMERA_URL to `0` (uses default webcam)
2. Or `$env:CAMERA_URL = "0"`

---

## IP Webcam Endpoints Reference

The IP Webcam app provides multiple endpoints:

| Endpoint | Purpose | Use Case |
|----------|---------|----------|
| `/video` | MJPEG stream | Best for OpenCV (default) |
| `/video/mjpeg` | Alternative MJPEG | Try if `/video` fails |
| `/shot.jpg` | Single snapshot | For still images |
| `/videofeed` | Browser view | Web interface only |

**For this project, use `/video`**

---

## Verification Checklist

Before running `camera_detector.py`:

- [ ] IP Webcam app installed and running
- [ ] Server started (shows IP address in app)
- [ ] Both devices on same WiFi network
- [ ] Browser can access `http://YOUR_IP:8080`
- [ ] Can see video feed in browser
- [ ] `CAMERA_URL` environment variable set correctly
- [ ] `test_camera.py` passes all tests
- [ ] `HF_API_TOKEN` environment variable set

---

## Quick Test Commands

```powershell
# Set camera URL (replace with your IP)
$env:CAMERA_URL = "http://192.168.1.50:8080/video"

# Test connection
python test_camera.py

# If test passes, run camera detector
python camera_detector.py
```

---

## Getting Your Phone's IP Address

### Android:
1. Open IP Webcam app
2. Start server
3. IP shown at top (e.g., "http://192.168.1.50:8080")

### Alternative (Android):
1. Settings → About Phone → Status → IP Address
2. Or Settings → WiFi → Tap network → IP Address

### iOS:
1. Settings → WiFi
2. Tap the (i) icon next to your network
3. Look for "IP Address"

---

## Still Having Issues?

1. **Run the test script with verbose output:**
   ```powershell
   python test_camera.py
   ```

2. **Check if you can ping your phone:**
   ```powershell
   ping 192.168.1.50
   ```

3. **Try accessing in browser first:**
   - Go to `http://YOUR_PHONE_IP:8080`
   - You should see the IP Webcam interface

4. **Restart everything:**
   - Stop IP Webcam server
   - Close the app
   - Reconnect phone to WiFi
   - Start IP Webcam server again
   - Update CAMERA_URL with new IP if changed

5. **Use the test script to auto-detect working endpoints:**
   ```powershell
   python test_camera.py
   ```

---

## Example Complete Setup (PowerShell)

```powershell
# 1. Navigate to backend directory
cd C:\Users\Faith\OneDrive\Desktop\servilance\backend

# 2. Set all environment variables
$env:CAMERA_URL = "http://192.168.1.50:8080/video"  # Your phone's IP
$env:HF_API_TOKEN = "hf_YOUR_TOKEN_HERE"             # Hugging Face token
$env:BACKEND_URL = "http://localhost:8000"
$env:CAMERA_ID = "camera-1"

# 3. Test camera connection
python test_camera.py

# 4. If test passes, run camera detector
python camera_detector.py
```

---

## Success Indicators

When everything is working, you should see:
```
Connecting to camera at http://192.168.1.50:8080/video
Backend URL: http://localhost:8000
Camera ID: camera-1
[Frame 2] Querying CLIP model...
[Frame 2] Top label: person sitting (85.23%) - Safe
```

🎉 **You're all set!**
