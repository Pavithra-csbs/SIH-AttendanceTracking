# view_students.py

from app.database import SessionLocal
from app.models import Student

def view_students():
    db = SessionLocal()
    students = db.query(Student).all()
    if not students:
        print("No students found.")
    else:
        for s in students:
            print(f"ID: {s.id}, Name: {s.name}, Roll No: {s.roll_no}, Parent Token: {s.parent_token}")
    db.close()

if __name__ == "__main__":
    view_students()
