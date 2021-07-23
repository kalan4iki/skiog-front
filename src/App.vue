export * from './user.service'
<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  created () {
    this.$q.addressbarColor.set('#616161')
    function cb () {
      localStorage.removeItem('token')
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
    this.$root.$on('logout', cb)
    // Vue.prototype.$init_perm = function (perm) {
    //   const userperms = this.$store.getters.getPermissions
    //   if (userperms[perm.type] === 'superuser') {
    //     return true
    //   } else if (userperms[perm.type].includes(perm.name)) {
    //     return true
    //   } else {
    //     return false
    //   }
    // }
  }
}

</script>
