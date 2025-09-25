import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

function TeacherQR() {
  const [token, setToken] = useState("");

  const generateToken = () => {
    const newToken = Math.random().toString(36).substr(2, 10) + Date.now();
    setToken(newToken);
  };

  useEffect(() => {
    generateToken();
    const interval = setInterval(() => {
      generateToken();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Teacher Attendance QR</h1>
      {token ? (
        <>
          <QRCodeCanvas value={token} size={200} />
          <p className="mt-4 text-lg">This QR code refreshes every 30 seconds</p>
          <p className="text-sm text-gray-500 mt-2">Current Token: {token}</p>
        </>
      ) : (
        <p>Loading QR...</p>
      )}
    </div>
  );
}

export default TeacherQR;
