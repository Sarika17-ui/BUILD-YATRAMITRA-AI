"""
YatraMitra AI - Pilgrimage Crowd Prediction & Flow Optimization Model
Built with Scikit-learn, Pandas, and NumPy.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import os
import pickle

TEMPLE_CONFIGS = {
    "somnath": {
        "name": "Somnath Jyotirlinga (सोमनाथ महादेव)",
        "capacity": 18000,
        "base_flow_rate": 35, # devotees/min through sanctum sanctorum
        "peak_hours": [6, 7, 8, 12, 18, 19, 20], # Morning, Noon, Evening Aarti
        "weekend_multiplier": 1.45,
        "festival_multiplier": 2.2
    },
    "dwarka": {
        "name": "Dwarkadhish Temple (द्वारकाधीश मंदिर)",
        "capacity": 15000,
        "base_flow_rate": 30,
        "peak_hours": [6, 7, 10, 11, 17, 18, 19, 21],
        "weekend_multiplier": 1.5,
        "festival_multiplier": 2.5
    },
    "ambaji": {
        "name": "Shree Arasuri Ambaji Temple (माँ अम्बाजी मंदिर)",
        "capacity": 22000,
        "base_flow_rate": 45,
        "peak_hours": [7, 8, 9, 12, 18, 19, 20],
        "weekend_multiplier": 1.6,
        "festival_multiplier": 2.8
    },
    "pavagadh": {
        "name": "Kalika Mata Temple, Pavagadh (माँ कालिका मंदिर, पावागढ़)",
        "capacity": 14000,
        "base_flow_rate": 25, # ropeway + hill steps bottleneck
        "peak_hours": [6, 7, 8, 9, 10, 16, 17],
        "weekend_multiplier": 1.75,
        "festival_multiplier": 3.0
    }
}

class PilgrimageCrowdAI:
    def __init__(self):
        self.crowd_model = None
        self.wait_time_model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self._train_or_load()

    def generate_synthetic_historical_data(self, n_samples=6000):
        """
        Generates realistic multi-month telemetry for Somnath, Dwarka, Ambaji, and Pavagadh
        capturing diurnal curves, aarti surges, weather impacts, and weekend surges.
        """
        np.random.seed(42)
        temple_keys = list(TEMPLE_CONFIGS.keys())
        
        temples = np.random.choice(temple_keys, n_samples)
        hours = np.random.randint(4, 23, n_samples) # Temple open ~4 AM to 10 PM
        days = np.random.randint(0, 7, n_samples)
        is_weekend = ((days == 5) | (days == 6)).astype(int)
        is_festival = np.random.choice([0, 1], p=[0.88, 0.12], size=n_samples)
        temperatures = np.random.uniform(22.0, 39.0, n_samples)
        weather_rain = np.random.choice([0, 1], p=[0.90, 0.10], size=n_samples)
        
        crowd_counts = []
        wait_times = []

        for i in range(n_samples):
            t_key = temples[i]
            cfg = TEMPLE_CONFIGS[t_key]
            hr = hours[i]
            
            # Base diurnal curve
            if hr in cfg["peak_hours"]:
                hour_factor = np.random.uniform(1.6, 2.1)
            elif hr in [13, 14, 15]: # Afternoon lull / Bhog
                hour_factor = np.random.uniform(0.4, 0.7)
            else:
                hour_factor = np.random.uniform(0.8, 1.2)
            
            w_mult = cfg["weekend_multiplier"] if is_weekend[i] else 1.0
            f_mult = cfg["festival_multiplier"] if is_festival[i] else 1.0
            rain_mult = 0.75 if weather_rain[i] else 1.0
            
            # Base nominal devotees in complex
            base_nominal = cfg["capacity"] * 0.28
            crowd = int(base_nominal * hour_factor * w_mult * f_mult * rain_mult + np.random.normal(0, 200))
            crowd = max(300, min(crowd, int(cfg["capacity"] * 1.15)))
            
            # Wait time: queue size / sanctum flow rate
            # In queue ~ 35% of total devotees in complex
            queue_devotees = crowd * 0.38
            nominal_wait = queue_devotees / cfg["base_flow_rate"]
            wait = int(nominal_wait + np.random.normal(0, 4))
            wait = max(10, min(wait, 210))
            
            crowd_counts.append(crowd)
            wait_times.append(wait)

        df = pd.DataFrame({
            "temple": temples,
            "hour": hours,
            "day": days,
            "is_weekend": is_weekend,
            "is_festival": is_festival,
            "temp": temperatures,
            "rain": weather_rain,
            "crowd": crowd_counts,
            "wait_time": wait_times
        })
        return df

    def _train_or_load(self):
        df = self.generate_synthetic_historical_data()
        
        # One-hot encode temple
        X_df = pd.get_dummies(df[["temple", "hour", "day", "is_weekend", "is_festival", "temp", "rain"]], drop_first=False)
        self.feature_columns = list(X_df.columns)
        
        X = X_df.values
        y_crowd = df["crowd"].values
        y_wait = df["wait_time"].values
        
        self.crowd_model = RandomForestRegressor(n_estimators=60, max_depth=12, random_state=42)
        self.crowd_model.fit(X, y_crowd)
        
        self.wait_time_model = GradientBoostingRegressor(n_estimators=60, max_depth=6, random_state=42)
        self.wait_time_model.fit(X, y_wait)
        
        self.is_trained = True

    def _prepare_vector(self, temple_id: str, hour: int, day: int, is_festival: bool = False, temp: float = 30.0, rain: int = 0):
        t_clean = temple_id.lower().strip()
        if t_clean not in TEMPLE_CONFIGS:
            t_clean = "somnath"
            
        is_weekend = 1 if day in [5, 6] else 0
        fest_int = 1 if is_festival else 0
        
        row_dict = {col: 0 for col in self.feature_columns}
        row_dict["hour"] = hour
        row_dict["day"] = day
        row_dict["is_weekend"] = is_weekend
        row_dict["is_festival"] = fest_int
        row_dict["temp"] = temp
        row_dict["rain"] = rain
        
        temple_col = f"temple_{t_clean}"
        if temple_col in row_dict:
            row_dict[temple_col] = 1
            
        vector = np.array([[row_dict[col] for col in self.feature_columns]])
        return vector, t_clean

    def predict(self, temple_id: str, hour: int, day: int = 1, is_festival: bool = False, temp: float = 30.0, rain: int = 0):
        vec, t_clean = self._prepare_vector(temple_id, hour, day, is_festival, temp, rain)
        cfg = TEMPLE_CONFIGS[t_clean]
        
        pred_crowd = int(self.crowd_model.predict(vec)[0])
        pred_wait = int(self.wait_time_model.predict(vec)[0])
        
        occupancy_pct = round((pred_crowd / cfg["capacity"]) * 100, 1)
        
        # Determine status label in Hindi & English
        if occupancy_pct < 40:
            status_hi = "सामान्य (कम भीड़)"
            status_en = "Normal (Low Crowd)"
            level_code = "LOW"
            color = "#10B981"
            guidance_hi = "दर्शन के लिए अनुकूल समय है। कतार बहुत छोटी है।"
        elif occupancy_pct < 70:
            status_hi = "मध्यम भीड़"
            status_en = "Moderate Crowd"
            level_code = "MODERATE"
            color = "#F59E0B"
            guidance_hi = "सामान्य प्रतीक्षा समय। बुजुर्गों के लिए सुगम कतार उपलब्ध है।"
        elif occupancy_pct < 88:
            status_hi = "भारी भीड़"
            status_en = "High Crowd"
            level_code = "HIGH"
            color = "#E36414"
            guidance_hi = "कतार में समय लगेगा। कृपया पीने का पानी साथ रखें।"
        else:
            status_hi = "अत्यधिक भीड़ (भीषण)"
            status_en = "Severe Congestion"
            level_code = "CRITICAL"
            color = "#DC2626"
            guidance_hi = "भीड़ अत्यधिक है। बुजुर्ग एवं बालकों के साथ विशेष सावधानी बरतें।"

        return {
            "temple_id": t_clean,
            "temple_name": cfg["name"],
            "hour": hour,
            "predicted_devotees": pred_crowd,
            "estimated_wait_time_minutes": pred_wait,
            "capacity": cfg["capacity"],
            "occupancy_percentage": min(occupancy_pct, 100.0),
            "crowd_level": level_code,
            "status_hi": status_hi,
            "status_en": status_en,
            "badge_color": color,
            "guidance_hi": guidance_hi,
            "is_peak": hour in cfg["peak_hours"]
        }

    def forecast_24h(self, temple_id: str, day: int = 1, is_festival: bool = False):
        """Generates hourly forecast for visual Recharts display and planning."""
        t_clean = temple_id.lower().strip()
        forecast = []
        for hr in range(5, 23): # 5:00 AM to 10:00 PM
            res = self.predict(t_clean, hr, day, is_festival)
            time_label = f"{hr:02d}:00"
            period = "AM" if hr < 12 else "PM"
            display_hr = hr if hr <= 12 else hr - 12
            forecast.append({
                "hour": hr,
                "time_label": f"{display_hr}:00 {period}",
                "devotees": res["predicted_devotees"],
                "wait_minutes": res["estimated_wait_time_minutes"],
                "occupancy": res["occupancy_percentage"],
                "level": res["crowd_level"],
                "is_peak": res["is_peak"]
            })
            
        # Find optimal slots
        sorted_by_wait = sorted(forecast, key=lambda x: x["wait_minutes"])
        best_slots = sorted_by_wait[:3]
        
        return {
            "temple_id": t_clean,
            "forecast": forecast,
            "best_slots": best_slots
        }

    def detect_anomalies(self, temple_id: str, current_gate_counts: dict):
        """
        Real-time anomaly & bottleneck detection for temple command & control.
        """
        t_clean = temple_id.lower().strip()
        cfg = TEMPLE_CONFIGS.get(t_clean, TEMPLE_CONFIGS["somnath"])
        
        alerts = []
        total_inflow = sum(current_gate_counts.values())
        safe_max_inflow = cfg["capacity"] * 0.12 # Devotees/15min
        
        if total_inflow > safe_max_inflow:
            alerts.append({
                "severity": "CRITICAL",
                "gate": "ALL",
                "message_hi": f"कुल प्रवेश दर सुरक्षित सीमा से {int(((total_inflow-safe_max_inflow)/safe_max_inflow)*100)}% अधिक है। प्रवेश धीमा करें।",
                "message_en": f"Total ingress rate exceeds safe threshold by {int(((total_inflow-safe_max_inflow)/safe_max_inflow)*100)}%. Throttle entry.",
                "action_recommended": "GATE_HOLD"
            })
            
        for gate, count in current_gate_counts.items():
            gate_limit = safe_max_inflow * 0.45
            if count > gate_limit:
                alerts.append({
                    "severity": "WARNING",
                    "gate": gate,
                    "message_hi": f"{gate} पर असामान्य भीड़ दबाव दर्ज। अतिरिक्त कतार बैरिकेड सक्रिय करें।",
                    "message_en": f"Surge pressure detected at {gate}. Deploy queue barricades.",
                    "action_recommended": "REDIRECT_TO_SECONDARY_GATE"
                })
                
        return {
            "temple_id": t_clean,
            "anomaly_detected": len(alerts) > 0,
            "alerts": alerts,
            "total_inflow_rate": total_inflow,
            "safe_threshold": int(safe_max_inflow)
        }

# Singleton instance
ai_engine = PilgrimageCrowdAI()
