<template>
  <div class="filter">

    <input
      placeholder="Rechercher..."
      :value="search"
      @input="$emit('search-change', $event.target.value)"
    />

    <select
      :value="selectedStatus"
      @change="$emit('status-change', $event.target.value)"
    >
      <option value="all">Tous</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="maintenance">Maintenance</option>
      <option value="hors_service">Hors service</option>
    </select>

  </div>
</template>

<script>
export default {
  props: ["search", "selectedStatus"]
};
</script>

<style scoped>
.filter {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

input, select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
</style>