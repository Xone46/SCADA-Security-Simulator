<template>
  <div id="app" :class="{ 'app-layout': showSidebar }">
    <Sidebar v-if="showSidebar" />
    <div class="main-content" :class="{ 'with-sidebar': showSidebar }">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/common/Sidebar.vue";

export default {
  name: "App",
  components: {
    Sidebar
  },
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: white;
}

#app {
  overflow: hidden;
}

.app-layout {
  display: flex;
  flex-direction: row;
}

.main-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.main-content.with-sidebar {
  flex: 1;
  background: #eef4f8;
}
</style>