<template>
  <div class="dashboard-page">
    <div class="dashboard-overlay">
      <header class="topbar">
        <div class="brand">
          <h1>SCADA Security Simulator</h1>
          <p>Tableau de bord intelligent de supervision et d’audit</p>
        </div>

        <div class="user-box">
          <div class="user-info">
            <span class="user-name">{{ prenom }} {{ nom }}</span>
            <span class="user-role">Rôle : {{ roleLabel }}</span>
            <span class="user-matricule">Matricule : {{ matricule }}</span>
          </div>

          <button class="logout-btn" @click="logout">
            Déconnexion
          </button>
        </div>
      </header>

      <main class="dashboard-content">
        <section class="welcome-card">
          <h2>Bienvenue sur le Dashboard SCADA</h2>
          <p>
            Cette interface permet de superviser les variables industrielles,
            surveiller la communication OT, détecter les anomalies
            et consulter les alertes de sécurité dans un environnement SCADA simulé.
          </p>
        </section>

        <section class="section-block">
          <div class="section-header">
            <h2>État de l’architecture</h2>
            <span class="last-update">Dernière mise à jour : {{ formattedLastUpdate }}</span>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <h3>Interface Desktop</h3>
              <p class="stat-value">ACTIVE</p>
              <span class="stat-status active">Electron + Vue.js</span>
            </div>

            <div class="stat-card">
              <h3>Backend Node.js</h3>
              <p class="stat-value">{{ systemStatus.backend }}</p>
              <span class="stat-status" :class="statusBadgeClass(systemStatus.backend)">
                API interne
              </span>
            </div>

            <div class="stat-card">
              <h3>Module Python</h3>
              <p class="stat-value">{{ systemStatus.python }}</p>
              <span class="stat-status" :class="statusBadgeClass(systemStatus.python)">
                Analyse
              </span>
            </div>

            <div class="stat-card">
              <h3>Modbus TCP</h3>
              <p class="stat-value">{{ systemStatus.modbus }}</p>
              <span class="stat-status" :class="statusBadgeClass(systemStatus.modbus)">
                Communication
              </span>
            </div>

            <div class="stat-card">
              <h3>PLC simulé</h3>
              <p class="stat-value">{{ systemStatus.plc }}</p>
              <span class="stat-status" :class="statusBadgeClass(systemStatus.plc)">
                Source de données
              </span>
            </div>

            <div class="stat-card">
              <h3>Scénario d’attaque</h3>
              <p class="stat-value">{{ systemStatus.attack }}</p>
              <span
                class="stat-status"
                :class="systemStatus.attack === 'DETECTED' ? 'critical' : 'normal'"
              >
                Surveillance
              </span>
            </div>
          </div>
        </section>

        <section class="section-block">
          <div class="section-header">
            <h2>Variables industrielles temps réel</h2>
            <span class="refresh-note">Actualisation automatique toutes les 3 secondes</span>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <h3>Température</h3>
              <p class="stat-value">{{ scada.temperature }} °C</p>
              <span class="stat-status" :class="temperatureStatus.className">
                {{ temperatureStatus.label }}
              </span>
            </div>

            <div class="stat-card">
              <h3>Pression</h3>
              <p class="stat-value">{{ scada.pressure }} bar</p>
              <span class="stat-status" :class="pressureStatus.className">
                {{ pressureStatus.label }}
              </span>
            </div>

            <div class="stat-card">
              <h3>Vitesse moteur</h3>
              <p class="stat-value">{{ scada.speed }} rpm</p>
              <span class="stat-status" :class="speedStatus.className">
                {{ speedStatus.label }}
              </span>
            </div>

            <div class="stat-card">
              <h3>État système</h3>
              <p class="stat-value">{{ scada.state }}</p>
              <span class="stat-status" :class="stateStatus.className">
                {{ stateStatus.label }}
              </span>
            </div>
          </div>
        </section>

        <section class="section-block">
          <div class="section-header">
            <h2>Résumé sécurité</h2>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <h3>Alertes actives</h3>
              <p class="stat-value">{{ securitySummary.activeAlerts }}</p>
              <span class="stat-status warning">Sécurité</span>
            </div>

            <div class="stat-card">
              <h3>Anomalies détectées</h3>
              <p class="stat-value">{{ securitySummary.anomalies }}</p>
              <span class="stat-status critical">Détection</span>
            </div>

            <div class="stat-card">
              <h3>Niveau de risque</h3>
              <p class="stat-value" :class="riskClass">{{ riskAnalysis.level }}</p>
              <span class="stat-status" :class="riskBadgeClass">
                Score : {{ riskAnalysis.score }}/100
              </span>
            </div>

            <div class="stat-card">
              <h3>Dernier événement</h3>
              <p class="event-text">{{ securitySummary.lastEvent }}</p>
              <span class="stat-status active">Historique</span>
            </div>
          </div>
        </section>

        <section class="actions-grid">
          <router-link to="/alerts" class="action-card">
            <h3>Alertes de sécurité</h3>
            <p>Consulter les anomalies, incidents et alertes détectés.</p>
          </router-link>

          <router-link to="/audit-report" class="action-card">
            <h3>Rapport d’audit</h3>
            <p>Visualiser le rapport global d’audit de sécurité du système SCADA.</p>
          </router-link>
        </section>

        <section v-if="isAdmin" class="admin-section">
          <div class="admin-card">
            <h3>Niveau de risque global</h3>
            <p class="risk-value" :class="riskClass">{{ riskAnalysis.level }}</p>
            <p class="risk-score">Score : {{ riskAnalysis.score }}/100</p>
          </div>

          <div class="admin-card">
            <h3>Justification du risque</h3>
            <p>{{ riskAnalysis.justification }}</p>
          </div>

          <div class="admin-card">
            <h3>Recommandation</h3>
            <p>{{ riskAnalysis.recommendation }}</p>
          </div>
        </section>

        <section v-else class="user-section">
          <div class="user-card">
            <h3>Accès utilisateur</h3>
            <p>
              Vous êtes en mode consultation. Les détails avancés d’analyse de risque
              et les justifications complètes sont réservés à l’administrateur.
            </p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import ScadaService from "@/requests/scada";

