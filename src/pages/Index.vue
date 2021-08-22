<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <!-- <div class="fit column wrap justify-start items-start content-start q-gutter-sm " > -->
    <div class="row" v-if='loadingcard'>
      <div class='col-12 col-sm-4 col-md-4 q-pl-xs q-pr-xs q-pb-sm' >
        <q-skeleton height="100px" />
      </div>
      <div class='col-12 col-sm-4 col-md-4 q-pl-xs q-pr-xs q-pb-sm' >
        <q-skeleton height="100px" />
      </div>
      <div class='col-12 col-sm-4 col-md-4 q-pl-xs q-pr-xs q-pb-sm' >
        <q-skeleton height="100px" />
      </div>
      <div class='col-12 col-sm-4 col-md-4 q-pl-xs q-pr-xs q-pb-sm' >
        <q-skeleton height="100px" />
      </div>
      <div class='col-12 col-sm-4 col-md-4 q-pl-xs q-pr-xs q-pb-sm' >
        <q-skeleton height="100px" />
      </div>
      <div class='col-12 col-sm-4 col-md-4 q-pl-xs q-pr-xs q-pb-sm' >
        <q-skeleton height="100px" />
      </div>
    </div>
    <div class="row" v-else>
      <div :class='`col-12 col-sm-4 col-md-${card.size} q-pl-xs q-pr-xs q-pb-sm`' v-for='card in cardws' :key="card.title" v-bind="card">
        <Cards :title='card.name' :link="card.to" :color="card.color" />
      </div>
    </div>
  </q-page>
</template>

<script>
import Cards from 'components/Cards.vue'

export default {
  name: 'PageIndex',
  components: { Cards },
  created () {
    this.$axios({ method: 'POST', url: '/main/', data: { type: 'start' } })
      .then(response => {
        this.cardws = response.data
        this.loadingcard = false
      })
  },
  data () {
    return {
      loadingcard: true,
      cardws: []
    }
  }
}
</script>
<style scoped>

</style>
