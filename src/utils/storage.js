import storageMode from '@/storage'
const getToken = () => {
  const storage = storageMode['sessionStorage']
  return storage.$get({
    key: 'TOKEN'
  })
}
export default {
  getToken
}
