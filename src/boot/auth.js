// import something here
import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default boot(({ app, router, store }/* { app, router, Vue ... } */) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters.isLoggedIn) {
        next()
        return
      }
      next('/login')
    } else {
      next()
    }
  })
})
