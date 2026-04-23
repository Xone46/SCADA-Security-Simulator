<template>
  <div class="login">
    <div class="form" v-if="flagForm">
      <ul v-if="flagMessage" class="errors">
        <li v-for="(error, index) in errors" :key="index">- {{ error }}</li>
      </ul>

      <label>
        <h3>E-mail : <span class="start" v-if="!email">*</span></h3>
        <input
          class="form-input"
          type="text"
          v-model.trim="email"
          placeholder="Votre email"
          @keyup.enter="connexion"
        />
      </label>

      <label class="password-label">
        <h3>Mot de passe : <span class="start" v-if="!password">*</span></h3>
        <div class="password-wrapper">
          <input
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @keyup.enter="connexion"
            placeholder="Votre mot de passe"
          />
          <span class="toggle-password" @click="toggleShowPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>
      </label>

      <label class="remember">
        <input type="checkbox" v-model="rememberMe" />
        <span>Se souvenir de moi</span>
      </label>

      <div class="buttons">
        <button
          class="connexion"
          @click="connexion"
          :disabled="flagSpinner"
        >
          Connexion
        </button>
        <button
          class="quitter"
          @click="quitter"
          :disabled="flagSpinner"
        >
          Quitter
        </button>
      </div>

      <p class="small-note">
        <em>Astuce : coche "Se souvenir de moi" pour préremplir votre e-mail.</em>
      </p>
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
  name: "LoginComponent",
  components: { Spinner },

  data() {
    return {
      email: localStorage.getItem("email") || "",
      password: "",
      rememberMe: localStorage.getItem("rememberMe") === "true",

      showPassword: false,
      flagSpinner: false,
      flagForm: true,
      flagMessage: false,

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

    async connexion() {
      this.errors = [];
      this.flagMessage = false;

      if (!this.email) {
        this.errors.push("L'email est requis.");
      } else if (!this.isValidEmail(this.email)) {
        this.errors.push("Le format de l'email est invalide.");
      }

      if (!this.password) {
        this.errors.push("Le mot de passe est requis.");
      }

      if (this.errors.length > 0) {
        this.flagMessage = true;
        return;
      }

      this.flagForm = false;
      this.flagSpinner = true;

      try {
        const result = await User.connexion(this.email, this.password);

        this.flagSpinner = false;
        this.flagForm = true;

        if (!result || !result.data) {
          this.errors = ["Réponse invalide du serveur."];
          this.flagMessage = true;
          return;
        }

        localStorage.setItem("rememberMe", this.rememberMe ? "true" : "false");

        if (this.rememberMe) {
          localStorage.setItem("email", this.email);
        } else {
          localStorage.removeItem("email");
        }

        sessionStorage.setItem("id", result.data.id || "");
        sessionStorage.setItem("nom", result.data.nom || "");
        sessionStorage.setItem("prenom", result.data.prenom || "");
        sessionStorage.setItem("matricule", result.data.matricule || "");
        sessionStorage.setItem(
          "role",
          (result.data.role || "user").toLowerCase()
        );

        this.$router.push("/dashboard").catch(() => {});
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
          this.errors = ["Erreur lors de la connexion. Veuillez réessayer."];
        }
      }
    }
  }
};
</script>

<style scoped>
.login {
  min-height: 100%;
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
}

.form {
  width: 100%;
  max-width: 600px;
  background-color: rgba(210, 210, 214, 0.92);
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.errors {
  list-style: none;
  padding: 12px;
  margin: 0 0 15px 0;
  width: 100%;
  text-align: left;
  background: rgba(255, 235, 235, 0.9);
  border: 1px solid #f3b7b7;
  border-radius: 8px;
}

.errors li {
  color: #c62828;
  font-size: 14px;
  margin-bottom: 4px;
}

.form label {
  width: 100%;
  margin-bottom: 12px;
  text-align: left;
}

.form h3 {
  margin: 5px 0;
  color: black;
  font-weight: 600;
  font-size: 15px;
}

.form-input {
  width: 100%;
  height: 42px;
  padding: 8px 12px;
  margin-top: 5px;
  border: 1px solid #222;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;
  background: #fff;
  font-size: 14px;
}

.form-input:focus {
  border-color: #1e96c8;
  box-shadow: 0 0 0 3px rgba(30, 150, 200, 0.15);
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper .form-input {
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  font-size: 18px;
  color: #333;
}

.remember {
  width: 100%;
  margin: 8px 0 15px 0;
  color: black;
  display: flex;
  align-items: center;
  gap: 8px;
}

.buttons {
  width: 100%;
  display: flex;
  gap: 10px;
}

.form button {
  flex: 1;
  height: 42px;
  margin-top: 5px;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.connexion {
  background-color: #04aa6d;
}

.connexion:hover:not(:disabled) {
  background-color: #029e62;
}

.quitter {
  background-color: #fa0e06;
}

.quitter:hover:not(:disabled) {
  background-color: #d90c05;
}

.start {
  color: red;
  margin-left: 5px;
}

.spinner {
  color: white;
  margin-top: 20px;
}

.small-note {
  margin-top: 12px;
  font-size: 12px;
  color: black;
  text-align: center;
}

@media (max-width: 480px) {
  .form {
    padding: 16px;
  }

  .form h3 {
    font-size: 14px;
  }

  .form-input {
    height: 38px;
    font-size: 13px;
  }

  .form button {
    height: 38px;
    font-size: 14px;
  }

  .toggle-password {
    font-size: 16px;
  }
}
</style>