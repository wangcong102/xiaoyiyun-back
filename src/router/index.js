import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'Login',
    component:() => import('../views/Login.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path:'/Test',
    name:'Test',
    component:() => import('../views/Test.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
