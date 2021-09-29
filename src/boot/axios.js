/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'

export default (({ app, router, store }) => {
  let config = {}
  if (process.env.NODE_ENV === 'development') {
    config = {
      baseURL: `http://192.168.10.82/api/rest/`,
      // timeout: 60 * 1000, // Timeout
      withCredentials: true, // Check cross-site Access-Control
    }
  } else {
    config = {
      // baseURL: `${window.location.origin}/api/rest/`,
      baseURL: `https://skiog.ru/api/rest/`,
      // timeout: 60 * 1000, // Timeout
      withCredentials: true, // Check cross-site Access-Control
    }
  }
  const _axios = axios.create(config)
  // Add a response interceptor
  _axios.interceptors.response.use(
    function(response) {
      // Do something with response data
      return response;
    },
    function(error) {
      if (error.response.status === 401) {
        router.push('/login')
      }
      return Promise.reject(error);
    }
  )
  Vue.prototype.$axios = _axios
  var token = localStorage.getItem('token')
  if ( token ) {
    Vue.prototype.$axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('token');
  }
})
