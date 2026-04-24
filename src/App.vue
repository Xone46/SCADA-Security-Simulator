<template>
  <div id="app" :class="{ 'app-layout': showSidebar }">
    <Sidebar v-if="showSidebar" />

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/common/Sidebar.vue";

export default {
  name: "App",
  components: { Sidebar },

  computed: {
    showSidebar() {
      return this.$route.path !== "/";
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
  overflow: hidden;
}

.app-layout {
  display: flex;
}

.main-content {
  flex: 1;
  height: 100vh;
  overflow: auto;
  background: #eef4f8;
}
</style>