<template>
  <q-layout class="background flex justify-center full-height" :class="heightSize">
    <q-card class="" style="width: 400px;">
      <q-card-section :class="'text-white text-center width-3of4 bg-width-2of5 gt-bg-width-1of4 sm-auto ' + finalBgColor">
        <svg id="logo" viewBox="0 0 483 483"
            style="enable-background:new 0 0 460 460;"
            xml:space="preserve" width="128px" height="128px"
            v-html="logoMethod">
        </svg>
        <h4>Форма входа</h4>
      </q-card-section>
      <q-form @submit="login" style="animation: jackInTheBox; animation-duration: 1s;">
        <q-card-section class="q-pa-md">
          <div class="q-gutter-y-md column">
            <q-input standout v-model="username" name="username" type="text" label="Логин" stack-label :rules="[ val => val && val.length > 0 || 'Обязательное поле']" />
            <q-input standout v-model="password" name="password" type="password" label="Пароль" stack-label :rules="[ val => val && val.length > 0 || 'Обязательное поле']" />
          </div>
        </q-card-section>
        <q-card-actions vertical>
          <q-btn color="red" style="margin-bottom: 4%;" icon-right="send" label="Войти" type="submit" />
          <q-btn-group>
            <q-btn color="blue" label="Регистрация" />
            <q-btn color="green" label="Вспомнить пароль" />
          </q-btn-group>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-layout>
</template>

<script>
/* eslint-disable */
import Vivus from 'vivus'
import loginlogo from './other/loginlogo'
import { Platform } from 'quasar'
// import Particles from 'particlesjs'
export default {
  name: 'Login',
  data () {
    return {
      logos: Object.keys(loginlogo),
      logo: 'Digitalizer',
      vivus: '',
      username: '',
      password: '',
      bgColor: 'red',
      toneColor: 10,
      returnUrl: ''
    }
  },
  created () {
    this.returnUrl = this.$route.query.returnUrl || '/';
  },
  mounted () {
    // this.$store.dispatch('logout')
    this.startAnimation()
    // Particles.init({
    //   selector: '.background',
    //   responsive: [
    //     {
    //       breakpoint: 768,
    //       options: {
    //         maxParticles: 200,
    //         color: '#48F2E3',
    //         connectParticles: false
    //       }
    //     }, {
    //       breakpoint: 425,
    //       options: {
    //         maxParticles: 100,
    //         connectParticles: true
    //       }
    //     }, {
    //       breakpoint: 320,
    //       options: {
    //         maxParticles: 0 // disables particles.js
    //       }
    //     }
    //   ]
    // })
  },
  computed: {
    heightSize () {
      if (Platform.is.desktop) {
        return 'items-center'
      }
      return ''
    },
    logoMethod () {
      return loginlogo[this.logo]
    },
    finalBgColor () {
      return `bg-${this.bgColor}`
    }
  },
  methods: {
    startAnimation () {
      this.vivus = new Vivus('logo', {
          duration: 300,
          forceRender: false
        }, function(element) {
          for (let item of element.el.children[0].children) {
            item.setAttribute('style', 'fill:white')
            item.setAttribute('style', 'fill:white')
          }
        }
      )
    },
    login2 () {
      const data = { username: this.username, password: this.password, returnUrl: this.returnUrl, router: this.$router }
      this.$store.dispatch('login', data)
        .then(() => {
          // console.log(this.$store.state)
          this.$router.replace(this.returnUrl)
        })
    },
    login () {
      const requestOptions = { username: this.username, password: this.password }

      this.$axios.post('/auth/api-token-auth/', requestOptions)
      .then(user => {
        this.$q.notify({
          type: 'positive',
          message: 'Успешный вход'
        })
        if (user) {
          localStorage.setItem('token', user.data.token)
          this.$store.commit('login', user.data.token)
          this.$axios.defaults.headers.common['Authorization'] = 'Token ' + user.data.token
          this.$router.push(this.returnUrl)
        }

        return user
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          var mes = ''
          for (const key in error.response.data) {
            mes = error.response.data[key]
          }
          this.$q.notify({
            type: 'negative',
            message: `Ошибка авторизации: ${mes}`
          })
          console.log(error.response.data);
          console.log(error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      })
      .then(function () {
        // always executed
      });
    }
  }
}
</script>
<style scoped>
  .q-card {
    margin-bottom: 0px;
  }
  .card-content {
    min-height: 160px;
  }
  h4 {
    font-weight: 300;
  }
  body {
    color: #6c757d;
  }
</style>
