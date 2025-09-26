# utils/location.py
from config import CAMPUS_BOUNDS

def is_within_campus(latitude, longitude):
    """Checks if the given coordinates are within the campus boundaries."""
    lat_in_bounds = CAMPUS_BOUNDS["min_lat"] <= latitude <= CAMPUS_BOUNDS["max_lat"]
    lon_in_bounds = CAMPUS_BOUNDS["min_lon"] <= longitude <= CAMPUS_BOUNDS["max_lon"]
    return lat_in_bounds and lon_in_bounds