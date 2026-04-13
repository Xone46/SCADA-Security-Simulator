<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style scoped>
#app {
  width: 100%;       /* largeur fixe */
  height: 100%;       /* hauteur fixe */
  margin: 0 auto;      /* centrer horizontalement */
  padding: 0;
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fcf9f9;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Centrer verticalement dans Electron */
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #fcf9f9;
}

/* Responsive pour petits écrans (message utilisateur conseillé) */
@media (max-width: 100%), (max-height: 100%) {
  #app {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem; /* réduire taille si écran plus petit */
  }
}
</style>