export default {
  name: "DashboardView",

  data() {
    return {
      nom: "",
      prenom: "",
      matricule: "",
      role: "user",
      refreshTimer: null,
      lastUpdate: null,

      scada: {
        temperature: 0,
        pressure: 0,
        speed: 0,
        state: "UNKNOWN"
      },

      systemStatus: {
        backend: "ACTIVE",
        python: "ACTIVE",
        modbus: "CONNECTED",
        plc: "CONNECTED",
        attack: "INACTIVE"
      },

      securitySummary: {
        activeAlerts: 0,
        anomalies: 0,
        lastEvent: "Aucun événement critique"
      },

      riskAnalysis: {
        level: "FAIBLE",
        score: 0,
        justification: "Aucune analyse disponible pour le moment.",
        recommendation: "Aucune recommandation disponible."
      }
    };
  },

  computed: {
    isAdmin() {
      return this.role === "admin";
    },

    roleLabel() {
      return this.role === "admin" ? "Administrateur" : "Utilisateur";
    },

    formattedLastUpdate() {
      if (!this.lastUpdate) return "Aucune";
      return new Date(this.lastUpdate).toLocaleString();
    },

    temperatureStatus() {
      if (this.scada.temperature >= 80) {
        return { label: "Critique", className: "critical" };
      }
      if (this.scada.temperature >= 60) {
        return { label: "Surveillance", className: "warning" };
      }
      return { label: "Normal", className: "normal" };
    },

    pressureStatus() {
      if (this.scada.pressure >= 120) {
        return { label: "Critique", className: "critical" };
      }
      if (this.scada.pressure >= 100) {
        return { label: "Surveillance", className: "warning" };
      }
      return { label: "Normal", className: "normal" };
    },

    speedStatus() {
      if (this.scada.speed >= 3000) {
        return { label: "Critique", className: "critical" };
      }
      if (this.scada.speed >= 2200) {
        return { label: "Surveillance", className: "warning" };
      }
      return { label: "Stable", className: "normal" };
    },

    stateStatus() {
      if (this.scada.state === "STOPPED") {
        return { label: "Arrêté", className: "inactive" };
      }
      if (this.scada.state === "RUNNING") {
        return { label: "Actif", className: "active" };
      }
      return { label: "Inconnu", className: "warning" };
    },

    riskClass() {
      const level = (this.riskAnalysis.level || "").toLowerCase();

      if (level.includes("crit")) return "risk-critical";
      if (level.includes("élev") || level.includes("high")) return "risk-high";
      if (level.includes("moy") || level.includes("medium")) return "risk-medium";
      return "risk-low";
    },

    riskBadgeClass() {
      const score = Number(this.riskAnalysis.score || 0);
      if (score >= 75) return "critical";
      if (score >= 50) return "warning";
      return "normal";
    }
  },

  methods: {
    statusBadgeClass(value) {
      const normalized = String(value || "").toUpperCase();

      if (["ACTIVE", "CONNECTED", "RUNNING"].includes(normalized)) {
        return "active";
      }

      if (["ERROR", "FAILED", "DISCONNECTED"].includes(normalized)) {
        return "critical";
      }

      return "warning";
    },

    async loadLatestScadaData() {
      try {
        await ScadaService.poll();

        const response = await ScadaService.getLatestData();
        const data = response?.data?.data || response?.data || {};

        this.scada = {
          temperature: Number(data.temperature ?? 0),
          pressure: Number(data.pressure ?? 0),
          speed: Number(data.speed ?? 0),
          state: data.state || "UNKNOWN"
        };

        this.systemStatus.backend = "ACTIVE";
        this.systemStatus.modbus = "CONNECTED";
        this.systemStatus.plc = "CONNECTED";
      } catch (error) {
        console.error("Erreur chargement données SCADA :", error);
        this.systemStatus.backend = "ERROR";
        this.systemStatus.modbus = "DISCONNECTED";
        this.systemStatus.plc = "DISCONNECTED";
      }
    },

    async loadRiskAnalysis() {
      try {
        const response = await ScadaService.getRiskAnalysis();
        const data = response?.data?.data || response?.data || {};

        this.riskAnalysis = {
          level: data.level || "FAIBLE",
          score: Number(data.score ?? 0),
          justification: data.justification || "Aucune justification disponible.",
          recommendation: data.recommendation || "Aucune recommandation disponible."
        };

        this.securitySummary.activeAlerts = Number(data.activeAlerts ?? 0);
        this.securitySummary.anomalies = Number(data.anomalies ?? 0);
        this.securitySummary.lastEvent = data.lastEvent || "Aucun événement critique";

        this.systemStatus.python = "ACTIVE";
        this.systemStatus.attack =
          this.riskAnalysis.score >= 70 ? "DETECTED" : "INACTIVE";
      } catch (error) {
        console.error("Erreur chargement analyse de risque :", error);
        this.systemStatus.python = "ERROR";
      }
    },

    async refreshDashboard() {
      await this.loadLatestScadaData();
      await this.loadRiskAnalysis();
      this.lastUpdate = new Date().toISOString();
    },

    logout() {
      sessionStorage.clear();
      this.$router.push("/").catch(() => {});
    }
  },

  async mounted() {
    this.nom = sessionStorage.getItem("nom") || "";
    this.prenom = sessionStorage.getItem("prenom") || "";
    this.matricule = sessionStorage.getItem("matricule") || "";
    this.role = (sessionStorage.getItem("role") || "user").toLowerCase();

    await this.refreshDashboard();

    this.refreshTimer = setInterval(() => {
      this.refreshDashboard();
    }, 3000);
  },

  beforeDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }
};
</script>

