<template>
  <div class="insert">
    <div class="parent">
      <div class="message">
        Veuillez écrire la valeur ci-dessous :
      </div>
      <textarea
        v-model="val"
        placeholder="Votre texte ici..."
      ></textarea>
      <div class="buttons">
        <button @click="valider" class="btn confirm">Valider</button>
        <button @click="annuler" class="btn cancel">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'insert-component',
  props: {
    typeInsert: String,
    valueInsert: String
  },
  data() {
    return {
      val: ""
    }
  },
  methods: {
    valider() {
      this.$emit('valider', this.val, this.typeInsert);
    },
    annuler() {
      this.$emit('annuler');
    }
  },
  created() {
    this.val = this.valueInsert;
  }
}
</script>

<style scoped>
.insert {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
  box-sizing: border-box;
}

.parent {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  gap: 1.5rem;
}

.message {
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
}

textarea {
  width: 100%;
  resize: vertical;
  min-height: 160px;
  border: 2px solid #222;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

textarea:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 6px rgba(40, 167, 69, 0.4);
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  user-select: none;
  transition: background-color 0.3s ease;
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
