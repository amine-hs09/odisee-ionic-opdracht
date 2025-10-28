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
      }
    ]
  }
]

const router = createRouter({
  // Modifiez la ligne suivante si 'process.env' n'est pas défini (courant avec Vite)
  // history: createWebHistory(process.env.BASE_URL),
  // en :
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router