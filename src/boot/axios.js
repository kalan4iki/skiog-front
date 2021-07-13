/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'

let config = {
  baseURL: "http://192.168.10.82/api/rest/",
  // timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {

    return Promise.reject(error);
  }
);

Vue.prototype.$axios = _axios
var token = localStorage.getItem('token')
if ( token ) {
  Vue.prototype.$axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('token');
}
