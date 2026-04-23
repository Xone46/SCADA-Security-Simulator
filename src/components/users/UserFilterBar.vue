<template>
  <div class="filter-bar">
    <input
      type="text"
      class="filter-input"
      :value="search"
      @input="$emit('search-change', $event.target.value)"
      placeholder="Rechercher par matricule, nom, prénom ou email"
    />

    <select
      class="filter-select"
      :value="selectedRole"
      @change="$emit('role-change', $event.target.value)"
    >
      <option value="all">Tous les rôles</option>
      <option value="admin">Administrateur</option>
      <option value="user">Utilisateur</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "UserFilterBar",
  props: {
    search: {
      type: String,
      default: ""
    },
    selectedRole: {
      type: String,
      default: "all"
    }
  }
};
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}

.filter-input,
.filter-select {
  height: 46px;
  border: 1px solid #d6dde5;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
  background: white;
}

.filter-input {
  flex: 1;
}

.filter-select {
  min-width: 200px;
}

@media (max-width: 760px) {
  .filter-bar {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }
}
</style>