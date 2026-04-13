<template>
  <div class="verified" role="alert" aria-live="assertive">
    <div class="parent">
      <div class="message">
        {{ msg }}
      </div>
      <div class="buttons">
        <button @click="annuller" class="btn confirm">Je comprends</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'verified-component',
  props: {
    msg: String
  },
  methods: {
    annuller() {
      this.$emit("annuller");
    }
  }
}
</script>

<style scoped>
.verified {
  position: fixed;
  inset: 0;
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
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  max-width: 360px;
  width: 90vw;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.message {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 20px;
  user-select: text;
}

.buttons {
  display: flex;
  justify-content: center;
}

.btn {
  background-color: #28a745;
  color: white;
  cursor: pointer;
  border: none;
  padding: 10px 25px;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  user-select: none;
}

.btn:hover {
  background-color: #218838;
}
</style>
