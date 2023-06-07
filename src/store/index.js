import Vue from 'vue'
import Vuex from 'vuex'
import { setCookie, getCookie, remoceCookie, getUserCookie } from '@/util/userCookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getUserCookie()
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.user = userInfo
    },
  },
  actions: {
    setUserInfo ({ commit }, userInfo) {
      commit('setUserInfo', userInfo)
      setCookie(userInfo)
    },
  },
  modules: {
  }
})
