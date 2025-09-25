# backend/check_alerts.py
from app.database import SessionLocal
from app.models import Student

db = SessionLocal()

students = db.query(Student).all()

alerts_triggered = False

for s in students:
    if s.attendance_percentage < 75:
        alerts_triggered = True
        print(f"⚠️ Alert: {s.name} ({s.roll_no}) attendance is below 75% ({s.attendance_percentage}%)")

if not alerts_triggered:
    print("✅ All students have attendance >= 75%")

db.close()

