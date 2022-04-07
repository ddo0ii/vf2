import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/board',
    component: () => import('@/views/board')
  },
  {
    path: '/board/:info',
    component: () => import('@/views/board/info')
  },
  {
    path: '/board/:info/:article',
    component: () => import('@/views/board/article')
  },
  {
    path: '*',
    name: 'error',
    component: () => import('../views/error')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
