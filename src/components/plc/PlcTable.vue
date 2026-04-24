<template>
  <div class="table-wrapper">
    <div v-if="loading" class="loading-box">
      Chargement des PLC...
    </div>

    <table v-else class="plc-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Marquage</th>
          <th>Marque</th>
          <th>Modèle</th>
          <th>Constructeur</th>
          <th>IP</th>
          <th>Port</th>
          <th>Protocole</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!plcs.length">
          <td colspan="10" class="empty-row">
            Aucun PLC trouvé
          </td>
        </tr>

        <tr v-for="plc in plcs" :key="plc.id">
          <td>{{ plc.name }}</td>
          <td>{{ plc.tag || "-" }}</td>
          <td>{{ plc.brand || "-" }}</td>
          <td>{{ plc.model || "-" }}</td>
          <td>{{ plc.manufacturer || "-" }}</td>
          <td>{{ plc.ip_address }}</td>
          <td>{{ plc.port }}</td>
          <td>{{ plc.protocol }}</td>

          <td>
            <span class="badge" :class="'status-' + (plc.status || 'active')">
              {{ formatStatus(plc.status) }}
            </span>
          </td>

          <td>
            <div class="actions">
              <router-link :to="'/plc/' + plc.id" class="btn-detail">
                Détails
              </router-link>

              <button class="btn-edit" @click="$emit('edit-plc', plc)">
                Modifier
              </button>

              <button class="btn-delete" @click="$emit('delete-plc', plc)">
                Supprimer
              </button>

              <button
                class="btn-status"
                :class="plc.status === 'active' ? 'btn-disable' : 'btn-enable'"
                @click="$emit('toggle-status', plc)"
              >
                {{ plc.status === "active" ? "Désactiver" : "Activer" }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "PlcTable",

  props: {
    plcs: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    formatStatus(status) {
      if (status === "active") return "Active";
      if (status === "inactive") return "Inactive";
      if (status === "maintenance") return "Maintenance";
      if (status === "hors_service") return "Hors service";
      return "Active";
    }
  }
};
</script>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.loading-box,
.empty-row {
  text-align: center;
  padding: 18px;
  color: #5d6f82;
}

.plc-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1150px;
}

.plc-table thead {
  background: #17324d;
  color: white;
}

.plc-table th,
.plc-table td {
  padding: 13px;
  text-align: left;
  font-size: 13.5px;
  border-bottom: 1px solid #edf1f5;
}

.badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
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

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.actions button,
.btn-detail {
  border: none;
  border-radius: 10px;
  padding: 8px 11px;
  font-size: 12.5px;
  cursor: pointer;
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-detail {
  background: #3498db;
}

.btn-edit {
  background: #f59e0b;
}

.btn-delete {
  background: #e74c3c;
}

.btn-enable {
  background: #2ecc71;
}

.btn-disable {
  background: #6b7280;
}
</style>