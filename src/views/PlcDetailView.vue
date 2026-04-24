<template>
  <div class="plc-detail-page">
    <div class="page-header">
      <div>
        <button class="back-btn" @click="$router.back()">← Retour</button>
        <h1>{{ plc.name || "Détail PLC" }}</h1>
        <p>Fiche technique et historique des contrôles manuels</p>
      </div>

      <button class="add-btn" @click="showForm = true">
        + Ajouter contrôle
      </button>
    </div>

    <section class="info-card">
      <div class="card-title">
        <h2>Informations PLC</h2>
        <span class="status-badge" :class="'status-' + (plc.status || 'active')">
          {{ formatStatus(plc.status) }}
        </span>
      </div>

      <div class="info-grid">
        <div>
          <label>Nom</label>
          <p>{{ plc.name || "-" }}</p>
        </div>

        <div>
          <label>Marquage</label>
          <p>{{ plc.tag || "-" }}</p>
        </div>

        <div>
          <label>Marque</label>
          <p>{{ plc.brand || "-" }}</p>
        </div>

        <div>
          <label>Constructeur</label>
          <p>{{ plc.manufacturer || "-" }}</p>
        </div>

        <div>
          <label>Modèle</label>
          <p>{{ plc.model || "-" }}</p>
        </div>

        <div>
          <label>Type</label>
          <p>{{ plc.plc_type || "-" }}</p>
        </div>

        <div>
          <label>Adresse IP</label>
          <p>{{ plc.ip_address || "-" }}</p>
        </div>

        <div>
          <label>Port</label>
          <p>{{ plc.port || "-" }}</p>
        </div>

        <div>
          <label>Protocole</label>
          <p>{{ plc.protocol || "-" }}</p>
        </div>

        <div>
          <label>Unit ID</label>
          <p>{{ plc.unit_id || "-" }}</p>
        </div>

        <div>
          <label>Zone</label>
          <p>{{ plc.location || "-" }}</p>
        </div>

        <div>
          <label>Ligne production</label>
          <p>{{ plc.production_line || "-" }}</p>
        </div>
      </div>
    </section>

    <section class="control-section">
      <div class="section-header">
        <div>
          <h2>Historique des contrôles</h2>
          <p>Contrôles manuels réalisés par inspecteur ou auditeur</p>
        </div>
      </div>

      <PlcControlTable
        :controls="controls"
        :loading="loadingControls"
        @delete="deleteControl"
      />
    </section>

    <PlcControlForm
      :visible="showForm"
      :plcId="plc.id"
      @close="showForm = false"
      @saved="afterSavedControl"
    />
  </div>
</template>

<script>
import PlcService from "@/requests/plc";
import PlcControlService from "@/requests/plcControl";
import PlcControlTable from "@/components/plc/PlcControlTable.vue";
import PlcControlForm from "@/components/plc/PlcControlForm.vue";

export default {
  name: "PlcDetailView",

  components: {
    PlcControlTable,
    PlcControlForm
  },

  data() {
    return {
      plc: {},
      controls: [],
      showForm: false,
      loadingControls: false
    };
  },

  methods: {
    async loadPlc() {
      const id = this.$route.params.id;
      const res = await PlcService.getPlcById(id);
      this.plc = res.data.data;
    },

    async loadControls() {
      if (!this.plc.id) return;

      this.loadingControls = true;

      try {
        const res = await PlcControlService.getControls(this.plc.id);
        this.controls = res.data.data || [];
      } catch (error) {
        console.error("Erreur chargement contrôles :", error);
        alert("Erreur lors du chargement des contrôles");
      } finally {
        this.loadingControls = false;
      }
    },

    async deleteControl(id) {
      if (!confirm("Voulez-vous vraiment supprimer ce contrôle ?")) return;

      try {
        await PlcControlService.deleteControl(id);
        await this.loadControls();
      } catch (error) {
        console.error("Erreur suppression contrôle :", error);
        alert("Erreur lors de la suppression");
      }
    },

    async afterSavedControl() {
      this.showForm = false;
      await this.loadControls();
    },

    formatStatus(status) {
      if (status === "active") return "Active";
      if (status === "inactive") return "Inactive";
      if (status === "maintenance") return "Maintenance";
      if (status === "hors_service") return "Hors service";
      return "Active";
    }
  },

  async mounted() {
    await this.loadPlc();
    await this.loadControls();
  }
};
</script>

<style scoped>
.plc-detail-page {
  padding: 24px;
  min-height: 100%;
  background: #eef4f8;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.back-btn {
  border: none;
  background: transparent;
  color: #17324d;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 8px;
}

.page-header h1 {
  margin: 0;
  color: #17324d;
  font-size: 30px;
}

.page-header p {
  margin: 6px 0 0;
  color: #5d6f82;
  font-size: 14px;
}

.add-btn {
  border: none;
  border-radius: 12px;
  background: #17324d;
  color: white;
  padding: 12px 18px;
  font-size: 14px;
  cursor: pointer;
}

.add-btn:hover {
  background: #0f2235;
}

.info-card,
.control-section {
  background: white;
  border-radius: 18px;
  padding: 22px;
  margin-bottom: 20px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.card-title,
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-title h2,
.section-header h2 {
  margin: 0;
  color: #17324d;
  font-size: 21px;
}

.section-header p {
  margin: 6px 0 0;
  color: #5d6f82;
  font-size: 14px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.info-grid div {
  background: #f8fafc;
  border: 1px solid #edf1f5;
  border-radius: 14px;
  padding: 14px;
}

.info-grid label {
  display: block;
  font-size: 12px;
  color: #718096;
  margin-bottom: 6px;
}

.info-grid p {
  margin: 0;
  color: #17324d;
  font-weight: 600;
  font-size: 14px;
}

.status-badge {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-active {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.status-inactive {
  background: rgba(107, 114, 128, 0.15);
  color: #374151;
}

.status-maintenance {
  background: rgba(245, 158, 11, 0.15);
  color: #b45309;
}

.status-hors_service {
  background: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

@media (max-width: 1200px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .page-header {
    flex-direction: column;
  }

  .add-btn {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>