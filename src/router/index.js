import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'


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
    meta: { requiresAuth: true }  // <-- protection ajoutée
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
  const loggedIn = sessionStorage.getItem('id')  // vérifier si user connecté

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Route nécessite authentification
    if (!loggedIn) {
      next({ path: '/' })  // pas connecté => redirige vers login (home)
    } else {
      next()
    }
  } else if (to.path === '/' && loggedIn) {
    // Empêche utilisateur connecté d'aller sur la page login (home)
    next('/dashboard')
  } else {
    next()
  }
})

export default router
