import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import AlertsView from '../views/AlertsView.vue'
import AuditReportView from '../views/AuditReportView.vue'
import HistoryView from "../views/HistoryView.vue";
import ArchitectureView from "../views/ArchitectureView.vue";
import PlcConfigView from "../views/PlcConfigView.vue";
import UsersManagementView from "../views/UsersManagementView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/audit-report',
    name: 'audit-report',
    component: AuditReportView,
    meta: { requiresAuth: true }
  },

  {
    path: '/history',
    name: 'history',
    component: HistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/architecture',
    name: 'architecture',
    component: ArchitectureView,
    meta: { requiresAuth: true }
  },
  {
    path: '/plc-config',
    name: 'plc-config',
    component: PlcConfigView,
    meta: { requiresAuth: true }
  },
  {
    path: '/users-management',
    name: 'users-management',
    component: UsersManagementView,
    meta: { requiresAuth: true }
  },

  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

// Guard global : contrôle accès aux routes protégées
router.beforeEach((to, from, next) => {
  const loggedIn = sessionStorage.getItem('id')

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next({ path: '/' })
    } else {
      next()
    }
  } else if (to.path === '/' && loggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router