from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, Union
from .schemas import (
    TrafficPredictRequest,
    TrafficPredictResponse,
    PredictionRequest,
    PredictionResponse
)
from .predictor import get_predictor

app = FastAPI(
    title="TrafficFlow AI - Python Prediction Service",
    description="Random Forest AI service predicting urban traffic congestion classes (LOW, MEDIUM, HIGH TRAFFIC).",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    print("[AI-Service] Initializing Random Forest model...")
    get_predictor()
    print("[AI-Service] Model ready to serve predictions.")

@app.get("/health")
def health_check():
    predictor = get_predictor()
    return {
        "status": "UP",
        "service": "TrafficFlow AI - Python Prediction Service",
        "model": "RandomForestClassifier",
        "accuracy": predictor.metrics.get("accuracy", 0.88),
        "target_classes": ["LOW TRAFFIC", "MEDIUM TRAFFIC", "HIGH TRAFFIC"]
    }

@app.get("/metrics")
def get_metrics():
    predictor = get_predictor()
    return predictor.metrics

@app.post("/predict", response_model=Union[TrafficPredictResponse, PredictionResponse])
def predict_traffic(payload: Dict[str, Any] = Body(...)):
    try:
        predictor = get_predictor()
        # Detect schema based on keys
        if "location" in payload and "vehicleCount" in payload:
            req = TrafficPredictRequest(**payload)
            return predictor.predict_traffic(req)
        elif "trafficVolume" in payload:
            req = PredictionRequest(**payload)
            return predictor.predict_legacy(req)
        else:
            raise HTTPException(status_code=400, detail="Unrecognized request format. Required keys: location, vehicleCount, averageSpeed, weatherCondition, timeOfDay, roadType.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/api/traffic/predict", response_model=TrafficPredictResponse)
def predict_traffic_direct(request: TrafficPredictRequest):
    try:
        predictor = get_predictor()
        return predictor.predict_traffic(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
