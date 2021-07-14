<template>
  <q-card style="animation: fadeIn; animation-duration: 1s;">
    <q-card-section :class="'bg-' + this.color">
      <div>
        <q-spinner-gears v-if='loading' color="black" size="3em" />
        <div v-else class="text-h6">{{ number }}</div>
      </div>
      <div :class="`text-subtitle1 text-${colortext}`">{{ title }}</div>
    </q-card-section>
    <q-card-actions vertical class="bg-blue-grey-1">
      <q-btn color="blue-grey-2" :to='`/appeal/${link}`' class="text-black">Перейти</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import { colors } from 'quasar'
export default {
  name: 'Cards',
  data () {
    return {
      number: 0,
      loading: true,
      colortext: 'black'
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },

    link: {
      type: String,
      default: '#'
    },

    color: {
      type: String,
      default: 'blue'
    }
  },
  created () {
    colors.setBrand('info', '#17a2b8')
  },
  mounted () {
    this.$axios({ method: 'POST', url: '/main/', data: { type: 'card', action: this.link } })
      .then(response => {
        this.number = response.data.kolvo
        this.loading = false
      })
  }
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
</style>
