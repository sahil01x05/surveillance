"""
IP Webcam Connection Test Script

This script helps you troubleshoot your IP Webcam connection before running
the main camera detector. It will test the connection and show you helpful
diagnostic information.
"""

import os
import sys
import requests
import cv2

def test_ip_webcam():
    print("=" * 70)
    print("IP WEBCAM CONNECTION TEST")
    print("=" * 70)
    print()
    
    # Get camera URL from environment or use default
    camera_url = os.getenv("CAMERA_URL", "http://192.168.1.100:8080/video")
    print(f"Testing connection to: {camera_url}")
    print()
    
    # Step 1: Test basic HTTP connectivity
    print("STEP 1: Testing HTTP connectivity...")
    base_url = camera_url.rsplit('/', 1)[0]  # Remove /video part
    
    try:
        response = requests.get(base_url, timeout=5)
        print(f"✅ Server is reachable at {base_url}")
        print(f"   Status Code: {response.status_code}")
    except requests.exceptions.Timeout:
        print(f"❌ Connection timed out. Server not responding.")
        print(f"   Make sure IP Webcam app is running on your phone.")
        return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection refused. Cannot reach {base_url}")
        print(f"   Check if:")
        print(f"   - IP Webcam app is running")
        print(f"   - Your phone and computer are on the same WiFi network")
        print(f"   - The IP address is correct")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    print()
    
    # Step 2: Test video stream endpoint
    print("STEP 2: Testing video stream endpoint...")
    try:
        # Try common IP Webcam endpoints
        endpoints = [
            "/video",
            "/video/mjpeg",
            "/shot.jpg"
        ]
        
        working_endpoint = None
        for endpoint in endpoints:
            test_url = base_url + endpoint
            print(f"   Trying: {test_url}")
            try:
                response = requests.get(test_url, timeout=5, stream=True)
                if response.status_code == 200:
                    print(f"   ✅ Found working endpoint: {endpoint}")
                    working_endpoint = test_url
                    break
                else:
                    print(f"   ❌ Status {response.status_code}")
            except:
                print(f"   ❌ Failed")
        
        if not working_endpoint:
            print()
            print("❌ No working video endpoint found!")
            print("   Common IP Webcam URLs:")
            print(f"   - {base_url}/video")
            print(f"   - {base_url}/video/mjpeg")
            print(f"   - {base_url}/shot.jpg")
            return False
            
    except Exception as e:
        print(f"❌ Error testing endpoints: {e}")
        return False
    
    print()
    
    # Step 3: Test OpenCV video capture
    print("STEP 3: Testing OpenCV video capture...")
    print(f"   Attempting to open stream: {camera_url}")
    
    cap = cv2.VideoCapture(camera_url)
    
    if not cap.isOpened():
        print("❌ OpenCV failed to open video stream")
        print(f"   Try setting CAMERA_URL to: {working_endpoint}")
        return False
    
    # Try to read a frame
    ret, frame = cap.read()
    cap.release()
    
    if not ret:
        print("❌ Failed to read frame from stream")
        return False
    
    print(f"✅ Successfully captured frame!")
    print(f"   Frame size: {frame.shape[1]}x{frame.shape[0]}")
    print()
    
    # Success!
    print("=" * 70)
    print("✅ ALL TESTS PASSED!")
    print("=" * 70)
    print()
    print("Your IP Webcam is working correctly.")
    print(f"Camera URL: {camera_url}")
    print()
    print("You can now run:")
    print("  python camera_detector.py")
    print()
    
    return True


def show_setup_instructions():
    print()
    print("=" * 70)
    print("IP WEBCAM SETUP INSTRUCTIONS")
    print("=" * 70)
    print()
    print("1. INSTALL IP WEBCAM APP:")
    print("   - Android: Download 'IP Webcam' from Google Play Store")
    print("   - iOS: Use 'IP Camera Lite' or similar app")
    print()
    print("2. START THE STREAM:")
    print("   - Open IP Webcam app on your phone")
    print("   - Scroll down and tap 'Start server'")
    print("   - Note the IP address shown (e.g., 192.168.1.100:8080)")
    print()
    print("3. VERIFY NETWORK:")
    print("   - Your phone and computer MUST be on the same WiFi network")
    print("   - Disable mobile data on your phone to ensure WiFi is used")
    print()
    print("4. FIND YOUR PHONE'S IP ADDRESS:")
    print("   - It's displayed in the IP Webcam app when server is running")
    print("   - Usually starts with 192.168.x.x or 10.0.x.x")
    print()
    print("5. SET ENVIRONMENT VARIABLE:")
    print("   In PowerShell:")
    print("   $env:CAMERA_URL = 'http://YOUR_PHONE_IP:8080/video'")
    print()
    print("   Example:")
    print("   $env:CAMERA_URL = 'http://192.168.1.50:8080/video'")
    print()
    print("6. TEST YOUR BROWSER:")
    print("   Open http://YOUR_PHONE_IP:8080 in your web browser")
    print("   You should see the IP Webcam control page")
    print()
    print("=" * 70)
    print()


if __name__ == "__main__":
    print()
    
    # Check if user wants help
    if len(sys.argv) > 1 and sys.argv[1] in ["--help", "-h", "help"]:
        show_setup_instructions()
        sys.exit(0)
    
    # Check if CAMERA_URL is set
    camera_url = os.getenv("CAMERA_URL")
    if not camera_url:
        print("⚠️  CAMERA_URL environment variable not set!")
        print("   Using default: http://192.168.1.100:8080/video")
        print()
        print("   To set your camera URL:")
        print("   $env:CAMERA_URL = 'http://YOUR_PHONE_IP:8080/video'")
        print()
        input("Press Enter to continue with default, or Ctrl+C to exit...")
        print()
    
    # Run the test
    success = test_ip_webcam()
    
    if not success:
        print()
        print("For setup help, run:")
        print("  python test_camera.py --help")
        print()
        sys.exit(1)
    
    sys.exit(0)