<style scoped>
.dashboard-page {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #eef4f8, #dfeaf3);
  overflow: hidden;
}

.dashboard-overlay {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.topbar {
  width: 100%;
  min-height: 90px;
  background: rgba(255, 255, 255, 0.94);
  border-radius: 18px;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  gap: 16px;
}

.brand h1 {
  margin: 0;
  font-size: 28px;
  color: #17324d;
}

.brand p {
  margin: 6px 0 0;
  color: #5d6f82;
  font-size: 14px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
  gap: 3px;
}

.user-name {
  font-weight: 700;
  color: #17324d;
  font-size: 15px;
}

.user-role,
.user-matricule {
  color: #5d6f82;
  font-size: 13px;
}

.logout-btn {
  height: 42px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: #e74c3c;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #cf3e30;
  transform: translateY(-1px);
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.section-block {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  gap: 12px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #17324d;
}

.last-update,
.refresh-note {
  font-size: 13px;
  color: #5c6d80;
}

.welcome-card,
.user-card,
.admin-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.94);
  border-radius: 18px;
  padding: 20px 24px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-card h2,
.user-card h3,
.admin-card h3 {
  margin: 0 0 10px;
  color: #17324d;
}

.welcome-card p,
.user-card p,
.admin-card p {
  margin: 0;
  color: #526476;
  line-height: 1.6;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 150px;
  box-sizing: border-box;
}

.stat-card h3 {
  margin: 0;
  color: #17324d;
  font-size: 15px;
}

.stat-value {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #0f2235;
  word-break: break-word;
}

.event-text {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #0f2235;
  line-height: 1.5;
}

.stat-status {
  display: inline-flex;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.normal {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.warning {
  background: rgba(245, 158, 11, 0.15);
  color: #b45309;
}

.critical {
  background: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

.active {
  background: rgba(59, 130, 246, 0.15);
  color: #1d4ed8;
}

.inactive {
  background: rgba(107, 114, 128, 0.15);
  color: #374151;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.action-card {
  text-decoration: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.07);
  transition: all 0.2s ease;
  display: block;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1);
}

.action-card h3 {
  margin: 0 0 10px;
  color: #17324d;
  font-size: 18px;
}

.action-card p {
  margin: 0;
  color: #5c6d80;
  line-height: 1.6;
  font-size: 14px;
}

.admin-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.user-section {
  margin-top: 4px;
}

.risk-value {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px !important;
}

.risk-score {
  font-size: 14px;
  color: #526476;
}

.risk-low {
  color: #15803d;
}

.risk-medium {
  color: #b45309;
}

.risk-high {
  color: #b91c1c;
}

.risk-critical {
  color: #7f1d1d;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .admin-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-box {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .user-info {
    text-align: left;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .brand h1 {
    font-size: 22px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>