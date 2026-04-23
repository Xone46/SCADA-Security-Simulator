<template>
  <div class="login">
    <div class="form" v-if="flagForm">
      <div v-if="successMessage" class="success">
        {{ successMessage }}
      </div>

      <ul v-if="flagMessage" class="errors">
        <li v-for="(error, index) in errors" :key="index">- {{ error }}</li>
      </ul>

      <label>
        <h3>Matricule : <span class="start">*</span></h3>
        <input
          type="text"
          v-model.trim="matricule"
          placeholder="Votre matricule"
        />
      </label>

      <label>
        <h3>Nom : <span class="start">*</span></h3>
        <input
          type="text"
          v-model.trim="nom"
          placeholder="Votre nom"
        />
      </label>

      <label>
        <h3>Prénom : <span class="start">*</span></h3>
        <input
          type="text"
          v-model.trim="prenom"
          placeholder="Votre prénom"
        />
      </label>

      <label>
        <h3>E-mail : <span class="start">*</span></h3>
        <input
          type="email"
          v-model.trim="email"
          placeholder="Votre email"
        />
      </label>

      <label class="password-label">
        <h3>Mot de passe : <span class="start">*</span></h3>
        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @keyup.enter="inscrit"
            placeholder="Votre mot de passe"
          />
          <span class="toggle-password" @click="toggleShowPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>
      </label>

      <label>
        <h3>Rôle : <span class="start">*</span></h3>
        <select v-model="role">
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </label>

      <div class="buttons">
        <button class="connexion" @click="inscrit" :disabled="flagSpinner">
          S'inscrire
        </button>
        <button class="quitter" @click="quitter" :disabled="flagSpinner">
          Quitter
        </button>
      </div>
    </div>

    <div class="spinner" v-if="flagSpinner">
      <Spinner />
    </div>
  </div>
</template>

<script>
import User from "@/requests/user";
import Spinner from "vue-simple-spinner";

export default {
  name: "UserComponent",
  components: { Spinner },

  data() {
    return {
      matricule: "",
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role: "user",
      showPassword: false,
      flagSpinner: false,
      flagForm: true,
      flagMessage: false,
      successMessage: "",
      errors: []
    };
  },

  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },

    quitter() {
      if (this.flagSpinner) return;
      this.$emit("quitter");
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    async inscrit() {
      this.errors = [];
      this.flagMessage = false;
      this.successMessage = "";

      if (!this.matricule) this.errors.push("Le matricule est requis.");
      if (!this.nom) this.errors.push("Le nom est requis.");
      if (!this.prenom) this.errors.push("Le prénom est requis.");

      if (!this.email) {
        this.errors.push("L'email est requis.");
      } else if (!this.isValidEmail(this.email)) {
        this.errors.push("Le format de l'email est invalide.");
      }

      if (!this.password) {
        this.errors.push("Le mot de passe est requis.");
      } else if (this.password.length < 6) {
        this.errors.push("Le mot de passe doit contenir au moins 6 caractères.");
      }

      if (!this.role) {
        this.errors.push("Le rôle est requis.");
      }

      if (this.errors.length) {
        this.flagMessage = true;
        return;
      }

      this.flagForm = false;
      this.flagSpinner = true;

      try {
        const result = await User.inscription({
          matricule: this.matricule,
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          password: this.password,
          role: this.role
        });

        this.flagSpinner = false;
        this.flagForm = true;

        if (result?.data) {
          this.successMessage = "Inscription réussie ! Vous pouvez maintenant vous connecter.";
          this.matricule = "";
          this.nom = "";
          this.prenom = "";
          this.email = "";
          this.password = "";
          this.role = "user";
          this.showPassword = false;
        } else {
          this.errors = ["Inscription échouée."];
          this.flagMessage = true;
        }
      } catch (error) {
        this.flagSpinner = false;
        this.flagForm = true;
        this.flagMessage = true;

        if (error?.response?.data?.errors) {
          this.errors = Array.isArray(error.response.data.errors)
            ? error.response.data.errors
            : [error.response.data.errors];
        } else if (error?.response?.data?.message) {
          this.errors = [error.response.data.message];
        } else {
          this.errors = ["Erreur lors de l'inscription. Veuillez réessayer."];
        }
      }
    }
  }
};
</script>

<style scoped>
.login {
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  background: #f4f6f8;
}

.form {
  width: 100%;
  max-width: 360px;
  background: #fff;
  padding: 20px 18px;
  border-radius: 12px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.success {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #d4edda;
  color: #155724;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
}

.errors {
  list-style: none;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 6px;
  border-radius: 6px;
  background: rgba(255, 107, 107, 0.12);
  font-size: 13px;
  color: #c0392b;
}

.errors li {
  margin-bottom: 2px;
}

.form label {
  width: 100%;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form label h3 {
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #222;
  text-align: left;
  line-height: 1.2;
}

.form input,
.form select {
  width: 100%;
  height: 34px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 13.5px;
  box-sizing: border-box;
  background: #fff;
  transition: all 0.2s ease;
}

.form input:focus,
.form select:focus {
  border-color: #1e96c8;
  box-shadow: 0 0 0 2px rgba(30, 150, 200, 0.15);
  outline: none;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  padding-right: 42px;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
}

.toggle-password:hover {
  opacity: 1;
}

.buttons {
  width: 100%;
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.connexion,
.quitter {
  flex: 1;
  height: 34px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connexion {
  font-weight: 600;
  background: linear-gradient(135deg, #37aee2, #1e96c8);
}

.connexion:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(30, 150, 200, 0.3);
}

.quitter {
  background: #e74c3c;
}

.quitter:hover:not(:disabled) {
  background: #cf3e30;
}

.connexion:disabled,
.quitter:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.start {
  color: #e74c3c;
  font-size: 12px;
}

.spinner {
  margin-top: 10px;
}

@media (max-width: 420px) {
  .form {
    padding: 16px 14px;
  }

  .form label h3 {
    font-size: 12px;
  }

  .form input,
  .form select {
    height: 30px;
    font-size: 13px;
  }

  .connexion,
  .quitter {
    height: 30px;
    font-size: 13px;
  }

  .toggle-password {
    font-size: 14px;
  }
}
</style>