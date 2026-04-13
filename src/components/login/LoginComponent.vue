<template>
  <div class="login">

    <div class="form" v-if="flagForm">


      <!-- Erreurs -->
      <ul v-if="flagMessage" class="errors">
        <li v-for="(error, index) in errors" :key="index">- {{ error }}</li>
      </ul>

      <!-- Formulaire -->
      <label>
        <h3>E-mail : <span class="start" v-if="!email">*</span></h3>
        <input type="text" v-model.trim="email" placeholder="Votre email" />
      </label>

      <label class="password-label">
        <h3>Mot de passe : <span class="start" v-if="!password && rememberMe">*</span></h3>
        <div class="password-wrapper">
          <input
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
        <input type="checkbox" v-model="rememberMe" /> Se souvenir de moi
      </label>

      <div class="buttons">
        <button class="connexion" @click="connexion">Connexion</button>
        <button class="quitter" @click="quitter">Quitter</button>
      </div>

      <p class="small-note">
        <em>Astuce : coche "Se souvenir de moi" pour préremplir l'email et le mot de passe.</em>
      </p>

    </div>

    <div class="spinner" v-if="flagSpinner">
      <Spinner />
    </div>

  </div>
</template>

<script>
import Inspecteurs from "@/requests/api";
import Spinner from "vue-simple-spinner";

export default {
  name: "LoginComponent",
  components: { Spinner },

  data() {
    return {
      // 🔐 Données utilisateur (préremplies si rememberMe)
      email: localStorage.getItem("email") || "",
      password: localStorage.getItem("password") || "",
      rememberMe: localStorage.getItem("rememberMe") === "true",

      // 👁️ UI
      showPassword: false,
      flagSpinner: false,
      flagForm: true,
      flagMessage: false,

      // ❌ Erreurs
      errors: []
    };
  },

  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },

    quitter() {
      this.$emit("quitter");
    },

    async connexion() {
      /* ======================
         🔄 RESET
      ====================== */
      this.errors = [];
      this.flagMessage = false;

      /* ======================
         ✅ VALIDATION
      ====================== */
      if (!this.email) {
        this.errors.push("L'email est requis.");
      }

      if (!this.password) {
        this.errors.push("Le mot de passe est requis.");
      }

      if (this.errors.length > 0) {
        this.flagMessage = true;
        return;
      }

      /* ======================
         ⏳ LOADING
      ====================== */
      this.flagForm = false;
      this.flagSpinner = true;

      try {
        const result = await Inspecteurs.connexion(this.email, this.password);

        this.flagSpinner = false;
        this.flagForm = true;

        if (!result || !result.data) {
          this.errors = ["Réponse invalide du serveur."];
          this.flagMessage = true;
          return;
        }

        /* ======================
           💾 LOCAL STORAGE
        ====================== */
        localStorage.setItem("rememberMe", this.rememberMe ? "true" : "false");

        if (this.rememberMe) {
          localStorage.setItem("email", this.email);
          localStorage.setItem("password", this.password); // ⚠️ éviter en prod
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        /* ======================
           🧠 SESSION STORAGE
        ====================== */
        sessionStorage.setItem("id", result.data.id);
        sessionStorage.setItem("nom", result.data.nom || "");
        sessionStorage.setItem("prenom", result.data.prenom || "");
        sessionStorage.setItem("matricule", result.data.matricule || "");

        // 🔥 ROLE NORMALISÉ (ADMIN/USER → admin/user)
        sessionStorage.setItem(
          "role",
          (result.data.role || "user").toLowerCase()
        );

        /* ======================
           🚀 REDIRECTION
        ====================== */
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
  background-color: rgba(210, 210, 214, 0.9);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form img {
  height: 80px;
  margin-bottom: 20px;
}

.errors {
  list-style: none;
  padding: 0;
  margin-bottom: 15px;
  width: 100%;
  text-align: left;
}

.errors li {
  color: #ff6b6b;
  font-size: 14px;
  margin-bottom: 5px;
}

.form label {
  width: 100%;
  margin-bottom: 10px;
  text-align: left;
}

.form h3 {
  margin: 5px 0;
  color: black;
  font-weight: 600;
}

.form input[type="text"],
.form input[type="password"] {
  width: 100%;
  height: 40px;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #222;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  background: #fff;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  width: 100%;
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  font-size: 18px;
  color: #333;
}

.remember {
  width: 100%;
  margin: 5px 0 15px 0;
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
  height: 40px;
  margin-top: 5px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 15px;
  cursor: pointer;
}

.connexion {
  background-color: #04AA6D;
}

.connexion:hover {
  background-color: #029e62;
}

.quitter {
  background-color: #fa0e06;
}

.quitter:hover {
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

/* Note */
.small-note {
  margin-top: 12px;
  font-size: 12px;
  color: black;
  text-align: center;
}

/* Responsive mobile */
@media (max-width: 480px) {
  .form {
    padding: 15px;
  }

  .form img {
    height: 60px;
  }

  .form h3 {
    font-size: 16px;
  }

  .form input {
    height: 35px;
    font-size: 14px;
  }

  .form button {
    height: 35px;
    font-size: 14px;
  }

  .toggle-password {
    font-size: 16px;
  }
}
</style>
