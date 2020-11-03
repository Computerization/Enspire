import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Axios from "axios";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;
Axios.defaults.baseURL = "http://101.230.1.163";

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
