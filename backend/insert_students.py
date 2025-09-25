# insert_students.py

from app.database import SessionLocal
from app.models import Student

def insert_students():
    db = SessionLocal()
    students = [
        Student(name="Alice", roll_no="1001"),
        Student(name="Bob", roll_no="1002"),
        Student(name="Charlie", roll_no="1003"),
    ]
    db.add_all(students)
    db.commit()
    db.close()
    print("Students inserted successfully.")

if __name__ == "__main__":
    insert_students()
