import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import vuetify from './plugins/vuetify'
import AxiosConfig from "@/plugins/AxiosConfig";
import VueFullscreenConfig from "@/plugins/VueFullscreenConfig";

Vue.config.productionTip = false

const vue = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

VueFullscreenConfig.init()
AxiosConfig.init(vue)
