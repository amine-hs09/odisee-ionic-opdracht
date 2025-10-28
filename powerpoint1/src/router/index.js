import { createRouter, createWebHistory } from '@ionic/vue-router';
import TabsPage from '../views/TabsPage.vue'

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
        // Corriger l'importation de Tab 1
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue') 
      },
      {
        // Corriger l'importation de Tab 2
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        // Corriger l'importation de Tab 3
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  },
  {
    path: '/slides',
    component: () => import('@/views/SlidesPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
