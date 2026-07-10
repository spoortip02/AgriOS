# Crop water requirements (mm per day baseline)
CROP_WATER_NEEDS = {
    "tomato": 4.5,
    "potato": 3.8,
    "corn": 5.0,
    "wheat": 3.0,
    "rice": 8.0,
    "soybean": 4.0,
    "pepper": 3.5,
    "grape": 3.2,
    "apple": 3.0,
    "strawberry": 4.0,
}

# Soil retention factor (how much water soil holds)
SOIL_FACTORS = {
    "sandy": 1.3,    # drains fast, needs more water
    "loam": 1.0,     # balanced
    "clay": 0.7,     # retains water, needs less
    "silt": 0.9,
}

def calculate_irrigation(
    crop: str,
    soil: str,
    field_size: float,
    temp: float,
    humidity: float,
    rain_forecast: float
) -> dict:
    # Base water need for crop
    base_need = CROP_WATER_NEEDS.get(crop.lower(), 4.0)
    
    # Adjust for temperature
    if temp > 35:
        temp_factor = 1.4
    elif temp > 30:
        temp_factor = 1.2
    elif temp > 25:
        temp_factor = 1.0
    elif temp > 15:
        temp_factor = 0.8
    else:
        temp_factor = 0.6

    # Adjust for humidity
    if humidity > 80:
        humidity_factor = 0.7
    elif humidity > 60:
        humidity_factor = 0.85
    elif humidity > 40:
        humidity_factor = 1.0
    else:
        humidity_factor = 1.2

    # Soil factor
    soil_factor = SOIL_FACTORS.get(soil.lower(), 1.0)

    # Calculate water need in mm
    water_need_mm = base_need * temp_factor * humidity_factor * soil_factor

    # Subtract expected rainfall
    effective_rain = min(rain_forecast, water_need_mm)
    irrigation_needed_mm = max(0, water_need_mm - effective_rain)

    # Convert to liters per square meter (1mm = 1 liter/m²)
    liters_per_sqm = round(irrigation_needed_mm, 2)

    # Total for field
    total_liters = round(liters_per_sqm * field_size, 1)

    # Water savings vs average farmer (who uses fixed schedule)
    average_usage = base_need * field_size
    savings = round(max(0, average_usage - total_liters), 1)
    savings_pct = round((savings / (average_usage + 0.001)) * 100)

    # Recommendation
    if irrigation_needed_mm == 0:
        recommendation = "No irrigation needed today — rainfall is sufficient."
        urgency = "low"
    elif irrigation_needed_mm < 2:
        recommendation = f"Light irrigation recommended — {liters_per_sqm}L/m²."
        urgency = "low"
    elif irrigation_needed_mm < 4:
        recommendation = f"Moderate irrigation needed — {liters_per_sqm}L/m²."
        urgency = "medium"
    else:
        recommendation = f"Heavy irrigation required — {liters_per_sqm}L/m²."
        urgency = "high"

    return {
        "crop": crop,
        "soil": soil,
        "field_size": field_size,
        "water_needed_per_sqm": liters_per_sqm,
        "total_liters": total_liters,
        "rain_offset": round(effective_rain, 2),
        "recommendation": recommendation,
        "urgency": urgency,
        "savings_vs_average": savings,
        "savings_percentage": savings_pct,
        "factors": {
            "temp_factor": temp_factor,
            "humidity_factor": humidity_factor,
            "soil_factor": soil_factor,
            "base_need": base_need
        }
    }