// backend/src/services/anomalyService.mjs

export function analyzeScadaData(data) {
  const anomalies = [];

  if (data.temperature > 80) {
    anomalies.push({
      type: "temperature",
      severity: "high",
      message: "Température anormalement élevée",
      value: data.temperature,
      threshold: 80,
      timestamp: new Date().toISOString()
    });
  }

  if (data.pressure > 120) {
    anomalies.push({
      type: "pressure",
      severity: "high",
      message: "Pression anormalement élevée",
      value: data.pressure,
      threshold: 120,
      timestamp: new Date().toISOString()
    });
  }

  if (data.motorSpeed > 3000) {
    anomalies.push({
      type: "motorSpeed",
      severity: "medium",
      message: "Vitesse moteur anormale",
      value: data.motorSpeed,
      threshold: 3000,
      timestamp: new Date().toISOString()
    });
  }

  if (data.startStopCount && data.startStopCount > 10) {
    anomalies.push({
      type: "command_behavior",
      severity: "critical",
      message: "Trop de commandes Start/Stop en peu de temps",
      value: data.startStopCount,
      threshold: 10,
      timestamp: new Date().toISOString()
    });
  }

  return {
    isAnomalous: anomalies.length > 0,
    anomalies
  };
}