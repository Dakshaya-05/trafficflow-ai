import pytest
from app.schemas import TrafficPredictRequest
from app.predictor import TrafficPredictor
from app.model import generate_sample_traffic_dataset

def test_dataset_generation():
    df = generate_sample_traffic_dataset(n_samples=200)
    assert len(df) == 200
    assert "vehicle_count" in df.columns
    assert "average_speed" in df.columns
    assert "target" in df.columns
    assert set(df["target"].unique()).issubset({0, 1, 2})

def test_traffic_prediction_pipeline():
    predictor = TrafficPredictor()
    req = TrafficPredictRequest(
        location="Cyber Towers Junction",
        vehicleCount=1450,
        averageSpeed=18.5,
        weatherCondition="Rainy",
        timeOfDay="Evening Rush",
        roadType="Highway"
    )
    res = predictor.predict_traffic(req)
    assert res.predictedTrafficLevel in ["LOW TRAFFIC", "MEDIUM TRAFFIC", "HIGH TRAFFIC"]
    assert 0 <= res.riskScore <= 100
    assert 0.0 <= res.confidence <= 1.0
    assert len(res.recommendation) > 0
    assert len(res.factors) > 0

def test_traffic_prediction_low():
    predictor = TrafficPredictor()
    req = TrafficPredictRequest(
        location="Outer Ring Road Exit 14",
        vehicleCount=250,
        averageSpeed=85.0,
        weatherCondition="Clear",
        timeOfDay="Night",
        roadType="Highway"
    )
    res = predictor.predict_traffic(req)
    assert res.predictedTrafficLevel in ["LOW TRAFFIC", "MEDIUM TRAFFIC"]
    assert res.riskScore < 50
