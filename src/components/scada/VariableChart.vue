<template>
  <div class="chart-card">
    <h3>{{ title }}</h3>
    <p><strong>Valeur actuelle :</strong> {{ value }}</p>
  </div>
</template>

<script>
export default {
  name: "VariableChart",
  props: {
    title: String,
    value: [Number, String]
  }
};
</script>

<style scoped>
.chart-card {
  padding: 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
</style>