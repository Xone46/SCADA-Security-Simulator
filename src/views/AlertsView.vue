<template>
  <div class="alerts-page">
    <h1>Alertes de sécurité</h1>

    <div v-if="alerts.length === 0">
      Aucune alerte détectée.
    </div>

    <SecurityAlertCard
      v-for="alert in alerts"
      :key="alert.id"
      :alert="alert"
    />
  </div>
</template>

<script>
import axios from "axios";
import SecurityAlertCard from "@/components/scada/SecurityAlertCard.vue";

export default {
  name: "AlertsView",
  components: {
    SecurityAlertCard
  },
  data() {
    return {
      alerts: []
    };
  },
  async mounted() {
    await this.loadAlerts();
  },
  methods: {
    async loadAlerts() {
      try {
        const response = await axios.get("http://localhost:3000/api/scada/alerts");
        this.alerts = response.data.alerts || [];
      } catch (error) {
        console.error("Erreur chargement alertes :", error);
      }
    }
  }
};
</script>

<style scoped>
.alerts-page {
  padding: 20px;
}
</style>