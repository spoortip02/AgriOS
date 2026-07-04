from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionResponse(BaseModel):
    scan_id: int
    crop: str
    condition: str
    confidence: float
    is_healthy: bool
    treatment: str
    label: str

    class Config:
        from_attributes = True

class ScanHistory(BaseModel):
    id: int
    crop: str
    condition: str
    confidence: float
    is_healthy: str
    treatment: str
    created_at: datetime

    class Config:
        from_attributes = True