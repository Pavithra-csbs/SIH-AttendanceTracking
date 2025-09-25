# models.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    roll_no = Column(String, unique=True, nullable=False)
    parent_token = Column(String, nullable=True)  # FCM token
    attendance = relationship("Attendance", back_populates="student")

    @property
    def attendance_percentage(self):
        if not self.attendance or len(self.attendance) == 0:
            return 0
        total = len(self.attendance)
        present = sum(1 for a in self.attendance if a.is_present)
        return round((present / total) * 100, 2)

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    is_present = Column(Boolean, default=False)
    student = relationship("Student", back_populates="attendance")
