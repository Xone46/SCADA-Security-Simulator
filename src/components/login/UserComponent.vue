<template>
  <div class="login">

    <div class="form" v-if="flagForm">


      <!-- Message de succès -->
      <div v-if="successMessage" class="success">
        {{ successMessage }}
      </div>

      <!-- Erreurs -->
      <ul v-if="flagMessage" class="errors">
        <li v-for="(error, index) in errors" :key="index">- {{ error }}</li>
      </ul>

      <!-- Matricule -->
      <label>
        <h3>Matricule : <span class="start">*</span></h3>
        <input type="text" v-model.trim="matricule" placeholder="Votre matricule" />
      </label>

      <!-- Nom -->
      <label>
        <h3>Nom : <span class="start">*</span></h3>
        <input type="text" v-model.trim="nom" placeholder="Votre nom" />
      </label>

      <!-- Prénom -->
      <label>
        <h3>Prénom : <span class="start">*</span></h3>
        <input type="text" v-model.trim="prenom" placeholder="Votre prénom" />
      </label>

      <!-- Email -->
      <label>
        <h3>E-mail : <span class="start">*</span></h3>
        <input type="email" v-model.trim="email" placeholder="Votre email" />
      </label>

      <!-- Mot de passe -->
      <label class="password-label">
        <h3>Mot de passe : <span class="start">*</span></h3>
        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @keyup.enter="User"
            placeholder="Votre mot de passe"
          />
          <span class="toggle-password" @click="toggleShowPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>
      </label>

      <!-- Boutons -->
      <div class="buttons">
        <button class="connexion" @click="inscrit">S'inscrire</button>
        <button class="quitter" @click="quitter">Quitter</button>
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
      matricule : "",
      nom: "",
      prenom: "",
      email: "",
      password: "",
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
      this.$emit("quitter");
    },

    async inscrit() {
      this.errors = [];
      this.flagMessage = false;
      this.successMessage = "";

      // Validation des champs
      if (!this.matricule) this.errors.push("Le matricule est requis.");
      if (!this.prenom) this.errors.push("Le prénom est requis.");

      if (!this.email) {
        this.errors.push("L'email est requis.");
      } else if (!this.email.endsWith("@gthconsult.ma")) {
        this.errors.push("L'email doit contenir le domaine @gthconsult.ma.");
      }

      if (!this.password) this.errors.push("Le mot de passe est requis.");

      if (this.errors.length) {
        this.flagMessage = true;
        return;
      }

      // Affichage spinner
      this.flagForm = false;
      this.flagSpinner = true;

      try {
        const result = await User.inscription({
          matricule: this.matricule,
          nom: this.nom,
          prenom: this.prenom,
          email: this.email,
          password: this.password
        });

        this.flagSpinner = false;
        this.flagForm = true;

        if (result?.data) {
          this.successMessage = "User réussie ! Vous pouvez maintenant vous connecter.";
          this.matricule = "";
          this.nom = "";
          this.prenom = "";
          this.email = "";
          this.password = "";
        } else {
          this.errors.push("User échouée.");
          this.flagMessage = true;
        }

      } catch (error) {
        this.flagSpinner = false;
        this.flagForm = true;
        this.flagMessage = true;
        this.errors = ["Erreur lors de l'User. Veuillez réessayer."];
      }
    }
  }
};
</script>

<style scoped>
/* Container centré */
.login {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  background: #f4f6f8;
}

/* Carte */
.form {
  width: 100%;
  height: fit-content;
  max-width: 360px;
  background: #fff;
  padding: 20px 18px;
  border-radius: 12px;
  box-shadow: 0 16px 32px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

/* Logo */
.form img {
  height: 50px;
  margin-bottom: 12px;
}

/* Message succès */
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

/* Erreurs */
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

/* Labels et champs */
.form label {
  width: 100%;
  margin-bottom: 1px; /* très compact */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form label h3 {
  margin-bottom: 2px; /* petite marge entre h3 et input */
  font-size: 13px;
  font-weight: 600;
  color: #222;
  text-align: left;
  line-height: 1.2;
}

/* Inputs */
.form input {
  width: 100%;
  height: 30px; /* compact */
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 13.5px;
  box-sizing: border-box;
  background: #fff;
  transition: all 0.2s ease;
}

.form input:focus {
  border-color: #1e96c8;
  box-shadow: 0 0 0 2px rgba(30,150,200,0.15);
  outline: none;
}

/* Password */
.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 42px;
}

/* Toggle password */
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

/* Boutons */
.buttons {
  width: 100%;
  display: flex;
  gap: 10px;
  margin-top: 8px; /* compact */
}

/* Bouton User */
.connexion {
  flex: 1;
  height: 30px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #37aee2, #1e96c8);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connexion:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(30, 150, 200, 0.3);
}

/* Bouton quitter */
.quitter {
  flex: 1;
  height: 30px;
  border-radius: 8px;
  font-size: 14px;
  background: #e74c3c;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.quitter:hover {
  background: #cf3e30;
}

/* Astérisque obligatoire */
.start {
  color: #e74c3c;
  font-size: 12px;
}

/* Spinner */
.spinner {
  margin-top: 10px;
}

/* Mobile responsive */
@media (max-width: 420px) {
  .form {
    padding: 16px 14px;
  }

  .form img {
    height: 45px;
  }

  .form label h3 {
    font-size: 12px;
  }

  .form input {
    height: 28px;
    font-size: 13px;
  }

  .connexion, .quitter {
    height: 28px;
    font-size: 13px;
  }

  .toggle-password {
    font-size: 14px;
  }
}
</style>
