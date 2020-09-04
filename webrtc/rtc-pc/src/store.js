import Vue from 'vue'
import Vuex from 'vuex'
import { xmpp } from "./util/xmpp.js";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginData: JSON.parse(localStorage.getItem('uc_loginData'))
  },
  getters: {
    xmppInit(state){
      if(state.loginData){
        xmpp.init();
      }else{
        xmpp.disConnectXmpp();
      }
    }
  },
  mutations: {
    setLoginData(state,userData){
      state.loginData = userData;
    }
  },
  actions: {

  }
})
