import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/login', component: () => import('../views/LoginView.vue') },
    { path: '/dashboard', component: () => import('../views/DashboardView.vue') },
    { path: '/registro', component: () => import('../views/RegistroView.vue') },
    { path: '/emprendedor/:id', component: () => import('../views/PerfilPublicoView.vue') },
  ],
})

export default router
