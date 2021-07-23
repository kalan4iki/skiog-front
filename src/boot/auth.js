import { boot } from 'quasar/wrappers'
import Vue from 'vue'
export default boot(({ router, store }/* { app, router, Vue ... } */) => {
  const PeRm = function (perm) {
    const userperms = store.getters.getPermissions
    if (userperms[perm.type] === 'superuser') {
      return true
    } else if (userperms[perm.type].includes(perm.name)) {
      return true
    } else {
      return false
    }
  }
  Vue.prototype.$init_perm = PeRm
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters.isLoggedIn) {
        next()
        return
      }
      next('/login')
    } else {
      if ('perm' in to.meta) {
        if (PeRm(to.meta.perm)) {
          next()
        } else {
          next('/main')
        }
      } else {
        next()
      }
    }
  })
})
