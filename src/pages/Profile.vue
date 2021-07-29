<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <div class="row">
      <div class="col-12 col-sm-8 col-md-8 q-pl-xs q-pr-xs q-pb-sm">
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
              <div class="col-12 col-sm-9 col-md-9 q-pl-xs q-pr-xs q-pb-sm">
                <q-input v-model="user.first_name" dense square outlined />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Фамилия
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pl-xs q-pr-xs q-pb-sm">
                <q-input v-model="user.last_name" dense square outlined />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Адрес электронной почты
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pl-xs q-pr-xs q-pb-sm">
                <q-input v-model="user.email" dense square outlined />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Должность
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pl-xs q-pr-xs q-pb-sm">
                <q-input v-model="user.userprofile.post" dense square outlined />
              </div>
              <div class="col-12 col-sm-3 col-md-3 q-pl-xs q-pr-xs q-pb-sm text-center">
                Организация или тер. управление
              </div>
              <div class="col-12 col-sm-9 col-md-9 q-pl-xs q-pr-xs q-pb-sm">
                <q-input v-model="user.userprofile.org.label" dense square outlined readonly />
              </div>
              <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm"><q-separator /></div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Сохранить" />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md-4 q-pl-xs q-pr-xs q-pb-sm">
        <q-card style="">
          <q-card-section><div class="text-h6 text-center">Возможные системы оповещения</div></q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-6 col-md-6 text-center q-pb-md">
                <div class="text-h6">Telegram</div>
              </div>
              <div class="col-12 col-sm-6 col-md-6 text-center">
                <q-btn color="primary" label="Подключить" />
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
      </div>
      <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="col-4">
                <div class="text-h6">Группы</div>
              </div>
              <q-space />
              <!-- <div class="col-4" style="text-align: right;">
                <q-btn-group >
                  <q-btn color="grey-10" icon="add" >
                    <q-tooltip>
                      Добавить
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div> -->
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="col-4">
              <div class="text-h6">История пользователя</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
// TODO: Сделать подключение к оповещениям (TELEGRAM, BROWSER)
export default {
  name: 'Profile',
  data () {
    return {
      dialogs: { notif: false },
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
        }
      }
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
