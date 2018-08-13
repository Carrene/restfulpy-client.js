import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'

import server from './server'

Vue.use(Router)

const entities = {
  Resource: {url: 'resources'}
}

const metadataPromise = server.loadMetadata(entities)

function loadComponentAsync (name, loader) {
  return Vue.component(
    name,
    function (ok) {
      metadataPromise.then(() => {
        loader(ok)
      })
    }
  )
}

const Resource = loadComponentAsync('resource', function (ok) {
  return require(['./pages/Resource'], ok)
})

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/resource',
      name: 'Resource',
      component: Resource
    }
  ]
})
