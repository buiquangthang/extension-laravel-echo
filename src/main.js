// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Echo from 'laravel-echo'

window.io = require('socket.io-client')

Vue.config.productionTip = false

Vue.component('Cat', require('./components/Cat.vue'), {
  name: 'Cat'
});

window.Echo = new Echo({
  broadcaster: 'socket.io'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
