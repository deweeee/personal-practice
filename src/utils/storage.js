import storageMode from '@/storage'

const getToken = () => {
  const storage = storageMode['sessionStorage']
  return storage.$get({
    key: 'TOKEN'
  })
}

const getRefreshToken = () => {
  const storage = storageMode['sessionStorage']
  return storage.$get({
    key: 'refreshToken'
  })
}

const setToken = ({ key, parameter, date, refresh, url }) => {
  const storage = storageMode['sessionStorage']
  return storage.$set({
    key,
    parameter,
    date,
    refresh,
    url
  })
}

const setStorage = ({ type, key, parameter, date, refresh, url }) => {
  const storage = storageMode[type]
  return storage.$set({
    key,
    parameter,
    date,
    refresh,
    url
  })
}
export default {
  getToken,
  getRefreshToken,
  setToken,
  setStorage
}
