// backend/src/services/auditReportService.mjs

export function generateAuditReport(scadaData = [], alerts = []) {
  const totalAlerts = alerts.length;

  const criticalAlerts = alerts.filter(a => a.severity === "critical").length;
  const highAlerts = alerts.filter(a => a.severity === "high").length;
  const mediumAlerts = alerts.filter(a => a.severity === "medium").length;
  const lowAlerts = alerts.filter(a => a.severity === "low").length;

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalDataPoints: scadaData.length,
      totalAlerts,
      criticalAlerts,
      highAlerts,
      mediumAlerts,
      lowAlerts
    },
    alerts,
    conclusion:
      totalAlerts > 0
        ? "Des anomalies de sécurité ont été détectées dans l’environnement SCADA simulé."
        : "Aucune anomalie critique détectée dans l’environnement SCADA simulé."
  };
}