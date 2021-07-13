<template>
  <q-btn-dropdown color="white" text-color="black" :label="names">
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
</template>
<script>
export default {
  name: 'User',
  data () {
    return {
      names: ''
    }
  },
  methods: {
    logout () {
      this.$root.$emit('logout')
    }
  },
  computed: {
  },
  mounted: () => {
    console.log(window.vm)
    // window.vm.$watch
    console.log(this)
  }
}
</script>
