<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>SCADA</h2>
      <p>Security Simulator</p>
    </div>

    <nav class="sidebar-menu">
      <router-link to="/dashboard" class="menu-link">Dashboard</router-link>
      <router-link to="/alerts" class="menu-link">Alertes</router-link>
      <router-link to="/history" class="menu-link">Historique</router-link>
      <router-link to="/audit-report" class="menu-link">Audit</router-link>
      <router-link to="/architecture" class="menu-link">Architecture</router-link>

      <template v-if="isAdmin">
        <router-link to="/plc-config" class="menu-link">Gestion PLC</router-link>
        <router-link to="/users-management" class="menu-link">Gestion users</router-link>
      </template>
    </nav>
  </aside>
</template>

<script>
export default {
  name: "Sidebar-Component",
  computed: {
    isAdmin() {
      return (sessionStorage.getItem("role") || "user").toLowerCase() === "admin";
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-width: 250px;
  height: 100vh;
  background: #17324d;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  box-sizing: border-box;
}

.sidebar-header {
  margin-bottom: 28px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.sidebar-header p {
  margin: 6px 0 0;
  font-size: 13px;
  opacity: 0.8;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-link {
  color: white;
  text-decoration: none;
  padding: 12px 14px;
  border-radius: 10px;
  transition: 0.2s ease;
  font-size: 14px;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.12);
}

.router-link-exact-active {
  background: rgba(255, 255, 255, 0.18);
  font-weight: 600;
}
</style>