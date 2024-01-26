<template>
  <div id="app"></div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'app',
  data() {
    return {
      notFound: true
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    })
  },
  create() {
    this.notFound = false
    this.init()
  },
  method: {
    ...mapActions({
      getUserInfo: 'getUserInfo'
    }),
    init() {
      this.getUserInfo().then(() => {
        if (!this.userInfo || Object.keys(this.userInfo).length === 0) {
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>
<style></style>
