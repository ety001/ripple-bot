// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
var app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  template: '<App/>',
  components: { App },
  data: {
    ws: null,
    wsStatus: false
  },
  mounted () {
    this.ws = new WebSocket('wss://s1.ripple.com')
    this.ws.onopen = () => {
      app.wsStatus = true
      console.log('on open')
    }
  }
})
