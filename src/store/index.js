import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong from 'vuex-along'
import createPersistedState from 'vuex-persistedstate'

import tags from './model/tags'
import user from './model/user'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createVuexAlong(), createPersistedState()],
  modules: {
    tags,
    user
  }
})
