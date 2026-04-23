<template>
  <div class="report-page">
    <h1>Rapport d’audit</h1>

    <div v-if="report">
      <p><strong>Date :</strong> {{ report.generatedAt }}</p>
      <p><strong>Total alertes :</strong> {{ report.summary.totalAlerts }}</p>
      <p><strong>Critiques :</strong> {{ report.summary.criticalAlerts }}</p>
      <p><strong>Élevées :</strong> {{ report.summary.highAlerts }}</p>
      <p><strong>Moyennes :</strong> {{ report.summary.mediumAlerts }}</p>
      <p><strong>Faibles :</strong> {{ report.summary.lowAlerts }}</p>

      <h2>Conclusion</h2>
      <p>{{ report.conclusion }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AuditReportView",
  data() {
    return {
      report: null
    };
  },
  async mounted() {
    await this.loadReport();
  },
  methods: {
    async loadReport() {
      try {
        const response = await axios.get("http://localhost:3000/api/scada/audit-report");
        this.report = response.data.report;
      } catch (error) {
        console.error("Erreur chargement rapport :", error);
      }
    }
  }
};
</script>

<style scoped>
.report-page {
  padding: 20px;
}
</style>