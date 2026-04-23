<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h1>Gestion des utilisateurs</h1>
        <p>Ajouter, modifier, supprimer et consulter les utilisateurs du système.</p>
      </div>

      <button class="add-btn" @click="openCreateForm">
        Ajouter utilisateur
      </button>
    </div>

    <UserFilterBar
      :search="search"
      :selected-role="selectedRole"
      @search-change="handleSearchChange"
      @role-change="handleRoleChange"
    />

    <UsersTable
    :users="filteredUsers"
    :loading="loading"
    @edit-user="openEditForm"
    @delete-user="openDeleteModal"
    @toggle-status="toggleUserStatus"
    />

    <UserForm
      :visible="showForm"
      :mode="formMode"
      :user-data="selectedUser"
      @close="closeForm"
      @save="saveUser"
    />

    <UserDeleteModal
      :visible="showDelete"
      :user="selectedUser"
      @close="closeDeleteModal"
      @confirm-delete="confirmDelete"
    />
  </div>
</template>

<script>
import UserService from "@/requests/user";
import UserFilterBar from "@/components/users/UserFilterBar.vue";
import UsersTable from "@/components/users/UsersTable.vue";
import UserForm from "@/components/users/UserForm.vue";
import UserDeleteModal from "@/components/users/UserDeleteModal.vue";

export default {
  name: "UsersManagementView",

  components: {
    UserFilterBar,
    UsersTable,
    UserForm,
    UserDeleteModal
  },

  data() {
    return {
      users: [],
      loading: false,
      search: "",
      selectedRole: "all",
      showForm: false,
      showDelete: false,
      formMode: "create",
      selectedUser: null
    };
  },

  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const fullText = `${user.matricule || ""} ${user.nom || ""} ${user.prenom || ""} ${user.email || ""}`.toLowerCase();
        const matchesSearch = fullText.includes(this.search.toLowerCase());
        const matchesRole =
          this.selectedRole === "all" ? true : (user.role || "").toLowerCase() === this.selectedRole;

        return matchesSearch && matchesRole;
      });
    }
  },

  methods: {

    async toggleUserStatus(user) {
        try {
            const newStatus = user.status === "active" ? "inactive" : "active";

            await UserService.updateUserStatus(user.id, newStatus);

            alert("Statut modifié avec succès");

            await this.fetchUsers();

        } catch (error) {
            console.error("Erreur status:", error);
            alert("Erreur lors du changement de statut");
        }
    },

    async fetchUsers() {
      try {
        this.loading = true;
        const response = await UserService.getAllUsers();
        this.users = response?.data?.data || response?.data || [];
      } catch (error) {
        console.error("Erreur chargement utilisateurs :", error);
        alert("Erreur lors du chargement des utilisateurs");
      } finally {
        this.loading = false;
      }
    },

    handleSearchChange(value) {
      this.search = value;
    },

    handleRoleChange(value) {
      this.selectedRole = value;
    },

    openCreateForm() {
      this.formMode = "create";
      this.selectedUser = null;
      this.showForm = true;
    },

    openEditForm(user) {
      this.formMode = "edit";
      this.selectedUser = { ...user };
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
      this.selectedUser = null;
    },

    async saveUser(formData) {
      try {
        if (this.formMode === "create") {
          await UserService.inscription(formData);
          alert("Utilisateur ajouté avec succès");
        } else {
          await UserService.updateUser(formData.id, formData);
          alert("Utilisateur modifié avec succès");
        }

        this.closeForm();
        await this.fetchUsers();
      } catch (error) {
        console.error("Erreur sauvegarde utilisateur :", error);
        alert("Erreur lors de l’enregistrement de l’utilisateur");
      }
    },

    openDeleteModal(user) {
      this.selectedUser = { ...user };
      this.showDelete = true;
    },

    closeDeleteModal() {
      this.showDelete = false;
      this.selectedUser = null;
    },

    async confirmDelete() {
      try {
        if (!this.selectedUser?.id) return;

        await UserService.deleteUser(this.selectedUser.id);
        alert("Utilisateur supprimé avec succès");

        this.closeDeleteModal();
        await this.fetchUsers();
      } catch (error) {
        console.error("Erreur suppression utilisateur :", error);
        alert("Erreur lors de la suppression");
      }
    }
  },

  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.users-page {
  padding: 24px;
  min-height: 100%;
  background: #eef4f8;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #17324d;
  font-size: 28px;
}

.page-header p {
  margin: 6px 0 0;
  color: #5d6f82;
  font-size: 14px;
}

.add-btn {
  border: none;
  border-radius: 12px;
  background: #17324d;
  color: white;
  padding: 12px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-btn:hover {
  background: #0f2235;
}

@media (max-width: 760px) {
  .page-header {
    flex-direction: column;
  }

  .add-btn {
    width: 100%;
  }
}
</style>