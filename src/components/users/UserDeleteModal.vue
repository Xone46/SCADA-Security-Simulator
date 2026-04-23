<template>
  <div v-if="visible" class="modal-overlay">
    <div class="delete-box">
      <h2>Confirmer la suppression</h2>
      <p>
        Voulez-vous vraiment supprimer l’utilisateur
        <strong>{{ user ? user.nom + " " + user.prenom : "" }}</strong> ?
      </p>

      <div class="actions">
        <button class="btn-cancel" @click="$emit('close')">Annuler</button>
        <button class="btn-delete" @click="$emit('confirm-delete')">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserDeleteModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: null
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 34, 53, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
}

.delete-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
}

.delete-box h2 {
  margin: 0 0 12px;
  color: #17324d;
}

.delete-box p {
  margin: 0 0 18px;
  color: #526476;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel,
.btn-delete {
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
}

.btn-cancel {
  background: #d1d5db;
  color: #111827;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}
</style>