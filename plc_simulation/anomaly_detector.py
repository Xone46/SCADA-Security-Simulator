# plc_simulation/anomaly_detector.py
import sys
import json

def detect_anomalies(data):
    anomalies = []

    temperature = data.get("temperature", 0)
    pressure = data.get("pressure", 0)
    motor_speed = data.get("motorSpeed", 0)

    if temperature > 80:
        anomalies.append({
            "type": "temperature",
            "severity": "high",
            "message": "Température anormale détectée",
            "value": temperature,
            "threshold": 80
        })

    if pressure > 120:
        anomalies.append({
            "type": "pressure",
            "severity": "high",
            "message": "Pression anormale détectée",
            "value": pressure,
            "threshold": 120
        })

    if motor_speed > 3000:
        anomalies.append({
            "type": "motorSpeed",
            "severity": "medium",
            "message": "Vitesse moteur anormale",
            "value": motor_speed,
            "threshold": 3000
        })

    return anomalies

if __name__ == "__main__":
    try:
        raw_input = sys.argv[1]
        data = json.loads(raw_input)
        anomalies = detect_anomalies(data)

        result = {
            "isAnomalous": len(anomalies) > 0,
            "anomalies": anomalies
        }

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({
            "isAnomalous": False,
            "anomalies": [],
            "error": str(e)
        }))