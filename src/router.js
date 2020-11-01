import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import ForgotPassword from './views/ForgotPassword'
import EchoClient from './views/EchoClient'
import AppLayout from './layouts/App'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/',
      name: 'AppLayout',
      component: AppLayout,
      children: [
        { path: '', name: 'DashBoard', component: Dashboard },
        { path: '/echo-client', name: 'EchoClient', component: EchoClient }
      ]
    },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/forgot-password', name: 'Forgot Password', component: ForgotPassword }
  ]
})
