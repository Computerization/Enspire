import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

const vuexStore: Store<Record<string, unknown>> = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});

export default vuexStore;
