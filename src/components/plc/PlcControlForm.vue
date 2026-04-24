<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-box">
      <div class="modal-header">
        <h2>Ajouter un contrôle manuel</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="save">
        <div class="form-grid">
          <input v-model="form.inspector_name" placeholder="Nom inspecteur *" required />
          <input v-model="form.inspector_firstname" placeholder="Prénom inspecteur *" required />
          <input v-model="form.company" placeholder="Société / organisme" />

          <label>
            Date d’intervention *
            <input v-model="form.intervention_date" type="date" required />
          </label>

          <select v-model="form.status" required>
            <option value="conforme">Conforme</option>
            <option value="non conforme">Non conforme</option>
            <option value="critique">Critique</option>
          </select>

          <select v-model="form.criticality" required>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
            <option value="critical">Critique</option>
          </select>
        </div>

        <textarea v-model="form.observations" placeholder="Observations"></textarea>
        <textarea v-model="form.recommendations" placeholder="Recommandations"></textarea>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Annuler
          </button>
          <button type="submit" class="btn-save">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import PlcControlService from "@/requests/plcControl";

const emptyForm = () => ({
  inspector_name: "",
  inspector_firstname: "",
  company: "",
  intervention_date: "",
  status: "conforme",
  criticality: "medium",
  observations: "",
  recommendations: ""
});

export default {
  name: "PlcControlForm",

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    plcId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      form: emptyForm()
    };
  },

  watch: {
    visible(value) {
      if (value) {
        this.form = emptyForm();
      }
    }
  },

  methods: {
    async save() {
      try {
        await PlcControlService.createControl({
          ...this.form,
          plc_id: this.plcId
        });

        this.$emit("saved");
        this.$emit("close");
      } catch (error) {
        console.error("Erreur ajout contrôle :", error);
        alert("Erreur lors de l’ajout du contrôle");
      }
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
  max-width: 760px;
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
  font-size: 22px;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.form-grid input,
.form-grid select,
textarea {
  width: 100%;
  min-height: 44px;
  border: 1px solid #d6dde5;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #526476;
  font-size: 13px;
}

textarea {
  margin-top: 12px;
  min-height: 85px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
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