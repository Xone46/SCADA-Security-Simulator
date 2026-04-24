<template>
  <div class="page">
    <div class="header">
      <div>
        <h1>Plans industriels</h1>
        <p>Cartographie OT / SCADA par atelier ou département</p>
      </div>

      <button v-if="isAdmin" class="btn-add" @click="showForm = !showForm">
        + Nouveau plan
      </button>
    </div>

    <div v-if="showForm" class="form-card">
      <input v-model="form.name" placeholder="Nom du plan *" />
      <input v-model="form.department" placeholder="Département / Atelier" />
      <input v-model="form.site" placeholder="Site / Usine" />
      <input v-model="form.responsible" placeholder="Responsable" />
      <textarea v-model="form.description" placeholder="Description"></textarea>

      <div class="form-actions">
        <button class="btn-cancel" @click="showForm = false">Annuler</button>
        <button class="btn-save" @click="createPlan">Créer</button>
      </div>
    </div>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Département</th>
            <th>Site</th>
            <th>Responsable</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!plans.length">
            <td colspan="6" class="empty">Aucun plan trouvé</td>
          </tr>

          <tr v-for="plan in plans" :key="plan.id">
            <td>{{ plan.name }}</td>
            <td>{{ plan.department || "-" }}</td>
            <td>{{ plan.site || "-" }}</td>
            <td>{{ plan.responsible || "-" }}</td>
            <td>
              <span class="badge">{{ plan.status || "active" }}</span>
            </td>
            <td class="actions">
              <router-link class="btn-design" :to="'/architecture/designer/' + plan.id">
                {{ isAdmin ? "Designer" : "Voir" }}
              </router-link>

              <button v-if="isAdmin" class="btn-delete" @click="deletePlan(plan.id)">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ArchitectureService from "@/requests/architecture";

export default {
  name: "ArchitectureView",

  data() {
    return {
      plans: [],
      showForm: false,
      form: {
        name: "",
        department: "",
        site: "",
        responsible: "",
        description: "",
        status: "active"
      }
    };
  },

  computed: {
    isAdmin() {
      return (sessionStorage.getItem("role") || "user").toLowerCase() === "admin";
    }
  },

  methods: {
    async loadPlans() {
      try {
        const res = await ArchitectureService.getPlans();
        this.plans = res.data.data || [];
      } catch (error) {
        console.error("Erreur plans :", error);
      }
    },

    async createPlan() {
      if (!this.form.name) {
        alert("Nom du plan obligatoire");
        return;
      }

      await ArchitectureService.createPlan(this.form);

      this.form = {
        name: "",
        department: "",
        site: "",
        responsible: "",
        description: "",
        status: "active"
      };

      this.showForm = false;
      await this.loadPlans();
    },

    async deletePlan(id) {
      if (!confirm("Supprimer ce plan ?")) return;
      await ArchitectureService.deletePlan(id);
      await this.loadPlans();
    }
  },

  mounted() {
    this.loadPlans();
  }
};
</script>

<style scoped>
.page {
  padding: 24px;
  background: #eef4f8;
  min-height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #17324d;
}

.header p {
  margin: 6px 0 0;
  color: #5d6f82;
}

.btn-add,
.btn-save,
.btn-design,
.btn-delete,
.btn-cancel {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-size: 13px;
}

.btn-add,
.btn-save,
.btn-design {
  background: #17324d;
}

.btn-delete {
  background: #e74c3c;
}

.btn-cancel {
  background: #6b7280;
}

.form-card,
.table-card {
  background: white;
  padding: 18px;
  border-radius: 18px;
  margin-bottom: 18px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.form-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.form-card input,
.form-card textarea {
  border: 1px solid #d6dde5;
  border-radius: 10px;
  padding: 10px;
  outline: none;
}

.form-card textarea,
.form-actions {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #17324d;
  color: white;
}

th,
td {
  padding: 13px;
  border-bottom: 1px solid #edf1f5;
  text-align: left;
}

.actions {
  display: flex;
  gap: 8px;
}

.empty {
  text-align: center;
  color: #5d6f82;
}

.badge {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}
</style>