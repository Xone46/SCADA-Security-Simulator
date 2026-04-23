// backend/src/services/alertService.mjs

const alerts = [];

export function createAlert(anomaly) {
  const alert = {
    id: Date.now() + Math.random().toString(36).substring(2, 8),
    title: `Alerte de sécurité : ${anomaly.type}`,
    description: anomaly.message,
    severity: anomaly.severity,
    value: anomaly.value,
    threshold: anomaly.threshold,
    timestamp: anomaly.timestamp,
    status: "active"
  };

  alerts.unshift(alert);
  return alert;
}

export function getAllAlerts() {
  return alerts;
}

export function clearAlerts() {
  alerts.length = 0;
  return { message: "Toutes les alertes ont été supprimées" };
}