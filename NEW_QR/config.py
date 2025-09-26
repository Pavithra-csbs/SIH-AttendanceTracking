# config.py

# Secret key for session management and token generation
SECRET_KEY = 'your-super-secret-key-change-this'

# Database configuration
SQLALCHEMY_DATABASE_URI = 'sqlite:///attendance.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Campus location boundaries (Bounding Box)
# Replace with your actual campus coordinates
CAMPUS_BOUNDS = {
   "min_lat": 11.0836067,   # Your latitude - 0.0010
    "max_lat": 11.0856067,   # Your latitude + 0.0010
    "min_lon": 76.9972047,   # Your longitude - 0.0010
    "max_lon": 76.9992047    # Your longitude + 0.0010
}

# Session duration in minutes
SESSION_DURATION_MINUTES = 3