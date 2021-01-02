// import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const vuetifyPlugin: Vuetify = new Vuetify({
  icons: {
    iconfont: "mdi"
  }
});

export default vuetifyPlugin;
