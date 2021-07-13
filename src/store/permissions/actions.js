import vue from 'vue'
/*
export function someAction (context) {
}
*/
export function userPermission (context, data) {
  if (data != null) {
    vue.prototype.$axios({ method: 'POST', url: 'user/getinfo/', data: { action: 'perm' } })
      .then((response) => {
        context.commit('setPermissions', response.data)
      })
  }
}

export function userInfo (context, data) {
  if (data != null) {
    vue.prototype.$axios({ method: 'POST', url: 'user/getinfo/', data: { action: 'info' } })
      .then((response) => {
        context.commit('setUserInfo', response.data)
      })
  }
}

export function logout (context) {
  localStorage.removeItem('token')
  delete vue.prototype.$axios.defaults.headers.common.Authorization
  context.commit('logout')
}

export function login (context, data) {
  const requestOptions = { username: data.username, password: data.password }
  let token = ''
  vue.prototype.$axios.post('/auth/api-token-auth/', requestOptions)
    .then((response) => {
      token = response.data.token
      context.commit('login', token)
      vue.prototype.$q.notify({
        type: 'positive',
        message: 'Успешный вход'
      })
      localStorage.setItem('token', token)
      vue.prototype.$axios.defaults.headers.common.Authorization = 'Token ' + token
      return new Promise((resolve, reject) => {
        resolve()
      })
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let mes = ''
        for (const key in error.response.data) {
          mes = error.response.data[key]
        }
        vue.prototype.$q.notify({
          type: 'negative',
          message: `Ошибка авторизации: ${mes}`
        })
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
    })
}
