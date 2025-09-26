// static/js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#attendance-table tbody');

    async function fetchAttendanceData() {
        try {
            const response = await fetch('/api/get_attendance');
            if (!response.ok) {
                throw new Error('Failed to fetch data.');
            }
            const data = await response.json();
            populateTable(data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            tableBody.innerHTML = '<tr><td colspan="3">Could not load data. Please try again later.</td></tr>';
        }
    }

    function populateTable(records) {
        tableBody.innerHTML = ''; // Clear existing rows

        if (records.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">No attendance records found.</td></tr>';
            return;
        }

        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.student_username}</td>
                <td>${record.session_token}</td>
                <td>${record.timestamp}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    fetchAttendanceData();
});