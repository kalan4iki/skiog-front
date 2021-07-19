<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <div class="row justify-between">
      <div class="col-12 col-sm-1 col-md-3 q-pr-md ">
        <div class="column">
          <div class="col q-pb-lg">
            <q-form @submit="search_obr">
            <q-input
              class=""
              square
              outlined
              label='Поиск'
              v-model="searchnom"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search_obr"/>
              </template>
            </q-input>
            </q-form>
          </div>
          <div class="col q-pb-lg">
            <q-btn class="full-width" color="indigo-6" icon="add" label="Добавить" @click="dialogs.add = true"/>
          </div>
          <div class="col q-pb-lg">
            <q-btn class="full-width" color="indigo-6" icon="refresh" label="Обновить таблицу" @click="get_table" />
          </div>
          <div class="col q-pb-lg">
           <q-btn class="full-width" color="indigo-6" :label="subscribe.text_btn" :disable='subscribe.status' @click="click_subscr">
              <q-tooltip>
                {{ subscribe.message }}
              </q-tooltip>
           </q-btn>
          </div>
          <div class="col q-pb-lg">
            <q-tabs
              v-model="tab"
              vertical
              dense
              class="shadow-3 bg-indigo-6 text-white"
            >
              <q-tab v-for='(cat, index) in category' :key="cat.nom" :name='index' :icon='cat.icon' :label='cat.text' />
            </q-tabs>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-1 col-md-9">
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <div class="col-12 col-sm-3 col-md-3">
                 <div class="text-h6">{{ category[tab]['text'] }}</div>
              </div>
              <div class="col-12 col-sm-9 col-md-6">
                <q-input
                    v-model="search"
                    square
                    outlined
                    label='Поиск по таблице'
                  >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-2 col-md-3" align="right">
                <q-toggle
                  v-model="me"
                  color="red"
                  label="Смотреть свои"
                  left-label
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-table
              :data="data"
              :columns="columns"
              row-key="nomdobr"
              :pagination="initialPagination"
              bordered
              :filter="search"
              :loading='loading'
              separator='cell'
              @row-click='search_obr'
              @row-contextmenu='copyobr'
            >
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <ViewobrVue v-model="dialogs.view" :obr='task' />
    <AddobrVue v-model="dialogs.add" @refresh="get_table" />
  </q-page>
</template>

<script>
/* eslint-disable */
import ViewobrVue from 'components/Dialogs/Block/Viewobr.vue'
import AddobrVue from 'components/Dialogs/Block/Addobr.vue'

export default {
  name: 'BlockMain',
  components: { ViewobrVue, AddobrVue },
  data () {
    return {
      dialogs: {
        view: false,
        add: false
      },
      me: false,
      category: [
        {
          icon: 'settings_input_antenna',
          color: 'green',
          text: 'На согласовании',
          nom: '4'
        },
        {
          icon: 'work',
          color: 'deep-orange',
          text: 'В работе',
          nom: '0'
        },
        {
          icon: 'textsms',
          color: 'deep-purple lighten-3',
          text: 'На блокировке',
          nom: '1'
        },
        {
          icon: 'close',
          color: 'black',
          text: 'Закрытые',
          nom: '2'
        },
        {
          icon: 'block',
          color: 'red',
          text: 'Отклоненные',
          nom: '3'
        }
      ],
      tab: 0,
      columns: [
        { label: 'ID', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 70px' },
        { label: 'Номер обращения', name: 'nomd', field: 'nomd', align: 'left', headerStyle: 'width: 160px; white-space: normal' },
        { label: 'Дата создания', name: 'datecre', field: 'datecre', align: 'center', style: 'width: 140px; white-space: normal' },
        { label: 'Статус', name: 'status', field: 'status', align: 'left', style: 'width: 150px; white-space: normal' },
        { label: 'Пользователь', name: 'user', field: 'user', align: 'left', style: 'width: 140px; white-space: normal' },
        { label: 'Модератор', name: 'usermoder', field: 'usermoder', align: 'left', style: 'width: 140px; white-space: normal' },
        { label: 'Комментарий', name: 'text', field: 'text', align: 'left', style: 'max-width: 150px; white-space: normal' }
      ],
      data: [],
      loading: true,
      search: '',
      searchnom: '',
      task: {
        last_text: '',
        text: '',
        nomd: '',
        pk: '',
        status: '',
        datecre: '',
        datebzm: '',
        image: false,
        message: false,
        times: null
      },
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 15
        // rowsNumber: xx if getting data from a server
      },
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
    postSubscribeObj: function (statusType, subscription, callback) {
      const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase()
      const data = { status_type: statusType, subscription: subscription.toJSON(), browser: browser }
      this.$axios({ method: 'POST', url: this.subscribe.url, headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(data) })
        .then(callback)
      // fetch(this.subscribe.url, {
      //   method: 'post',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      //   credentials: 'include'
      // }).then(callback)
    },
    initialiseState: function (reg) {
      const self = this
      if (Notification.permission === 'denied') {
        this.subscribe.message = 'Вы заблокировали доступ к уведомлениям'
        this.subscribe.text_btn = 'Подписаться'
        this.subscribe.status = true
        return
      }
      if (!('PushManager' in window)) {
        this.subscribe.message = 'Подпишитесь на рассылку push-сообщений'
        this.subscribe.text_btn = 'Подписаться'
        this.subscribe.status = true
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
        this.subscribe.message = 'Подпишитесь на рассылку push-сообщений'
        this.subscribe.text_btn = 'Подписаться'
        this.subscribe.status = false
        return
      }
    },
    get_table: function () {
      this.loading = true
      this.data = []
      const params = new URLSearchParams()
      params.append('status', 'status-' + this.category[this.tab].nom)
      params.append('selectme', this.me)
      this.$axios
        .post('block/table/', params)
        .then(response => {
          this.data = response.data.appe
          this.loading = false
        })
        .catch(error => {
          this.$q.notify({
            type: 'negative',
            message: `Ошибка №${error.response.status}. Текст ошибки: ${error.response.data.error}`
          })
        })
    },
    search_obr: function (event, row) {
      event.preventDefault()
      const params = new URLSearchParams()
      if (row) {
        params.append('pk', row.nomd)
      } else {
        params.append('pk', this.searchnom)
      }
      this.$axios
        .post('block/obr_view/', params)
        .then(response => {
          if (response.data.status === 'error') {
            this.$q.notify({
              type: 'negative',
              message: `Текст ошибки: ${response.data.text}`
            })
          } else {
            this.task = response.data.app
            this.dialogs.view = true
          }
        })
    },
    copyobr: function (event, row) {
      event.preventDefault()
      navigator.clipboard.writeText(row.nomd)
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
  watch: {
    tab: function (newTab, oldTab) {
      this.get_table()
    },
    me: function (newSelect) {
      localStorage.selectMe = newSelect
      this.get_table()
    }
  },
  mounted () {
    if (localStorage.selectMe) this.selectMe = localStorage.selectMe
    const self = this
    this.get_table()
    if ('serviceWorker' in navigator) {
      const serviceWorker = this.worker
      navigator.serviceWorker.register(serviceWorker).then(
        function (reg) {
          self.subscribe.registration = reg
          self.initialiseState(reg)
        })
    } else {
      this.subscribe.message('Оповещения в ващем браузере не поддерживаются.')
      this.subscribe.status = true
    }
  }
}
</script>
