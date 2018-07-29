import Vue from 'vue'
import Router from 'vue-router'
import server from './server'
import Login from '@/pages/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }
  ]
})
