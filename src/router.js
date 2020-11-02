import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import ForgotPassword from './views/ForgotPassword'
import EchoClient from './views/EchoClient'
import AppLayout from './layouts/App'
import PublicLayout from './layouts/Public'

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
    {
      path: '/',
      name: 'PublicLayout',
      component: PublicLayout,
      children: [
        { path: '/login', name: 'Login', component: Login },
        { path: '/register', name: 'Register', component: Register },
        { path: '/forgot-password', name: 'Forgot Password', component: ForgotPassword }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});
