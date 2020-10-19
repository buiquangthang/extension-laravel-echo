import Vue from 'vue'
import Router from 'vue-router'
import AppLayout from './layouts/App.vue'
import PublicLayout from './layouts/Public.vue'
import Dashboard from './views/Dashboard.vue'
import Dashboard2 from './views/Dashboard2.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/login',
      component: PublicLayout,
      children: [
        {
          path: '',
          component: Login
        }
      ]
    },
    {
      path: '/dashboard',
      component: AppLayout,
      children: [
        {
          path: '',
          component: Dashboard
        },
        {
          path: '2',
          component: Dashboard2
        }
      ]
    }
  ]
})
