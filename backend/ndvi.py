import math
import random
from datetime import datetime

def calculate_ndvi_zones(lat: float, lon: float, field_size: float, temp: float, humidity: float):
    """
    Generate realistic NDVI values based on weather conditions and season.
    NDVI ranges from -1 to 1:
    - 0.6-1.0: Very healthy vegetation
    - 0.4-0.6: Healthy vegetation  
    - 0.2-0.4: Moderate vegetation
    - 0.0-0.2: Sparse vegetation
    - <0.0: No vegetation/water/soil
    """
    
    # Season factor (Northern hemisphere)
    month = datetime.now().month
    if 4 <= month <= 9:
        season_factor = 1.0  # Growing season
    elif month in [3, 10]:
        season_factor = 0.7  # Transition
    else:
        season_factor = 0.4  # Winter

    # Weather factor
    if humidity > 70 and 15 < temp < 30:
        weather_factor = 1.0  # Ideal conditions
    elif humidity < 30 or temp > 38:
        weather_factor = 0.5  # Stress conditions
    else:
        weather_factor = 0.75

    # Base NDVI
    base_ndvi = 0.6 * season_factor * weather_factor

    # Generate 16 zones (4x4 grid) with realistic variation
    zones = []
    random.seed(int(lat * 1000 + lon * 1000))  # Consistent per location
    
    for i in range(4):
        for j in range(4):
            # Add spatial variation
            variation = random.uniform(-0.15, 0.15)
            ndvi = round(min(0.95, max(-0.1, base_ndvi + variation)), 2)
            
            # Zone coordinates (small offsets around center)
            zone_lat = lat + (i - 1.5) * 0.001
            zone_lon = lon + (j - 1.5) * 0.001
            
            # Health status
            if ndvi >= 0.6:
                status = "Excellent"
                color = "#2d6a4f"
            elif ndvi >= 0.4:
                status = "Good"
                color = "#52b788"
            elif ndvi >= 0.2:
                status = "Moderate"
                color = "#d4a017"
            else:
                status = "Poor"
                color = "#d62828"
            
            zones.append({
                "zone": f"Zone {i*4+j+1}",
                "lat": round(zone_lat, 6),
                "lon": round(zone_lon, 6),
                "ndvi": ndvi,
                "status": status,
                "color": color
            })

    # Overall field health
    avg_ndvi = round(sum(z["ndvi"] for z in zones) / len(zones), 2)
    healthy_zones = sum(1 for z in zones if z["ndvi"] >= 0.4)
    
    if avg_ndvi >= 0.6:
        overall = "Excellent"
        recommendation = "Field is in great health. Maintain current practices."
    elif avg_ndvi >= 0.4:
        overall = "Good"
        recommendation = "Most zones are healthy. Monitor moderate zones closely."
    elif avg_ndvi >= 0.2:
        overall = "Moderate"
        recommendation = "Several zones need attention. Check irrigation and fertilization."
    else:
        overall = "Poor"
        recommendation = "Field health is critical. Immediate intervention required."

    return {
        "center": {"lat": lat, "lon": lon},
        "field_size": field_size,
        "avg_ndvi": avg_ndvi,
        "overall_health": overall,
        "recommendation": recommendation,
        "healthy_zones": healthy_zones,
        "total_zones": len(zones),
        "zones": zones,
        "factors": {
            "season_factor": season_factor,
            "weather_factor": weather_factor,
            "temp": temp,
            "humidity": humidity
        }
    }