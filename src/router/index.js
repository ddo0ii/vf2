import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/wow',
    name: 'wow',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/WowView.vue')
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('../components/board/')
  },
  {
    path: '/storage',
    name: 'storage',
    component: () => import('../components/storage')
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('../components/editor')
  },
  {
    path: '/:collection/:document',
    name: 'collection-document',
    component: () => import('../components/renderer')
  },
  {
    path: '*',
    name: 'error',
    component: () => import('../components/error')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
