// backend/server.js
const express = require('express');
const app = express();
const port = 3000;

// This allows our server to understand JSON and our frontend to talk to it
app.use(express.json());
const cors = require('cors');
app.use(cors());

// --- FAKE LOGIC FOR TESTING ---
// The "campus" is centered here (Chennai) with a radius of 500 meters
const CAMPUS_LOCATION = { latitude: 13.0827, longitude: 80.2707 };
const CAMPUS_RADIUS_METERS = 500;

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // in metres
}

// --- API ENDPOINT FOR VERIFICATION ---
app.post('/api/verify-attendance', (req, res) => {
    // This is the "proof" message that will appear in your terminal
    console.log('✅ [Backend Proof]: Data received from a scanner ->', req.body); 
    
    const { qrCodeData, location } = req.body;

    // 1. Check if the student is on campus
    const distance = getDistance(location.latitude, location.longitude, CAMPUS_LOCATION.latitude, CAMPUS_LOCATION.longitude);
    if (distance > CAMPUS_RADIUS_METERS) {
        return res.status(400).json({ success: false, message: `You are ${Math.round(distance)}m away. You must be on campus.` });
    }

    // If all checks pass:
    res.json({ success: true, message: "Attendance Marked Successfully!" });
});

app.listen(port, () => {
    console.log(`✅ Backend server listening at http://localhost:${port}`);
});