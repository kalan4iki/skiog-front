<template>
  <q-dialog v-bind:value='value' v-on:hide="close" v-on:show="shows" transition-show="slide-left" transition-hide="jump-left">
    <q-card style="width: 1000px;">
      <q-card-section>
        <div class="text-h6 text-center">Просмотр пользователя</div>
        <div class="row">
          <div class="col-12 col-sm-10 col-md-10">
            <q-chip v-if='user.is_staff' square icon='admin_panel_settings' color="warning">Администратор</q-chip>
            <q-chip v-else square icon="person" class="text-white" color="positive">Пользователь</q-chip>
            <q-chip v-if='user.is_active' square icon="notifications" class="text-white" color="positive">Активен</q-chip>
            <q-chip v-else square icon="notifications_off" class="text-white" color="red">Не активен</q-chip>
          </div>
          <div class="col-12 col-sm-2 col-md-2 text-right">
            <q-btn v-if="user.is_staff" icon="person" color="positive" @click="edit_staff(false)"><q-tooltip>Убрать доступ администратора</q-tooltip></q-btn>
            <q-btn v-else icon="person" color="red" @click="edit_staff(true)"><q-tooltip>Дать доступ администратора</q-tooltip></q-btn>
          </div>
        </div>
      </q-card-section>
      <q-linear-progress v-show="loading" indeterminate />
      <q-separator />
      <q-card-section>
        <div class="row items-center text-center">
          <div class="col-12 col-sm-12 col-md-12 q-pb-md">
            <q-input v-model="user.username" square outlined label="Имя пользователя" />
          </div>
          <div class="col-12 col-sm-6 col-md-6 q-pb-md">
            <q-input v-model="user.last_name" square outlined label="Фамилия" />
          </div>
          <div class="col-12 col-sm-6 col-md-6 q-pb-md">
            <q-input v-model="user.first_name" square outlined label="Имя" />
          </div>
          <div class="col-12 col-sm-12 col-md-12 q-pb-md">
            <q-input v-model="user.email" square outlined label="Адрес электронной почты" />
          </div>
          <div class="col-12 col-sm-12 col-md-12 q-pb-md">
            <q-select v-model="user.groups" square outlined multiple use-chips stack-label :options="groups" label="Группа" />
          </div>
          <div class="col-12 col-sm-12 col-md-12 q-pb-md">
            <q-select v-model="user.userprofile.org" square outlined :options="orgs" label="Организация" />
          </div>
          <div class="col-12 col-sm-12 col-md-12 q-pb-md">
            <q-input v-model="user.userprofile.post" square outlined label="Должность" />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn v-close-popup label="Закрыть" />
        <q-btn v-close-popup @click="save_user" label="Сохранить" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'Viewuser',
  props: ['value', 'pk'],
  data () {
    return {
      loading: true,
      user: { username: null, last_name: null, first_name: null, is_active: null, is_staff: null, email: null, groups: null, userprofile: { org: null, post: null } },
      groups: null,
      orgs: null
    }
  },
  methods: {
    close: function () {
      this.$emit('input', false)
    },
    refresh: function () {
      this.$emit('refresh')
    },
    shows: function () {
      // this.user = { username: null, last_name: null, first_name: null, is_active: null, is_staff: null, email: null, groups: null, userprofile: { org: null } }
      // this.get_user()
    },
    get_org: function () {
      this.$axios({ method: 'GET', url: '/admin/get_orgs/' })
        .then((response) => {
          this.orgs = response.data
        })
    },
    get_groups: function () {
      this.$axios({ method: 'GET', url: '/admin/get_group/' })
        .then((response) => {
          this.groups = response.data
        })
    },
    edit_staff: function (type) {
      const data = new FormData()
      data.append('is_staff', type)
      this.$axios({ method: 'PATCH', url: '/admin/users/' + this.pk, data: data })
        .then((response) => {
          this.get_user()
        })
    },
    get_user: function () {
      this.loading = true
      const params = new URLSearchParams()
      params.append('pk', this.pk)
      this.$axios({ method: 'POST', url: '/admin/users/' + this.pk })
        .then((response) => {
          this.user = response.data
          this.loading = false
        })
    },
    save_user: function () {
      // const data = new FormData()
      for (const i in this.user) {
        if (i === 'userprofile') {
          console.log()
        }
        console.log(i)
        console.log(this.user[i])
      }
    }
  },
  watch: {
    pk: function (newval, oldval) {
      if (newval) {
        this.get_user()
      }
    }
  },
  mounted () {
    this.get_groups()
    this.get_org()
  }
}
</script>
