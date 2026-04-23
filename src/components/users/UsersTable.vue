<template>
  <div class="table-wrapper">
    <div v-if="loading" class="loading-box">
      Chargement des utilisateurs...
    </div>

    <table v-else class="users-table">
      <thead>
        <tr>
          <th>Matricule</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!users.length">
          <td colspan="7" class="empty-row">Aucun utilisateur trouvé</td>
        </tr>

        <tr v-for="user in users" :key="user.id">
          <td>{{ user.matricule }}</td>
          <td>{{ user.nom }}</td>
          <td>{{ user.prenom }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span class="badge" :class="user.role === 'admin' ? 'badge-admin' : 'badge-user'">
              {{ user.role }}
            </span>
          </td>
          <td>
            <span class="badge badge-status">
              {{ user.status || "active" }}
            </span>
          </td>
          <td>
            <div class="actions">
            <button class="btn-edit" @click="$emit('edit-user', user)">
                Modifier
            </button>

            <button class="btn-delete" @click="$emit('delete-user', user)">
                Supprimer
            </button>

            <button
                class="btn-status"
                :class="user.status === 'active' ? 'active-btn' : 'inactive-btn'"
                @click="$emit('toggle-status', user)"
            >
                {{ user.status === 'active' ? 'Désactiver' : 'Activer' }}
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
  name: "UsersTable",
  props: {
    users: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
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

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #17324d;
  color: white;
}

.users-table th,
.users-table td {
  padding: 14px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #edf1f5;
}

.badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-admin {
  background: rgba(59, 130, 246, 0.15);
  color: #1d4ed8;
}

.badge-user {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.badge-status {
  background: rgba(107, 114, 128, 0.15);
  color: #374151;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-edit,
.btn-delete {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}

.btn-edit {
  background: #f59e0b;
  color: white;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-status {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}

.active-btn {
  background: #e74c3c;
  color: white;
}

.inactive-btn {
  background: #2ecc71;
  color: white;
}
</style>