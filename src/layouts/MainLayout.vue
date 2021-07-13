<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-grey">
      <q-toolbar class="bg-white text-black" >
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="my-title" style="animation: flipInX; animation-duration: 1s;">
          SKIOG
        </q-toolbar-title>
        <div>
          <q-btn-group>
            <q-btn color="primary" icon="support_agent"><q-tooltip>Обращение в тех. поддержку</q-tooltip></q-btn>
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
      <q-scroll-area class="fit shadow-3">
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
      miniState: false
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
