<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-grey">
      <q-toolbar class="bg-white text-black" style="animation: fadeInDown; animation-duration: 1s;">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          style="animation: fadeInLeft; animation-duration: 2s;"
        />

        <q-toolbar-title class="my-title" style="animation: fadeInDown; animation-duration: 2s;">
          С К И О Г
        </q-toolbar-title>
        <div>
          <q-btn-group style="animation: fadeInDown; animation-duration: 3s;">
            <q-btn color="primary" icon="support_agent" @click="dialog = true"><q-tooltip>Обращение в тех. поддержку</q-tooltip></q-btn>
            <q-btn-dropdown color="white" text-color="black" icon="person" :label="names">
              <q-list dense>
                <q-item clickable :to='"/profile"' v-close-popup>
                  <q-item-section avatar>
                    <q-icon color="black" name="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Профиль</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click='logout'>
                  <q-item-section avatar>
                    <q-icon color="black" name="logout" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Выйти из системы</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-btn-group>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer ref="leftDrawer"  show-if-above elevated v-model="leftDrawerOpen" :mini="miniState">
      <q-scroll-area class="fit shadow-3" style="animation: fadeInLeft; animation-duration: 1s;">
        <Menu />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <transition appear
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown"
      >
        <router-view />
      </transition>
    </q-page-container>
    <q-dialog v-model="dialog" transition-show="jump-up" transition-hide="jump-down">
      <q-card style="width: 800px;">
        <q-form @submit="send_tp">
          <q-card-section>
            <div class="text-h6">Отправка заявки в тех. поддержку</div>
          </q-card-section>
          <q-linear-progress v-if="dialog_load" indeterminate size="20px" color="accent" class="q-mt-sm" />
          <q-separator />
          <q-card-section>
            <q-input v-model="input_tp" class="q-pb-md" label="Текст обращения" rows="4" type="textarea" square outlined :rules="[ val => val && val.length > 0 || 'Пожалуйста, напишите что-нибудь']"></q-input>
            <q-banner class="shadow-3">Просьба описывать полностью проблему.</q-banner>
          </q-card-section>
          <q-card-actions>
            <q-space />
            <q-btn>Закрыть</q-btn>
            <q-btn type="submit">Отправить</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import Menu from 'components/Menu.vue'

export default {
  name: 'MainLayout',
  components: { Menu },
  data () {
    return {
      leftDrawerOpen: false,
      names: this.$store.getters.getUserInfo.full_name,
      miniState: false,
      dialog: false,
      dialog_load: false,
      input_tp: ''

    }
  },
  computed: {
  },
  mounted () {
    this.$store.dispatch('userPermission', 'perm')
    this.$store.dispatch('userInfo', 'info')
    this.$watch(
      function () {
        return this.$store.getters.getUserInfo.full_name
      },
      function (newVal, oldVal) {
        this.names = newVal
      }
    )
  },
  methods: {
    send_tp: function () {
      this.dialog_load = true
      this.$axios({ method: 'POST', url: 'create_bug/', data: { message: this.input_tp } })
        .then((response) => {
          this.$q.notify({
            type: 'info',
            message: `Обращение отправлено. Номер обращения ${response.data.id}.`
          })
          this.input_tp = ''
          this.dialog = false
          this.dialog_load = false
        })
    },
    test () {
    },
    logout () {
      this.$root.$emit('logout')
    },
    dark_mode () {
      this.$q.dark.set(!this.$q.dark.isActive)
    }
  }
}
</script>
<style scoped>
.fit {
  background: #343a40;
  color: #c2c7d0;
}
.q-page-container {
  background: #f4f6f9;
}
/* .my-title {
  display: inline-block;
  margin: 0 0.5rem;
  animation: animate__flipInX;
  animation-duration: 2s;
} */
</style>
