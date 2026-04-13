<template>
<div v-if="showModal" class="modal" @click="closeModal">
  <img :src="modalImg" alt="Photo agrandie" class="modal-content"/>
</div>
</template>

<script>
export default {
  name: "PhotoModal",
  props: {
    modalImg: String,    // image à afficher
    showModal: Boolean,  // contrôle l'affichage du modal
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: zoom-out;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.5);
  transition: transform 0.3s;
}
</style>

