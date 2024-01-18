const State = {
  visitedViews: [],
  cachedViews: [],
  closedViews: [],
  currentTag: {},
  needSaveTag: [],
  tagIndex: 0
}
const Getters = {
  visitedViews: (state) => state.visitedViews,
  cachedViews: (state) => state.cachedViews,
  closedViews: (state) => state.closedViews,
  currentTag: (state) => state.currentTag,
  needSaveTag: (state) => state.needSaveTag,
  tagIndex: (state) => state.tagIndex
}
const Mutations = {
  UPDATE_VIEW: (state, { key, id }) => {
    let re = state.visitedViews.find((v) => v.key == key)
    if (state.currentTag.key === key) {
      state.currentTag.pageOWID = id
    }
    re ? (re.pageOWID = id) : ''
  },
  SET_CURRENT_TAG: (state, n) => {
    state.currentTag = n
  },
  ADD_VISITED_VIEW: (state, view) => {
    let title = view.query.titleName || 'no-name'
    if (view.meta.type) {
      title = view.meta.type[view.params.id].name
    }
    if (view.keyI && view.keyI < state.visitedViews.length) {
      //重新加载
      state.visitedViews.splice(view.keyI, 0, view)
    } else {
      state.tagIndex++
      state.visitedViews.push(Object.assign({}, view, { title }))
    }
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  }
}
const Actions = {
  setCurrentTag({ commit }, n) {
    commit('SET_CURRENT_TAG', n)
  },
  addVisitedView({ commit }, view) {
    commit('SET_CURRENT_TAG', view)
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  addView({ dispatch }, view) {
    if (view.name === 'login' || view.name === 'servicelogin') return
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  updateView({ commit }, obj) {
    commit('UPDATE_VIEW', obj)
    // dispatch('language/setPageOwidList', obj.id, { root: true })
  }
}

export default {
  namespaced: true,
  strict: true,
  state: State,
  getters: Getters,
  actions: Actions,
  mutations: Mutations
}
