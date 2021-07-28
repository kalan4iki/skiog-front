<template>
  <q-layout class="background flex justify-center full-height" :class="heightSize">
    <q-card class="shadow-10" style="width: 400px;">
      <q-card-section :class="'text-white text-center width-3of4 bg-width-2of5 gt-bg-width-1of4 sm-auto ' + finalBgColor">
        <svg id="logo" viewBox="0 0 483 483"
            style="enable-background:new 0 0 460 460;"
            xml:space="preserve" width="128px" height="128px"
            v-html="logoMethod">
        </svg>
        <h4 class="q-mb-xs q-mt-md">Форма входа</h4>
        <h4 class="q-mb-xs q-mt-xs">С К И О Г</h4>
      </q-card-section>
      <q-form @submit="login">
        <q-card-section class="q-pa-md">
          <div class="q-gutter-y-md column">
            <q-input standout v-model="username" name="username" type="text" label="Логин" stack-label :rules="[ val => val && val.length > 0 || 'Обязательное поле']" />
            <q-input standout v-model="password" name="password" type="password" label="Пароль" stack-label :rules="[ val => val && val.length > 0 || 'Обязательное поле']" />
          </div>
        </q-card-section>
        <q-card-actions class="bg-deep-purple-2" vertical>
          <q-btn class="full-width" color="red" style="margin-bottom: 4%;" icon-right="send" label="Войти" type="submit" />
          <q-btn-group>
            <q-btn color="blue" disable label="Регистрация" />
            <q-btn color="green" disable label="Вспомнить пароль" />
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
    this.$store.commit('logout')
  },
  mounted () {
    this.startAnimation()
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
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      })
    }
  }
}
</script>
<style scoped>
  .background {
    background: #f4f6f9;
  }
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
