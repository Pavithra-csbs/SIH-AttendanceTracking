# app.py
from flask import Flask, render_template, jsonify, request
from models import db, Student, Session, Attendance
from utils.location import is_within_campus
import datetime
import uuid

# App Configuration
app = Flask(__name__)
app.config.from_object('config')

# Initialize Database
db.init_app(app)

# --- Routes for HTML Pages ---

@app.route('/')
def teacher_index():
    """Teacher's view to create sessions."""
    return render_template('index.html')

@app.route('/student')
def student_scanner():
    """Student's view to log in and scan QR code."""
    return render_template('student.html')

@app.route('/admin')
def admin_dashboard():
    """Admin's view to see all attendance records."""
    return render_template('admin.html')

# --- API Endpoints ---

@app.route('/api/login', methods=['POST'])
def student_login():
    """API endpoint for student login."""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    student = Student.query.filter_by(username=username).first()
    if student and student.check_password(password):
        return jsonify({"success": True, "studentId": student.id, "username": student.username})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route('/api/create_session', methods=['POST'])
def create_session():
    """API endpoint to create a new attendance session."""
    session_token = str(uuid.uuid4())
    duration = app.config.get('SESSION_DURATION_MINUTES', 3)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=duration)

    new_session = Session(session_token=session_token, expires_at=expires_at)
    db.session.add(new_session)
    db.session.commit()

    return jsonify({
        "success": True,
        "sessionToken": session_token,
        "expiresAt": expires_at.isoformat() + 'Z' # ISO format for JS
    })

@app.route('/api/mark_attendance', methods=['POST'])
def mark_attendance():
    """API endpoint for students to mark their attendance."""
    data = request.json
    student_id = data.get('studentId')
    session_token = data.get('sessionToken')
    latitude = float(data.get('latitude'))
    longitude = float(data.get('longitude'))

    # 1. Find the session
    session = Session.query.filter_by(session_token=session_token).first()
    if not session:
        return jsonify({"success": False, "message": "Invalid session."}), 404

    # 2. Check if the session is expired
    if datetime.datetime.utcnow() > session.expires_at:
        return jsonify({"success": False, "message": "Session has expired."}), 400

    # 3. Check if student has already marked attendance for this session
    existing_attendance = Attendance.query.filter_by(
        student_id=student_id,
        session_id=session.id
    ).first()
    if existing_attendance:
        return jsonify({"success": False, "message": "Attendance already marked for this session."}), 409

    # 4. Validate location
    if not is_within_campus(latitude, longitude):
        return jsonify({"success": False, "message": "You are not within the campus boundaries."}), 403

    # 5. Record attendance
    new_attendance = Attendance(student_id=student_id, session_id=session.id)
    db.session.add(new_attendance)
    db.session.commit()

    return jsonify({"success": True, "message": "Attendance marked successfully!"})

@app.route('/api/get_attendance', methods=['GET'])
def get_attendance():
    """API endpoint to fetch all attendance records for the admin view."""
    records = Attendance.query.order_by(Attendance.timestamp.desc()).all()
    attendance_data = [
        {
            "student_username": record.student.username,
            "session_token": record.session.session_token,
            "timestamp": record.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        } for record in records
    ]
    return jsonify(attendance_data)


if __name__ == '__main__':
    with app.app_context():
        # Create database tables if they don't exist
        db.create_all()
    app.run(debug=True, host='0.0.0.0')