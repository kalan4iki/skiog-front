<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <div class="row">
      <div class="col-8 col-sm-8 col-md-8 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
                <div class="text-h6 text-center">Карточка пользователя</div>
                <div class="text-subtitle2 text-right">Дата регистрации: {{ user.date_joined }}</div>
                <div class="text-subtitle2 text-right">Последний вход: {{ user.last_login }}</div>
          </q-card-section>
          <q-card-section>
            <div class="row items-center">
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Имя пользователя
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pl-xs q-pr-xs q-pb-sm">
                <q-input v-model="user.username" dense readonly square outlined />
              </div>
              <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm"><q-separator /></div>
              <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm text-center">Персональная информация</div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Имя
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pb-sm">
                <q-input v-model="user.first_name" dense square outlined />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Фамилия
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pb-sm">
                <q-input v-model="user.last_name" dense square outlined />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Адрес электронной почты
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pb-sm">
                <q-input v-model="user.email" dense square outlined />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Должность
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pb-sm">
                <q-input v-model="user.userprofile.post" dense square outlined />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Организация или тер. управление
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pb-sm">
                <q-input v-model="user.userprofile.org.label" dense square outlined readonly />
              </div>
              <div class="col-12 col-sm-12 col-md-12"><q-separator /></div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-chip v-if="user.is_active" color="positive" label="Активный пользователь" />
            <q-chip v-else color="negative" label="Не активный пользователь" />
            <q-space />
            <q-btn color="info" label="Сменить пароль" @click="dialogs.change = true" />
            <q-btn label="Сохранить" />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-4 col-sm-4 col-md-4 q-pl-xs q-pr-xs q-pb-sm">
        <q-card class="q-mb-sm">
          <q-card-section><div class="text-h6 text-center">Возможные системы оповещения</div></q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-6 col-md-6 text-center q-pb-md">
                <div class="text-h6">Telegram</div>
              </div>
              <div class="col-12 col-sm-6 col-md-6 text-center">
                <q-btn color="primary" label="Подключить" @click="dialogs.notifteleg = true" />
              </div>
              <div class="col-12 col-sm-6 col-md-6 text-center q-pb-md">
                <div class="text-h6">Браузер</div>
              </div>
              <div class="col-12 col-sm-6 col-md-6 text-center">
                <q-btn color="primary" :disable='subscribe.status' :label="subscribe.text_btn" @click="click_subscr">
                  <q-tooltip>
                    {{ subscribe.message }}
                  </q-tooltip>
                </q-btn>
              </div>
              <div class="col-12 col-sm-6 col-md-6 text-center q-pb-md">
                <div class="text-h6">Почта</div>
              </div>
              <div class="col-12 col-sm-6 col-md-6 text-center">
                <q-btn @click="dialogs.email=true" color="primary" label="Подключить" />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="col-4">
                <div class="text-h6">Группы</div>
              </div>
              <q-space />
            </div>
          </q-card-section>
          <q-card-section>
            <q-list bordered separator>
              <q-item clickable v-ripple v-for="group in user.groups" :key="group.value">
                <q-item-section>№ {{group.value}}. Название: {{group.label}}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="col-4">
              <div class="text-h6">История пользователя</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="dialogs.change">
      <q-card style="width: 800px;">
        <q-card-section><div class="text-h6 text-center">Процедура смены пароля</div></q-card-section>
        <q-separator />
        <q-form spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" @submit="submit_editpass">
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-12 col-md-12 q-pb-sm">
                <q-input autocomplete="new-password" v-model="dialogs_data.edit_password.last_password" type="password" label="Текущий пароль" square outlined :rules="[ val => val && val.length > 0 || 'Обязательное поле']" />
              </div>
              <div class="col-12 col-sm-12 col-md-12 q-pb-sm">
                <q-input v-model="dialogs_data.edit_password.new_password" type="password" label="Новый пароль" square outlined :rules="[ val => val && val.length > 0 || 'Обязательное поле']" />
              </div>
              <div class="col-12 col-sm-12 col-md-12 q-pb-sm">
                <q-input v-model="dialogs_data.edit_password.reply_new_password" type="password" label="Поторите новый пароль" square outlined :rules="[ val => val && val.length > 0 || 'Обязательное поле']" />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn v-close-popup label="Закрыть" />
            <q-btn type="submit" label="Сменить" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogs.notifteleg">
      <q-card>
        <q-card-section><div class="text-h6">Процедура подключения оповещений Telegram</div></q-card-section>
        <q-separator />
        <q-card-section>
          <q-banner class="shadow-3" v-if="uuid">
            <div class="q-pb-md">
              Чтобы подключить оповещения в мессенджере Telegram необходимо начать общение с ботом <a href="" @click="open_page('http://t.me/skiog_bot?start='+uuid)">@skiog_bot</a>
            </div>
            <q-banner dense class="bg-accent text-white">
              Если не получилось привязать аккаунт отправьте боту команду: /start {{uuid}}
              <template v-slot:avatar>
                <q-btn flat color="white" label="Скопировать" />
              </template>
            </q-banner>
          </q-banner>
          <q-banner class="bg-warning" v-else>
            Не получается получить токен авторизации. Обратитесь к системному администратору.
            <template v-slot:avatar>
              <q-icon name="warning" />
            </template>
            <template v-slot:action>
              <q-btn flat label="Обновить" @click="get_uuid" />
            </template>
          </q-banner>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn v-close-popup label="Закрыть" />
          <q-btn v-close-popup v-if="uuid" label="Проверить подключение" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogs.email">
      <q-card>
        <q-card-section><div class="text-h6">Процедура подключения оповещений на почту</div></q-card-section>
        <q-separator />
        <q-card-section>
          <q-banner class="shadow-3">
            Подключение оповощений на указанную, в вашем профиле, почту. Оповещения в подсистемах "Блокировки" и "Обращения"
          </q-banner>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Закрыть" />
          <q-btn color="primary" label="Подключить" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
