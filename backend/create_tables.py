# create_tables.py

from app.database import engine, Base
from app import models

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
