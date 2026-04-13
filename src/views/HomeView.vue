<template>
  <div class="home">
    <div class="home-cover">

      <div v-if="flagSpinner">
        <Spinner class="spinner" message="Veuillez patienter, le logiciel se connecte aux serveurs GTHCONSULT" />
      </div>

      <button class="ressayer" v-if="flagDemarrer" @click="demarrer">Démarrer</button>
      
      <Login v-if="flagAuth" @quitter="quitter" />
      
      <User v-if="flagUser" @quitter="quitter" />

    </div>
  </div>
</template>

<script>
import Login from '@/components/login/LoginComponent.vue';
import User from '@/components/login/UserComponent.vue';
import Spinner from 'vue-simple-spinner';

export default {
  name: 'HomeView',
  data() {
    return {
      flagSpinner: false,
      flagDemarrer: true,
      flagAuth: false,
      flagUser : false,
    };
  },
  components: { Login, User, Spinner },
  methods: {

    handleKeydown(event) {
      // Ctrl + I
      if (event.ctrlKey && event.key.toLowerCase() === 'i') {
        event.preventDefault();

        this.flagInscription = true;
        this.flagAuth = false;
        this.flagSpinner = false;
        this.flagDemarrer = false;
      }
    },

    quitter() {
      this.flagDemarrer = true;
      this.flagSpinner = false;
      this.flagAuth = false;
      this.flagInscription = false;
    },
    async demarrer() {
      this.flagSpinner = true;
      this.flagDemarrer = false;
    }
  },

  mounted() {
  window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

};
</script>

<style scoped>
/* Supprimer toutes les marges du html/body */
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #fcf9f9;
}

/* Container principal fixe 1280x800 */
.home {
  width: 100%;
  height: 100%;
  margin: 0; /* supprimer marge */
  padding: 0;
  background-size: cover; /* couvre tout le container */
  background-position: center center; /* centre exact */
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* overlay semi-transparent */
.home::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(126, 122, 122, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1;
}

/* Couverture des composants */
.home-cover {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Logo */
.home img {
  height: 60px;
  margin-bottom: 20px;
}

/* Bouton Démarrer */
.ressayer {
  background-image: linear-gradient(-180deg, #37AEE2 0%, #1E96C8 100%);
  border-radius: 0.5rem;
  box-sizing: border-box;
  color: #FFFFFF;
  display: flex;
  font-size: 16px;
  justify-content: center;
  padding: 1rem 1.75rem;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  user-select: none;
  transition: background-image 0.3s ease;
  margin-top: 20px;
  width: 100px;
}
.ressayer:hover {
  background-image: linear-gradient(-180deg, #1D95C9 0%, #17759C 100%);
}

/* Spinner */
.spinner {
  color: white;
  margin-top: 20px;
}
.spinner span, 
.spinner div {
  color: white !important;
}

/* Responsive (réduire proportionnellement si écran trop petit) */
@media (max-width: 1280px), (max-height: 800px) {
  .home {
    width: 100%;
    height: 100%;
  }
  .ressayer {
    font-size: 14px;
    padding: 0.8rem 1rem;
  }
  .home img {
    height: 40px;
  }
}
</style>
