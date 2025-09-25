import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const sampleStudents = [
  { name: "Subiksha", roll: "101", status: "", attendance: 72 },
  { name: "Arun", roll: "102", status: "", attendance: 85 },
  { name: "Priya", roll: "103", status: "", attendance: 90 },
  { name: "Karthik", roll: "104", status: "", attendance: 60 },
];

const periods = [
  { period: 1, start: "08:00", end: "08:45" },
  { period: 2, start: "08:45", end: "09:30" },
  { break: "Break", start: "09:30", end: "09:45" },
  { period: 3, start: "09:45", end: "10:30" },
  { period: 4, start: "10:30", end: "11:15" },
  { lunch: "Lunch", start: "11:15", end: "12:00" },
  { period: 5, start: "12:00", end: "12:45" },
  { period: 6, start: "12:45", end: "1:30" },
  { break: "Break", start: "1:30", end: "11:45" },
  { period: 7, start: "1:45", end: "2:30" },
  { period: 8, start: "2:30", end: "3:15" },
];

const statusColors = {
  present: "status-present",
  absent: "status-absent",
  onDuty: "status-onDuty",
};

function App() {
  const [role, setRole] = useState("Teacher");
  const [students, setStudents] = useState(sampleStudents);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");

  // Convert period number to ordinal Hour
  const getOrdinalHour = (num) => {
    const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
    return ordinals[num - 1] || `${num}th`;
  };

  const getCurrentPeriod = useCallback(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (let p of periods) {
      const [startH, startM] = p.start.split(":").map(Number);
      const [endH, endM] = p.end.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        if (p.period) return `${getOrdinalHour(p.period)} Hour`;
        if (p.break) return "Break";
        if (p.lunch) return "Lunch";
      }
    }
    return "No Class";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
      setCurrentDay(now.toLocaleDateString("en-US", { weekday: "long" }));
      setCurrentPeriod(getCurrentPeriod());
    }, 1000);

    return () => clearInterval(interval);
  }, [getCurrentPeriod]);

  const markStatus = (roll, status) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.roll === roll
          ? {
              ...s,
              status,
              attendance:
                status === "present"
                  ? Math.min(s.attendance + 1, 100)
                  : s.attendance,
            }
          : s
      )
    );
  };

  // Capitalize first letter of status
  const formatStatus = (status) => {
    if (!status) return "---";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-4xl font-extrabold mb-2"
          style={{ color: "#0277bd" }}
        >
          Attendance Dashboard
        </h1>
        <p
          className="text-lg font-semibold mb-2"
          style={{ color: "#004d40" }}
        >
          {currentDay}, {currentDate} | {currentTime} | {currentPeriod}
        </p>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-400 mt-2 shadow-md"
        >
          <option>Teacher</option>
          <option>Student</option>
          <option>Parent</option>
        </select>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-4">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Attendance %</th>
              <th>Status</th>
              <th>Alerts</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.roll}>
                <td>{s.name}</td>
                <td>{s.roll}</td>
                <td
                  className={
                    s.attendance < 75
                      ? "text-orange-700 font-bold"
                      : "text-green-700 font-bold"
                  }
                >
                  {s.attendance}%
                </td>
                <td>
                  {role === "Teacher" ? (
                    <select
                      value={s.status}
                      onChange={(e) => markStatus(s.roll, e.target.value)}
                      className={`status-badge ${
                        statusColors[s.status] || ""
                      }`}
                    >
                      <option value="">Select Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="onDuty">On Duty</option>
                    </select>
                  ) : (
                    <span
                      className={`status-badge ${
                        statusColors[s.status] || ""
                      }`}
                    >
                      {formatStatus(s.status)}
                    </span>
                  )}
                </td>
                <td>
                  {s.attendance < 75 && (
                    <div className="alert-message">
                      {role === "Teacher"
                        ? `${s.name}: Alert sent to parent`
                        : "Your attendance is very low"}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
