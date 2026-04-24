<template>
  <div class="table-wrapper">
    <div v-if="loading" class="loading-box">
      Chargement des contrôles...
    </div>

    <table v-else class="control-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Inspecteur</th>
          <th>Société</th>
          <th>État</th>
          <th>Criticité</th>
          <th>Observations</th>
          <th>Recommandations</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!controls.length">
          <td colspan="8" class="empty-row">
            Aucun contrôle enregistré
          </td>
        </tr>

        <tr v-for="control in controls" :key="control.id">
          <td>{{ formatDate(control.intervention_date) }}</td>

          <td>
            {{ control.inspector_name || "-" }}
            {{ control.inspector_firstname || "" }}
          </td>

          <td>{{ control.company || "-" }}</td>

          <td>
            <span class="badge" :class="statusClass(control.status)">
              {{ control.status || "-" }}
            </span>
          </td>

          <td>
            <span class="badge" :class="criticalityClass(control.criticality)">
              {{ formatCriticality(control.criticality) }}
            </span>
          </td>

          <td class="text-cell">
            {{ truncate(control.observations) }}
          </td>

          <td class="text-cell">
            {{ truncate(control.recommendations) }}
          </td>

          <td>
            <button class="btn-delete" @click="$emit('delete', control.id)">
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "PlcControlTable",

  props: {
    controls: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },

    truncate(text) {
      if (!text) return "-";
      return text.length > 45 ? text.substring(0, 45) + "..." : text;
    },

    statusClass(status) {
      if (status === "conforme") return "status-ok";
      if (status === "non conforme") return "status-warning";
      if (status === "critique") return "status-danger";
      return "status-default";
    },

    criticalityClass(level) {
      if (level === "low") return "crit-low";
      if (level === "medium") return "crit-medium";
      if (level === "high") return "crit-high";
      if (level === "critical") return "crit-critical";
      return "crit-medium";
    },

    formatCriticality(level) {
      if (level === "low") return "Faible";
      if (level === "medium") return "Moyenne";
      if (level === "high") return "Élevée";
      if (level === "critical") return "Critique";
      return "-";
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

.control-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1050px;
}

.control-table thead {
  background: #17324d;
  color: white;
}

.control-table th,
.control-table td {
  padding: 13px;
  text-align: left;
  font-size: 13px;
  border-bottom: 1px solid #edf1f5;
  vertical-align: top;
}

.badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-ok {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.status-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #b45309;
}

.status-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

.status-default {
  background: rgba(107, 114, 128, 0.15);
  color: #374151;
}

.crit-low {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.crit-medium {
  background: rgba(245, 158, 11, 0.15);
  color: #b45309;
}

.crit-high,
.crit-critical {
  background: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

.text-cell {
  max-width: 230px;
  color: #526476;
  line-height: 1.4;
}

.btn-delete {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  background: #e74c3c;
  color: white;
  font-size: 12px;
  cursor: pointer;
}

.btn-delete:hover {
  background: #c0392b;
}
</style>