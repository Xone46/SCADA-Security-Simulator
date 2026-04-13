<template> 
  <div class="verified">
    <div class="parent">
      <div class="message">
        Êtes-vous sûr de supprimer cet élément ?
      </div>
      <div class="buttons">
        <button @click="$emit('confirmer')" class="btn confirm">Confirmer</button>
        <button @click="$emit('retirer')" class="btn cancel">Se retirer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'verified-component',
  data() {
    return {};
  },
  methods: {}
}
</script>

<style scoped>
.verified {
  position: fixed;
  inset: 0; /* raccourci top, bottom, left, right à 0 */
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.parent {
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 90vw;
  text-align: center;
}

.message {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #fff;
  user-select: none;
}

.btn.confirm {
  background-color: #28a745;
}
.btn.confirm:hover {
  background-color: #218838;
}

.btn.cancel {
  background-color: #dc3545;
}
.btn.cancel:hover {
  background-color: #c82333;
}
</style>
