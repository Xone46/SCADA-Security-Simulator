<template>
  <div v-if="visible" class="modal">
    <div class="box">

      <h3>Supprimer PLC</h3>

      <p>Confirmer suppression : {{ plc.name }}</p>

      <button @click="$emit('close')">Annuler</button>
      <button @click="$emit('confirm-delete')">Supprimer</button>

    </div>
  </div>
</template>

<script>
export default {
  props: ["visible", "plc"]
};
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

.box {
  background: white;
  padding: 20px;
  margin: 200px auto;
  width: 300px;
}
</style>