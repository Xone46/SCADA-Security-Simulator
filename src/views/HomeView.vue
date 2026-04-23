<template>
  <div class="home">
    <div class="home-cover">
      <div v-if="flagSpinner" class="spinner-wrapper">
        <Spinner
          class="spinner"
          message="Veuillez patienter, le logiciel se connecte aux serveurs ..."
        />
      </div>

      <button
        class="ressayer"
        v-if="flagDemarrer"
        @click="demarrer"
      >
        Démarrer
      </button>

      <Login v-if="flagAuth" @quitter="quitter" />

      <User v-if="flagUser" @quitter="quitter" />
    </div>
  </div>
</template>

<script>
import Login from '@/components/login/LoginComponent.vue'
import User from '@/components/login/UserComponent.vue'
import Spinner from 'vue-simple-spinner'

export default {
  name: 'HomeView',
  components: {
    Login,
    User,
    Spinner
  },
  data() {
    return {
      flagSpinner: false,
      flagDemarrer: true,
      flagAuth: false,
      flagUser: false,
      flagInscription: false
    }
  },
  methods: {
    handleKeydown(event) {
      if (event.ctrlKey && event.key.toLowerCase() === 'i') {
        event.preventDefault()

        this.flagInscription = true
        this.flagAuth = false
        this.flagUser = true
        this.flagSpinner = false
        this.flagDemarrer = false
      }
    },

    quitter() {
      this.flagDemarrer = true
      this.flagSpinner = false
      this.flagAuth = false
      this.flagUser = false
      this.flagInscription = false
    },

    demarrer() {
      this.flagSpinner = true
      this.flagDemarrer = false
      this.flagAuth = false
      this.flagUser = false

      setTimeout(() => {
        this.flagSpinner = false
        this.flagAuth = true
      }, 1500)
    }
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.home::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(126, 122, 122, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1;
}

.home-cover {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.ressayer {
  background-image: linear-gradient(-180deg, #37aee2 0%, #1e96c8 100%);
  border-radius: 10px;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-size: 16px;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.75rem;
  border: 0;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  margin-top: 20px;
  min-width: 140px;
  height: 48px;
  font-weight: 600;
}

.ressayer:hover {
  background-image: linear-gradient(-180deg, #1d95c9 0%, #17759c 100%);
  transform: translateY(-1px);
}

.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  margin-top: 20px;
}

.spinner span,
.spinner div {
  color: white !important;
}

@media (max-width: 1280px), (max-height: 800px) {
  .ressayer {
    font-size: 14px;
    padding: 0.8rem 1rem;
    min-width: 120px;
    height: 42px;
  }
}
</style>