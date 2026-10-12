import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

MODEL_FILE = os.path.join(os.path.dirname(__file__), "traffic_model.joblib")
SCALER_FILE = os.path.join(os.path.dirname(__file__), "traffic_scaler.joblib")
METRICS_FILE = os.path.join(os.path.dirname(__file__), "model_metrics.joblib")

WEATHER_MAP = {
    "CLEAR": 0,
    "OVERCAST": 1,
    "RAINY": 2,
    "FOGGY": 3,
    "SNOWY": 4
}

TIME_MAP = {
    "NIGHT": 0,
    "AFTERNOON": 1,
    "MORNING RUSH": 2,
    "EVENING RUSH": 3
}

ROAD_MAP = {
    "RESIDENTIAL": 0,
    "URBAN": 1,
    "ARTERIAL": 2,
    "HIGHWAY": 3
}

TARGET_CLASSES = ["LOW TRAFFIC", "MEDIUM TRAFFIC", "HIGH TRAFFIC"]

FEATURE_COLUMNS = [
    "vehicle_count",
    "average_speed",
    "weather_code",
    "time_code",
    "road_code",
    "speed_volume_ratio",
    "is_rush_hour",
    "is_adverse_weather"
]

def generate_sample_traffic_dataset(n_samples=5000, random_seed=42):
    """
    Generates a realistic, clearly labeled traffic dataset.
    Features:
      - vehicle_count: 50 to 2500 veh/hr
      - average_speed: 8 to 110 km/h
      - weather_condition: Clear, Overcast, Rainy, Foggy, Snowy
      - time_of_day: Morning Rush, Afternoon, Evening Rush, Night
      - road_type: Highway, Arterial, Urban, Residential
    Target:
      - LOW TRAFFIC
      - MEDIUM TRAFFIC
      - HIGH TRAFFIC
    """
    np.random.seed(random_seed)

    # Road types
    road_codes = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.2, 0.3, 0.3, 0.2])
    # Road capacities
    base_capacities = {0: 400, 1: 900, 2: 1400, 3: 2200}
    max_speeds = {0: 40, 1: 60, 2: 80, 3: 110}

    time_codes = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.25, 0.25, 0.25, 0.25])
    weather_codes = np.random.choice([0, 1, 2, 3, 4], size=n_samples, p=[0.55, 0.20, 0.15, 0.06, 0.04])

    vehicle_counts = []
    average_speeds = []
    targets = []

    for i in range(n_samples):
        rc = road_codes[i]
        tc = time_codes[i]
        wc = weather_codes[i]

        cap = base_capacities[rc]
        top_speed = max_speeds[rc]

        # Multipliers based on time of day
        if tc in [2, 3]:  # Morning or Evening rush
            vol_mult = np.random.uniform(0.85, 1.45)
        elif tc == 1:     # Afternoon
            vol_mult = np.random.uniform(0.45, 0.85)
        else:             # Night
            vol_mult = np.random.uniform(0.15, 0.50)

        # Weather slowdown factor
        weather_slowdown = 1.0
        if wc == 2:  # Rainy
            weather_slowdown = np.random.uniform(0.70, 0.88)
        elif wc in [3, 4]:  # Foggy or Snowy
            weather_slowdown = np.random.uniform(0.55, 0.75)

        vol = int(np.clip(cap * vol_mult + np.random.normal(0, 50), 50, 2600))
        vol_ratio = vol / cap

        # Average speed inversely correlated with volume ratio
        speed = top_speed * (1.0 - (vol_ratio * 0.65)) * weather_slowdown
        speed = float(np.clip(speed + np.random.normal(0, 3), 8.0, top_speed))

        # Congestion scoring logic
        congestion_score = (vol_ratio * 55.0) + ((1.0 - (speed / top_speed)) * 35.0)
        if tc in [2, 3]:
            congestion_score += 10.0
        if wc in [2, 3, 4]:
            congestion_score += 8.0

        if congestion_score >= 68.0:
            target = 2  # HIGH TRAFFIC
        elif congestion_score >= 42.0:
            target = 1  # MEDIUM TRAFFIC
        else:
            target = 0  # LOW TRAFFIC

        vehicle_counts.append(vol)
        average_speeds.append(round(speed, 1))
        targets.append(target)

    df = pd.DataFrame({
        "vehicle_count": vehicle_counts,
        "average_speed": average_speeds,
        "weather_code": weather_codes,
        "time_code": time_codes,
        "road_code": road_codes,
        "target": targets
    })

    df["speed_volume_ratio"] = df["average_speed"] / (df["vehicle_count"] + 1.0)
    df["is_rush_hour"] = df["time_code"].isin([2, 3]).astype(int)
    df["is_adverse_weather"] = df["weather_code"].isin([2, 3, 4]).astype(int)

    return df

def train_and_save_model():
    """
    Trains a Random Forest classifier on sample dataset using train-test split.
    Saves trained model, scaler, and evaluation metrics using Joblib.
    """
    print("[AI-Service] Generating labeled sample traffic dataset (5,000 records)...")
    df = generate_sample_traffic_dataset(n_samples=5000, random_seed=42)

    X = df[FEATURE_COLUMNS]
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("[AI-Service] Training RandomForestClassifier (100 estimators, max_depth=10)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    clf.fit(X_train_scaled, y_train)

    y_pred = clf.predict(X_test_scaled)
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="weighted"))
    rec = float(recall_score(y_test, y_pred, average="weighted"))
    f1 = float(f1_score(y_test, y_pred, average="weighted"))

    importances = dict(zip(FEATURE_COLUMNS, [float(v) for v in clf.feature_importances_]))

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "samples_train": len(X_train),
        "samples_test": len(X_test),
        "feature_importances": importances,
        "model_type": "RandomForestClassifier",
        "target_classes": TARGET_CLASSES,
        "evaluation_notice": "Trained and evaluated on sample traffic dataset with 80/20 train-test split. Tested accuracy: {:.2f}%.".format(acc * 100)
    }

    joblib.dump(clf, MODEL_FILE)
    joblib.dump(scaler, SCALER_FILE)
    joblib.dump(metrics, METRICS_FILE)

    print("[AI-Service] Model trained & saved successfully! Accuracy: {:.2f}%, F1: {:.2f}%".format(acc * 100, f1 * 100))
    return clf, scaler, metrics

def load_or_train_model():
    if os.path.exists(MODEL_FILE) and os.path.exists(SCALER_FILE) and os.path.exists(METRICS_FILE):
        try:
            clf = joblib.load(MODEL_FILE)
            scaler = joblib.load(SCALER_FILE)
            metrics = joblib.load(METRICS_FILE)
            return clf, scaler, metrics
        except Exception as e:
            print(f"[AI-Service] Could not load saved model ({e}), retraining...")

    return train_and_save_model()
