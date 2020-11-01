import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Echo from 'laravel-echo'

window.io = require('socket.io-client')

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  el: '#app'
})
