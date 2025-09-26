# scripts/populate_sample_db.py
import sys
import os

# Add the parent directory to the path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models import Student

def populate_data():
    """Clears existing data and populates the DB with sample students."""
    with app.app_context():
        # Drop all tables and recreate them
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()

        # Create sample students
        print("Adding sample students...")
        student1 = Student(username='student1')
        student1.set_password('pass1')

        student2 = Student(username='student2')
        student2.set_password('pass2')

        student3 = Student(username='student3')
        student3.set_password('pass3')

        db.session.add(student1)
        db.session.add(student2)
        db.session.add(student3)

        # Commit changes
        db.session.commit()
        print("Database has been reset and populated with sample data.")
        print("Sample users: (student1, pass1), (student2, pass2), (student3, pass3)")

if __name__ == '__main__':
    populate_data()