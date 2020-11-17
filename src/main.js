import Vue from 'vue'
import App from './App.vue'
import { router } from './router'

import VeeValidate from 'vee-validate';

import { store } from './_store';

// Vue.use(VeeValidate);

// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();


Vue.config.productionTip = false

new Vue({
  router: router,
  render: h => h(App),
  el: '#app'
})
