import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vueFabricSketchpad from '../packages/sketchpad'
import './assets/css/base.scss'

Vue.use(vueFabricSketchpad)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#vue-fabric-sketchpad')
