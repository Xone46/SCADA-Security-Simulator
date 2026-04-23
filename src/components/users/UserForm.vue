<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-box">
      <div class="modal-header">
        <h2>{{ mode === "create" ? "Ajouter utilisateur" : "Modifier utilisateur" }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form class="form-grid" @submit.prevent="submitForm">
        <input v-model="form.matricule" type="text" placeholder="Matricule" required />
        <input v-model="form.nom" type="text" placeholder="Nom" required />
        <input v-model="form.prenom" type="text" placeholder="Prénom" required />
        <input v-model="form.email" type="email" placeholder="Email" required />

        <input
          v-model="form.password"
          type="password"
          :placeholder="mode === 'edit' ? 'Password (laisser vide si inchangé)' : 'Password'"
          :required="mode === 'create'"
        />

        <select v-model="form.role" required>
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="$emit('close')">Annuler</button>
          <button type="submit" class="btn-save">
            {{ mode === "create" ? "Créer" : "Enregistrer" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserForm",

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "create"
    },
    userData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      form: {
        id: null,
        matricule: "",
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role: "user"
      }
    };
  },

  watch: {
    userData: {
      immediate: true,
      handler(value) {
        if (value) {
          this.form = {
            id: value.id || null,
            matricule: value.matricule || "",
            nom: value.nom || "",
            prenom: value.prenom || "",
            email: value.email || "",
            password: "",
            role: value.role || "user"
          };
        } else {
          this.resetForm();
        }
      }
    },

    visible(newVal) {
      if (newVal && !this.userData) {
        this.resetForm();
      }
    }
  },

  methods: {
    resetForm() {
      this.form = {
        id: null,
        matricule: "",
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role: "user"
      };
    },

    submitForm() {
      const payload = { ...this.form };

      if (this.mode === "edit" && !payload.password) {
        delete payload.password;
      }

      this.$emit("save", payload);
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

.modal-box {
  width: 100%;
  max-width: 680px;
  background: white;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.modal-header h2 {
  margin: 0;
  color: #17324d;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.form-grid input,
.form-grid select {
  height: 46px;
  border: 1px solid #d6dde5;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.btn-cancel,
.btn-save {
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
}

.btn-cancel {
  background: #d1d5db;
  color: #111827;
}

.btn-save {
  background: #17324d;
  color: white;
}

@media (max-width: 760px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>