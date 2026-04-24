<template>
  <aside class="sidebar">

    <!-- HEADER -->
    <div class="sidebar-header">
      <h2>SCADA</h2>
      <p>Security Simulator</p>
    </div>

    <!-- MENU -->
    <nav class="sidebar-menu">

      <!-- SECTION SYSTEM -->
      <div class="menu-section">Système</div>

      <router-link to="/dashboard" class="menu-link">
        📊 Dashboard
      </router-link>

      <router-link to="/alerts" class="menu-link">
        🚨 Alertes
      </router-link>

      <router-link to="/history" class="menu-link">
        📜 Historique
      </router-link>

      <router-link to="/audit-report" class="menu-link">
        📑 Audit
      </router-link>

      <router-link to="/architecture" class="menu-link">
        🏗️ Architecture
      </router-link>

      <!-- ADMIN -->
      <template v-if="isAdmin">
        <div class="menu-section">Administration</div>

        <router-link to="/plc-config" class="menu-link">
          ⚙️ Gestion PLC
        </router-link>

        <router-link to="/users-management" class="menu-link">
          👤 Gestion users
        </router-link>
      </template>

    </nav>

  </aside>
</template>

<script>
export default {
  name: "Sidebar-Component",

  computed: {
    isAdmin() {
      return (sessionStorage.getItem("role") || "user")
        .toLowerCase() === "admin";
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #17324d, #0f2235);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
}

/* HEADER */
.sidebar-header {
  margin-bottom: 30px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.sidebar-header p {
  margin: 6px 0 0;
  font-size: 13px;
  opacity: 0.75;
}

/* MENU */
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* SECTION */
.menu-section {
  margin-top: 14px;
  margin-bottom: 6px;
  font-size: 11px;
  text-transform: uppercase;
  opacity: 0.6;
  padding-left: 8px;
}

/* LINK */
.menu-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  transition: 0.2s ease;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* ACTIVE */
.router-link-exact-active {
  background: rgba(255, 255, 255, 0.18);
  font-weight: 600;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .sidebar {
    width: 220px;
  }
}
</style>