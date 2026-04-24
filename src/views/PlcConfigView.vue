<template>
  <div class="page">

    <div class="header">
      <div>
        <h1>Gestion PLC</h1>
        <p>Gestion des automates industriels</p>
      </div>

      <button class="btn-add" @click="openCreate">
        + Ajouter PLC
      </button>
    </div>

    <PlcFilterBar
      :search="search"
      :selected-status="status"
      @search-change="search = $event"
      @status-change="status = $event"
    />

    <PlcTable
      :plcs="filteredPlcs"
      :loading="loading"
      @edit-plc="openEdit"
      @delete-plc="openDelete"
      @toggle-status="toggleStatus"
    />

    <PlcForm
      :visible="showForm"
      :mode="mode"
      :plc-data="selected"
      @close="showForm = false"
      @save="save"
    />

    <PlcDeleteModal
      :visible="showDelete"
      :plc="selected"
      @close="showDelete = false"
      @confirm-delete="remove"
    />

  </div>
</template>

<script>
import PlcService from "@/requests/plc";
import PlcTable from "@/components/plc/PlcTable.vue";
import PlcForm from "@/components/plc/PlcForm.vue";
import PlcDeleteModal from "@/components/plc/PlcDeleteModal.vue";
import PlcFilterBar from "@/components/plc/PlcFilterBar.vue";

export default {
  components: {
    PlcTable,
    PlcForm,
    PlcDeleteModal,
    PlcFilterBar
  },

  data() {
    return {
      plcs: [],
      loading: false,
      search: "",
      status: "all",

      showForm: false,
      showDelete: false,

      mode: "create",
      selected: null
    };
  },

  computed: {
    filteredPlcs() {
      return this.plcs.filter(p => {
        const txt = `${p.name} ${p.tag} ${p.brand} ${p.ip_address}`.toLowerCase();

        const s = this.search.toLowerCase();

        const matchSearch = txt.includes(s);

        const matchStatus =
          this.status === "all"
            ? true
            : p.status === this.status;

        return matchSearch && matchStatus;
      });
    }
  },

  methods: {
    async load() {
      this.loading = true;
      const res = await PlcService.getAllPlcs();
      this.plcs = res.data.data;
      this.loading = false;
    },

    openCreate() {
      this.mode = "create";
      this.selected = null;
      this.showForm = true;
    },

    openEdit(plc) {
      this.mode = "edit";
      this.selected = { ...plc };
      this.showForm = true;
    },

    openDelete(plc) {
      this.selected = plc;
      this.showDelete = true;
    },

    async save(data) {
      if (this.mode === "create") {
        await PlcService.createPlc(data);
      } else {
        await PlcService.updatePlc(data.id, data);
      }

      this.showForm = false;
      this.load();
    },

    async remove() {
      await PlcService.deletePlc(this.selected.id);
      this.showDelete = false;
      this.load();
    },

    async toggleStatus(plc) {
      let newStatus = plc.status === "active" ? "inactive" : "active";

      await PlcService.updatePlcStatus(plc.id, newStatus);
      this.load();
    }
  },

  mounted() {
    this.load();
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.btn-add {
  background: #17324d;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}
</style>