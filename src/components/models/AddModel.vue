<template>
  <div class="add-model" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="parent">
      <textarea v-model="value" placeholder="Écrivez votre texte ici..."></textarea>
      <div class="buttons">
        <button @click="ajouterModel" class="btn confirm">Ajouter</button>
        <button @click="annulerAddModel" class="btn cancel">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-model-component',
  props: {
    msg: String
  },
  data() {
    return {
      value: null
    }
  },
  methods: {
    ajouterModel() {
      this.$emit("ajouterModel", this.value);
    },
    annulerAddModel() {
      this.$emit("annulerAddModel");
    }
  }
}
</script>

<style scoped>
.add-model {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.parent {
  background: #fff;
  width: 80%;
  max-width: 600px;
  height: 320px;
  border-radius: 10px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

textarea {
  flex: 1;
  width: 100%;
  border: 2px solid #222;
  border-radius: 6px;
  padding: 15px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 20px;
  transition: border-color 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: #04AA6D;
  box-shadow: 0 0 8px rgba(4, 170, 109, 0.5);
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  background-color: #04AA6D;
  color: white;
  border: none;
  padding: 10px 28px;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.btn.cancel {
  background-color: #dc3545;
}

.btn:hover {
  filter: brightness(0.9);
}
</style>
