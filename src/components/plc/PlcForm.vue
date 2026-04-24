<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-box">
      <div class="modal-header">
        <h2>{{ mode === "create" ? "Ajouter PLC" : "Modifier PLC" }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="submitForm">
        <h3>Informations générales</h3>

        <div class="form-grid">
          <input v-model="form.name" placeholder="Nom du PLC *" required />
          <input v-model="form.tag" placeholder="Marquage / Tag industriel" />
          <input v-model="form.brand" placeholder="Marque" />
          <input v-model="form.manufacturer" placeholder="Constructeur" />
          <input v-model="form.model" placeholder="Modèle" />
          <input v-model="form.plc_type" placeholder="Type de PLC" />
          <input v-model="form.serial_number" placeholder="Numéro de série" />
          <input v-model="form.firmware_version" placeholder="Version firmware" />
        </div>

        <h3>Réseau industriel</h3>

        <div class="form-grid">
          <input v-model="form.ip_address" placeholder="Adresse IP *" required />
          <input v-model.number="form.port" type="number" placeholder="Port" />
          <input v-model="form.protocol" placeholder="Protocole" />
          <input v-model.number="form.unit_id" type="number" placeholder="Unit ID" />
          <input v-model="form.location" placeholder="Zone / Atelier" />
          <input v-model="form.production_line" placeholder="Ligne de production" />
        </div>

        <h3>Cycle de vie</h3>

        <div class="form-grid">
          <label>
            Date de mise en place
            <input v-model="form.installation_date" type="date" />
          </label>

          <label>
            Date de mise en service
            <input v-model="form.commissioning_date" type="date" />
          </label>

          <label v-if="form.status === 'hors_service'">
            Date hors service *
            <input v-model="form.decommissioning_date" type="date" required />
          </label>

          <select v-model="form.status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="hors_service">Hors service</option>
          </select>
        </div>

        <h3>Responsabilités</h3>

        <div class="form-grid">
          <input v-model="form.installed_by" placeholder="Installé par" />
          <input v-model="form.maintained_by" placeholder="Maintenu par" />
          <input v-model="form.supplier" placeholder="Fournisseur" />
          <input v-model="form.internal_owner" placeholder="Responsable interne" />
        </div>

        <textarea v-model="form.description" placeholder="Description du PLC"></textarea>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Annuler
          </button>

          <button type="submit" class="btn-save">
            {{ mode === "create" ? "Créer" : "Enregistrer" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const emptyForm = () => ({
  id: null,
  name: "",
  tag: "",
  brand: "",
  manufacturer: "",
  model: "",
  plc_type: "",
  serial_number: "",
  firmware_version: "",
  description: "",

  ip_address: "",
  port: 502,
  protocol: "Modbus TCP",
  unit_id: 1,
  location: "",
  production_line: "",

  installation_date: "",
  commissioning_date: "",
  decommissioning_date: "",
  status: "active",

  installed_by: "",
  maintained_by: "",
  supplier: "",
  internal_owner: ""
});

export default {
  name: "PlcForm",

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "create"
    },
    plcData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      form: emptyForm()
    };
  },

  watch: {
    plcData: {
      immediate: true,
      handler(value) {
        if (value) {
          this.form = {
            ...emptyForm(),
            ...value
          };
        } else {
          this.form = emptyForm();
        }
      }
    },

    visible(value) {
      if (value && !this.plcData) {
        this.form = emptyForm();
      }
    },

    "form.status"(value) {
      if (value !== "hors_service") {
        this.form.decommissioning_date = "";
      }
    }
  },

  methods: {
    submitForm() {
      if (this.form.status === "hors_service" && !this.form.decommissioning_date) {
        alert("La date hors service est obligatoire.");
        return;
      }

      this.$emit("save", { ...this.form });
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
  max-width: 950px;
  max-height: 92vh;
  overflow-y: auto;
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

h3 {
  color: #17324d;
  margin: 20px 0 12px;
  font-size: 16px;
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
  font-size: 13px;
  color: #526476;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

textarea {
  margin-top: 12px;
  min-height: 80px;
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