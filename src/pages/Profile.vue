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
                <q-btn color="primary" label="Подключить" />
              </div>
              <div class="col-12 col-sm-6 col-md-6 text-center q-pb-md">
                <div class="text-h6">Почта</div>
              </div>
              <div class="col-12 col-sm-6 col-md-6 text-center">
                <q-btn color="primary" label="Подключить" />
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
        <q-card-section>
          <div class="row">
            <div class="col-12 col-sm-12 col-md-12 q-pb-sm">
              <q-input label="Текущий пароль" square outlined />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pb-sm">
              <q-input label="Новый пароль" square outlined />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pb-sm">
              <q-input label="Поторите новый пароль" square outlined />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn v-close-popup label="Закрыть" />
          <q-btn v-close-popup label="Сменить" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogs.notifteleg">
      <q-card>
        <q-card-section><div class="text-h6">Процедура подключения оповещений Telegram</div></q-card-section>
        <q-separator />
        <q-card-section>
          <q-banner class="shadow-3" v-if="uuid">
            <div class="q-pb-md">
              Чтобы подключить оповещения в мессенджере Telegram необходимо начать общение с ботом <a href="" @click="open_page('http://t.me/skiog_bot')">@skiog_bot</a>, а затем ему отправить следующее сообщение:
            </div>
            <q-banner dense class="bg-accent text-white">
              /register {{uuid}}
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
          </q-banner>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn v-close-popup label="Закрыть" />
          <q-btn v-close-popup v-if="uuid" label="Проверить подключение" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { openURL } from 'quasar'
// TODO: Сделать подключение к оповещениям (TELEGRAM, BROWSER)
export default {
  name: 'Profile',
  data () {
    return {
      dialogs: { notifteleg: false, change: false },
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
      uuid: null
    }
  },
  methods: {
    open_page: function (urls) {
      openURL(urls)
    }
  },
  mounted () {
    this.$axios({ method: 'POST', url: 'admin/users/' + this.$store.getters.getUserPk })
      .then((response) => {
        this.user = response.data
      })
  }
}
</script>
