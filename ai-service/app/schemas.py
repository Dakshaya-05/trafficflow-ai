from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# Core schema for TrafficFlow AI prediction
class TrafficPredictRequest(BaseModel):
    location: str = Field(..., description="Location / Junction / Corridor name")
    vehicleCount: int = Field(..., ge=0, description="Observed vehicle count per hour")
    averageSpeed: float = Field(..., ge=1.0, description="Average vehicle speed in km/h")
    weatherCondition: str = Field(..., description="Weather: Clear, Rainy, Foggy, Snowy, Overcast")
    timeOfDay: str = Field(..., description="Time of day: Morning Rush, Afternoon, Evening Rush, Night")
    roadType: str = Field(..., description="Road type: Highway, Arterial, Urban, Residential")

class TrafficPredictResponse(BaseModel):
    location: str
    predictedTrafficLevel: str = Field(..., description="LOW TRAFFIC, MEDIUM TRAFFIC, HIGH TRAFFIC")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    riskScore: float = Field(..., ge=0.0, le=100.0, description="Calculated risk score (0-100)")
    recommendation: str = Field(..., description="Actionable driver recommendation")
    factors: List[str] = Field(default_factory=list, description="Top contributing factors")
    probabilities: Dict[str, float] = Field(default_factory=dict, description="Class probabilities")
    evaluationNotes: str = Field(default="Trained and evaluated on sample traffic dataset with Random Forest Classifier.")

# Legacy / Telemetry Schema
class PredictionRequest(BaseModel):
    trafficVolume: float = Field(..., description="Current traffic volume in vehicles/hour")
    averageSpeed: float = Field(..., description="Current average speed in km/h")
    historicalAverageVolume: float = Field(default=900.0, description="Historical average volume")
    hour: int = Field(default=12, ge=0, le=23, description="Hour of the day (0-23)")
    dayOfWeek: int = Field(default=2, ge=0, le=6, description="Day of the week (0=Mon, 6=Sun)")
    rainfall: float = Field(default=0.0, ge=0, description="Precipitation in mm")
    temperature: float = Field(default=28.0, description="Temperature in Celsius")
    roadCondition: str = Field(default="DRY", description="Road condition: DRY, WET, FLOODED, SLIPPERY")
    accidentNearby: bool = Field(default=False, description="Whether an accident or incident is reported nearby")
    publicEventNearby: bool = Field(default=False, description="Whether a public event is scheduled or ongoing nearby")
    currentCongestion: str = Field(default="MODERATE", description="Current congestion level: LOW, MODERATE, HIGH, SEVERE")
    nearbyCongestion: str = Field(default="MODERATE", description="Congestion on adjacent roads")
    predictionWindowMinutes: int = Field(default=30, description="Forecast horizon in minutes: 15, 30, 45, 60")

class PredictionResponse(BaseModel):
    predictedCongestion: str
    riskScore: float
    confidence: float
    predictionWindowMinutes: int
    factors: List[str]
    explanation: str
    featureContributions: Dict[str, float]
    classProbabilities: Dict[str, float]
    predictedSpeed: float
    predictedVolume: int
