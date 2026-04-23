<template>
  <div class="alert-card" :class="severityClass">
    <h3>{{ alert.title }}</h3>
    <p>{{ alert.description }}</p>
    <p><strong>Niveau :</strong> {{ alert.severity }}</p>
    <p><strong>Valeur :</strong> {{ alert.value }}</p>
    <p><strong>Date :</strong> {{ alert.timestamp }}</p>
  </div>
</template>

<script>
export default {
  name: "SecurityAlertCard",
  props: {
    alert: {
      type: Object,
      required: true
    }
  },
  computed: {
    severityClass() {
      return `severity-${this.alert.severity}`;
    }
  }
};
</script>

<style scoped>
.alert-card {
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  color: #222;
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.severity-low {
  border-left: 6px solid #22c55e;
}

.severity-medium {
  border-left: 6px solid #f59e0b;
}

.severity-high {
  border-left: 6px solid #ef4444;
}

.severity-critical {
  border-left: 6px solid #7f1d1d;
  background: #fff5f5;
}
</style>