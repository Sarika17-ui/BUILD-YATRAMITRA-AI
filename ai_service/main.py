"""
YatraMitra AI - FastAPI AI Microservice
Provides ML-powered Crowd Prediction, Dynamic Waiting Time Estimation,
and Anomaly Detection for Pilgrims and Temple Authorities.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional, List
import uvicorn
from model import ai_engine, TEMPLE_CONFIGS

app = FastAPI(
    title="YatraMitra AI - Pilgrimage Crowd Prediction & Safety Engine",
    description="Intelligent AI engine powering voice-first pilgrimage companion & crowd flow control",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnomalyCheckRequest(BaseModel):
    temple_id: str
    gate_counts: Dict[str, int]

@app.get("/")
def root():
    return {
        "service": "YatraMitra AI Intelligence API",
        "tagline": "आपकी यात्रा, आपकी भाषा, आपकी सुरक्षा।",
        "status": "active",
        "supported_temples": list(TEMPLE_CONFIGS.keys())
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_trained": ai_engine.is_trained,
        "features": ai_engine.feature_columns
    }

@app.get("/ai/predict")
def predict_crowd(
    temple_id: str = Query("somnath", description="Temple ID: somnath, dwarka, ambaji, pavagadh"),
    hour: int = Query(9, ge=0, le=23, description="Hour of day (0-23)"),
    day: int = Query(1, ge=0, le=6, description="Day of week (0=Mon, 6=Sun)"),
    is_festival: bool = Query(False, description="Is special tithi or festival day")
):
    try:
        prediction = ai_engine.predict(temple_id, hour, day, is_festival)
        return {"success": True, "data": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/forecast/24h")
def forecast_24h(
    temple_id: str = Query("somnath"),
    day: int = Query(1),
    is_festival: bool = Query(False)
):
    try:
        data = ai_engine.forecast_24h(temple_id, day, is_festival)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/anomaly-check")
def check_anomaly(req: AnomalyCheckRequest):
    try:
        result = ai_engine.detect_anomalies(req.temple_id, req.gate_counts)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/optimal-slots")
def get_optimal_slots(temple_id: str = Query("somnath")):
    try:
        data = ai_engine.forecast_24h(temple_id)
        return {
            "success": True,
            "temple_id": temple_id,
            "recommended_slots": data["best_slots"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
