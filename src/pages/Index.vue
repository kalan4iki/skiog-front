<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <!-- <div class="fit column wrap justify-start items-start content-start q-gutter-sm " > -->
    <div class="row">
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
      })
  },
  data () {
    return {
      cardss: [
        {
          title: 'Ответов',
          number: '0',
          color: 'grey'
        },
        {
          title: 'Не распределенные обращения',
          number: '0',
          color: 'info'
        },
        {
          title: 'Обращения без ТУ',
          number: '0',
          color: 'info'
        },
        {
          title: 'Всего не закрытых обращения',
          number: '0',
          color: 'info'
        },
        {
          title: 'Всего не закрытых обращения',
          number: '0',
          color: 'info'
        }
      ],
      cardws: []
    }
  }
}
</script>
<style scoped>

</style>
