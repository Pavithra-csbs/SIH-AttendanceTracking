// static/js/scanner.js
document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const scannerSection = document.getElementById('scanner-section');
    const loginForm = document.getElementById('login-form');
    const messageArea = document.getElementById('message-area');
    const welcomeMessage = document.getElementById('welcome-message');
    const stopScanBtn = document.getElementById('stop-scan-btn');
    const qrReaderDiv = document.getElementById('qr-reader');

    let studentInfo = null;
    let html5QrCode = null;

    // 1. Handle Student Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.success) {
                studentInfo = { id: data.studentId, name: data.username };
                showScanner();
            } else {
                displayMessage(data.message, 'error');
            }
        } catch (error) {
            displayMessage('Login failed. Please try again.', 'error');
        }
    });

    // 2. Show Scanner and Start Camera
    function showScanner() {
        loginSection.classList.add('hidden');
        scannerSection.classList.remove('hidden');
        welcomeMessage.textContent = `Welcome, ${studentInfo.name}!`;
        startScanner();
    }

    // 3. Start the QR Code Scanner
    function startScanner() {
        html5QrCode = new Html5Qrcode("qr-reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
            .catch(err => {
                console.error("Unable to start scanning.", err);
                displayMessage('Could not start camera. Please grant permission.', 'error');
            });
        
        stopScanBtn.classList.remove('hidden');
    }

    // 4. Handle Successful Scan
    async function onScanSuccess(decodedText, decodedResult) {
        console.log(`Scan result: ${decodedText}`);
        await html5QrCode.stop();
        stopScanBtn.classList.add('hidden');
        displayMessage('QR Code scanned. Getting your location...', 'info');

        // Get GPS Location
        if (!navigator.geolocation) {
            displayMessage('Geolocation is not supported by your browser.', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                markAttendance(decodedText, latitude, longitude);
            },
            () => {
                displayMessage('Unable to retrieve your location. Please enable location services.', 'error');
            }
        );
    }

    // 5. Send Attendance Data to Backend
    async function markAttendance(sessionToken, latitude, longitude) {
        try {
            const response = await fetch('/api/mark_attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: studentInfo.id,
                    sessionToken: sessionToken,
                    latitude: latitude,
                    longitude: longitude
                })
            });

            const data = await response.json();
            if (data.success) {
                displayMessage(data.message, 'success');
            } else {
                displayMessage(data.message, 'error');
            }
        } catch (error) {
            displayMessage('An error occurred while marking attendance.', 'error');
        }
    }

    // 6. Stop Scanning Manually
    stopScanBtn.addEventListener('click', () => {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                console.log("QR Code scanning stopped.");
                stopScanBtn.classList.add('hidden');
            }).catch(err => console.error("Failed to stop scanner.", err));
        }
    });

    // Utility to display messages
    function displayMessage(msg, type) {
        messageArea.textContent = msg;
        messageArea.style.color = type === 'error' ? 'red' : (type === 'success' ? 'green' : 'black');
    }
});