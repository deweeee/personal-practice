import storage from '../../utils/storage'
const State = {
  filePath: `${window.location.protocol}//${window.location.host}/file/`,
  urlPath: `${window.location.protocol}//${window.location.host}/api`,
  userInfo: {} //用户信息
}
const Getters = {
  userInfo: (state) => state.userInfo
}
const Mutations = {
  GETUSERINFO(state) {
    state.userInfo = storage.getStorage({
      type: 'localStorage',
      key: 'userInfo'
    })
  }
}
const Actions = {
  getUserInfo({ commit }) {
    commit('GETUSERINFO')
  }
}
export default {
  state: State,
  getters: Getters,
  mutations: Mutations,
  Actions: Actions
}
