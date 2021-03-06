import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import knowledge from './modules/knowledge'
import paper from './modules/paper'
import biomarker from './modules/biomarker'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    knowledge,
    paper,
    biomarker,
    permission
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