/* eslint-disable */
import { openURL } from 'quasar'
// TODO: Сделать подключение к оповещениям (TELEGRAM, ПОЧТА)
export default {
  name: 'Profile',
  data () {
    return {
      dialogs: { notifteleg: false, change: false, email: false },
      user: {
        username: null,
        first_name: null,
        last_name: null,
        email: null,
        last_login: null,
        date_joined: null,
        userprofile: {
          org: { label: null },
          ty: { label: null },
          post: null
        },
        groups: null,
        is_active: true,
        is_staff: false
      },
      dialogs_data: {
        edit_password: {
          last_password: null,
          new_password: null,
          reply_new_password: null
        }
      },
      uuid: null,
      subscribe: {
        message: '',
        status: true,
        isPushEnabled: false,
        text_btn: 'Подписаться',
        registration: null,
        url: 'http://192.168.10.82/api/rest/push/save_information'
      },
      vapid_keys: 'BPelT85m1o6-0dMF0x-htr5gE85g3IOmKxoJrvZ7z481h5cpiE1uzeAtTHZA67lqSrpl-c7vlho6_qV_uPJC-pU',
      worker: '/service-worker.js'
    }
  },
  methods: {
    submit_editpass: function () {
      if (this.dialogs_data.edit_password.reply_new_password !== this.dialogs_data.edit_password.new_password) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Новый пароль не совпадает с повторением введите заново'
        })
        this.dialogs_data.edit_password.new_password = null
        this.dialogs_data.edit_password.reply_new_password = null
      } else {
        const data = { 
          new_password: this.dialogs_data.edit_password.new_password,
          last_password: this.dialogs_data.edit_password.last_password
        }
        this.$axios({ method: 'POST', url: 'user/edit_password/', data })
          .then(user => {
            this.$q.notify({
              type: 'positive',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Успешная смена пароля'
            })
          })
          .catch(error => {
            if (error.response) {
              this.$q.notify({
                type: 'negative',
                message: `Ошибка при смене пароля. Код ошибки: ${error.response.status}`
              })
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
          })
      }
    },
    open_page: function (urls) {
      openURL(urls)
    },
    get_uuid: function () {
      this.$axios({ method: 'POST', url: 'notif/get_telegram/' })
        .then((response) => {
          this.uuid = response.data.uuid
        })
    },
    get_info: function () {
      this.$axios({ method: 'POST', url: 'admin/users/' + this.$store.getters.getUserPk })
        .then((response) => {
          this.user = response.data
        })
    },
    postSubscribeObj: function (statusType, subscription, callback) {
      const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase()
      const data = { status_type: statusType, subscription: subscription.toJSON(), browser: browser }
      this.$axios({ method: 'POST', url: this.subscribe.url, headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(data) })
        .then(callback)
    },
    initialiseState: function (reg) {
      const self = this
      if (Notification.permission === 'denied') {
        self.subscribe.message = 'Вы заблокировали доступ к уведомлениям'
        self.subscribe.text_btn = 'Подписаться'
        self.subscribe.status = true
        return
      }
      if (!('PushManager' in window)) {
        self.subscribe.message = 'Подпишитесь на рассылку push-сообщений'
        self.subscribe.text_btn = 'Подписаться'
        self.subscribe.status = true
        return
      }
      reg.pushManager.getSubscription().then(
        function (subscription) {
          if (subscription) {
            self.postSubscribeObj('subscribe', subscription,
              function (response) {
                if (response.status === 201) {
                  self.subscribe.message = 'Отписаться от уведомления'
                  self.subscribe.status = false
                  self.subscribe.isPushEnabled = true
                  self.subscribe.text_btn = 'Отписаться'
                }
              })
          }
        })
      if (!!(reg.showNotification)) {
        self.subscribe.message = 'Подпишитесь на рассылку push-сообщений'
        self.subscribe.text_btn = 'Подписаться'
        self.subscribe.status = false
        return true
      }
    },
    click_subscr: function () {
      this.subscribe.status = true
      if (this.subscribe.isPushEnabled) {
        return this.unsubscribe(this.subscribe.registration)
      }
      return this.subscribe_func(this.subscribe.registration)
    },
    urlB64ToUint8Array: function (base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    },
    subscribe_func: function (reg) {
      const self = this
      reg.pushManager.getSubscription().then(
        function (subscription) {
          // Check if Subscription is available
          if (subscription) {
            return subscription
          }

          const metaObj = self.vapid_keys
          const applicationServerKey = metaObj.content
          const options = {
            userVisibleOnly: true
          }
          if (applicationServerKey) {
            options.applicationServerKey = self.urlB64ToUint8Array(applicationServerKey)
          }
          reg.pushManager.subscribe(options)
            .then(
              function (subscription) {
                self.postSubscribeObj('subscribe', subscription,
                  function (response) {
                    if (response.status === 201) {
                      self.subscribe.message = 'Отписаться от уведомления'
                      self.subscribe.status = false
                      self.subscribe.isPushEnabled = true
                      self.subscribe.text_btn = 'Отписаться'
                    }
                  })
              })
            .catch(
              function () {
                console.log('Ошибка подписки.', arguments)
              })
        }
      )
    },
    unsubscribe: function (reg) {
      const self = this
      reg.pushManager.getSubscription()
        .then(
          function (subscription) {
            if (!subscription) {
              self.subscribe.status = false
              self.subscribe.message = 'Подписка на уведомление недоступно'
              return
            }
            self.postSubscribeObj('unsubscribe', subscription,
              function (response) {
                // Check if the information is deleted from server
                if (response.status === 202) {
                  // Get the Subscription
                  // Remove the subscription
                  subscription.unsubscribe()
                    .then(
                      function (successful) {
                        self.subscribe.message = 'Подпишитесь на рассылку push-сообщений'
                        self.subscribe.status = false
                        self.subscribe.isPushEnabled = false
                        self.subscribe.text_btn = 'Подписаться'
                      }
                    )
                    .catch(
                      function (error) {
                        self.subscribe.message = 'Отписаться от уведомления'
                        self.subscribe.status = false
                        self.subscribe.text_btn = 'Отписаться'
                      }
                    )
                }
              })
          }
        )
    }
  },
  mounted () {
    this.get_info()
    this.get_uuid()
    const self = this
    if ('serviceWorker' in navigator) {
      const serviceWorker = this.worker
      navigator.serviceWorker.register(serviceWorker).then(
        function (reg) {
          self.subscribe.registration = reg
          self.initialiseState(reg)
        })
    } else {
      this.subscribe.message = 'Оповещения в ващем браузере не поддерживаются'
      this.subscribe.status = true
    }
  }
}
</script>
