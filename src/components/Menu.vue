<template>
  <div>
    <q-list padding>
      <q-item v-ripple>
        <q-item-section>
          <q-form @submit="submit_sea">
            <q-input
              v-model="search"
              bg-color='white'
              square
              dense
              outlined
              label='Поиск'
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-form>
        </q-item-section>
      </q-item>
      <div v-for='item in menus' :key='item.name'>
        <q-item
          v-if='item.child.length == 0'
          clickable
          v-ripple
          tag="a"
          :to='item.to'
        >
          <q-item-section
            v-if="item.icon"
            avatar
          >
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-expansion-item
          v-else
          expand-separator
          :icon="item.icon"
          :label="item.name"
        >
          <q-list>
            <q-item v-for='chi in item.child' :key='chi.name' clickable v-ripple tag="a" :to='item.to + "/" + chi.to'>
              <q-item-section
                v-if="chi.icon"
                avatar
              >
                <q-icon :name="(chi.icon) ? chi.icon : 'arrow_forward_ios'" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ chi.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
        <q-separator v-if='item.separation' />
      </div>
      <q-space />
    </q-list>
  </div>
</template>
<script>
export default {
  name: 'Menu',
  methods: {
    logout () {
      this.$root.$emit('logout')
    },
    submit_sea () {
      const params = new URLSearchParams()
      params.append('pk', this.search)
      this.$axios({ method: 'GET', url: 'search/problem/', params: params })
        .then((response) => {
          this.$router.push({ name: 'appealnumber', params: { nomdobr: this.search } })
          this.search = ''
        })
        .catch(error => {
          this.$q.notify({
            type: 'negative',
            message: error.response.data.error
          })
        })
    }
  },
  created () {
    this.$axios({
      method: 'GET',
      url: '/getmenu/'
    }).then((response) => {
      this.menus = { ...this.menus, ...response.data }
      // this.menus = Object.assign({}, this.menus, response.data)
    })
    // Нужно доделать
    // console.log('icon' in this.menus[1].child[0])
    // this.$axios({ method: 'POST', url: '/main/', data: { type: 'start' } })
    //   .then(response => {
    //     console.log(response)
    //   })
  },
  data () {
    return {
      menus2: [
      ],
      search: '',
      menus: [
        {
          name: 'Главная',
          icon: 'foundation',
          to: '/main',
          child: [
          ],
          separation: false
        }
      ]
    }
  }
}
</script>
