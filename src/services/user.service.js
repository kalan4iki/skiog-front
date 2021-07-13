/* eslint-disable */
import Vue from 'vue'

export const userService = {
  login,
  logout,
  authHeader
}
let _axios = Vue.prototype.$axios

function authHeader () {
  // return authorization header with basic auth credentials
  let user = JSON.parse(localStorage.getItem('user'))

  if (user && user.authdata) {
    return { 'Authorization': 'token ' + user.authdata }
  } else {
    return {}
  }
}

function login (username, password) {
  const requestOptions = { username: username, password: password }

  return _axios.post('/api-token-auth/', requestOptions)
    .then(handleResponse)
    .then(user => {
      // login successful if there's a user in the response
      if (user) {
        console.log(user)
        // store user details and basic auth credentials in local storage
        // to keep user logged in between page refreshes
        // user.authdata = window.btoa(username + ':' + password)
        localStorage.setItem('token', user.data.token)
      }

      return user
    })
}

function logout () {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
}

function handleResponse (response) {
  const data = response
  if (response.statusText !== 'OK') {
    if (response.status === 401) {
      // auto logout if 401 response returned from api
      logout()
      location.reload(true)
    }
    console.log(response)
    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }

  return data
}
