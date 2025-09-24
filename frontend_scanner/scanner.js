document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    // This is the most important line for integration.
    // Your backend team (Member 3) will give you this URL.
    const BACKEND_URL = 'http://localhost:3000'; // Example for local testing

    // --- UI ELEMENTS ---
    const statusContainer = document.getElementById('status-container');
    const statusIcon = statusContainer.querySelector('.status-icon');
    const statusMessage = statusContainer.querySelector('.status-message');
    const readerDiv = document.getElementById('reader');

    /**
     * Updates the status display with a message, icon, and style.
     * @param {string} message - The text to display.
     * @param {string} type - 'info', 'success', 'error', or 'loading'.
     */
    function updateStatus(message, type) {
        statusMessage.textContent = message;
        statusContainer.className = `status-${type}`;
        
        switch (type) {
            case 'success': statusIcon.innerHTML = '✅'; break;
            case 'error': statusIcon.innerHTML = '❌'; break;
            case 'loading': statusIcon.innerHTML = '⏳'; break;
            default: statusIcon.innerHTML = 'ℹ️'; break;
        }
    }

    // --- 1. HANDLE CAMERA & SCANNING ---
    const html5QrCode = new Html5Qrcode("reader");

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        // Stop scanning immediately after a successful scan
        html5QrCode.stop().then(() => {
            readerDiv.style.display = 'none'; // Hide the camera view
            updateStatus('QR Code Scanned! Capturing your location...', 'loading');
            captureAndVerifyLocation(decodedText);
        }).catch(err => console.error("Failed to stop scanner:", err));
    };
    
    // Start the camera and scanner
    html5QrCode.start({ facingMode: "environment" }, { fps: 10 }, qrCodeSuccessCallback)
        .then(() => {
            updateStatus('Point your camera at the QR code.', 'info');
        })
        .catch(err => {
            // This handles when a user denies camera permission
            updateStatus('Camera access denied. Please allow camera permissions and refresh.', 'error');
            readerDiv.style.display = 'none';
        });

    // --- 2. HANDLE GPS LOCATION ---
    function captureAndVerifyLocation(qrData) {
        if (!navigator.geolocation) {
            updateStatus('Geolocation is not supported by your browser.', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            // Success Callback
            (position) => {
                const location = { 
                    latitude: position.coords.latitude, 
                    longitude: position.coords.longitude 
                };
                updateStatus('Location captured! Verifying you are on campus...', 'loading');
                sendDataToBackend(qrData, location);
            },
            // Error Callback
            (error) => {
                let message = 'Could not get your location.';
                if (error.code === error.PERMISSION_DENIED) {
                    message = 'Location access denied. Please enable it to mark attendance.';
                }
                updateStatus(message, 'error');
            },
            // Options for better accuracy
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }

    // --- 3. SEND DATA TO BACKEND FOR FINAL VERIFICATION ---
    async function sendDataToBackend(qrCodeData, location) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/verify-attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrCodeData, location })
            });

            const result = await response.json();

            if (response.ok) {
                updateStatus(result.message, 'success');
            } else {
                // This will display the specific error from the backend 
                // (e.g., "Expired QR Code" or "You are not on campus.")
                updateStatus(result.message, 'error');
            }
        } catch (error) {
            updateStatus('Network error. Could not connect to the server.', 'error');
        }
    }
});