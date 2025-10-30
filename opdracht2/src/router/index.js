import { createRouter, createWebHistory } from '@ionic/vue-router';
// import { RouteRecordRaw } from 'vue-router'; // <- Supprimez cette ligne
import TabsPage from '../views/TabsPage.vue'

// Changez la ligne suivante :
// const routes: Array<RouteRecordRaw> = [
// en :
const routes = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
   // ... (code avant) ...
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      },
      // --- AJOUT DE LA ROUTE ABOUT ---
      {
        path: 'about',
        component: () => import('@/views/AboutPage.vue') 
      }
      // ------------------------------
    ]

  }
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

export default router