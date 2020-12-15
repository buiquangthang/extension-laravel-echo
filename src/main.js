import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import Vuex from 'vuex'

import * as VeeValidate from 'vee-validate'

import { store } from './_store/index.js'

// setup fake backend
import { configureFakeBackend } from './_helpers'

Vue.use(VeeValidate)
Vue.use(Vuex)
configureFakeBackend()

Vue.config.productionTip = false

new Vue({
  router: router,
  store: store,
  render: h => h(App),
  el: '#app'
})
