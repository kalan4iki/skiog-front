<template>
  <q-dialog v-bind:value='value' v-on:hide="close" transition-show="slide-up" transition-hide="slide-down">
    <q-card>
      <q-form @submit="add_facts">
      <q-card-section>
          <div class="text-h6">Назначение факта для обращения</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-none">
          <div class="column">
            <div class="col">
              <q-select v-model="data_facts" :options="facts" label="Доступные факты" :rules="[v => !!v || 'Обязательно поле.']" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Закрыть" color="primary" v-close-popup />
          <q-btn flat label="Добавить" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'Fact',
  props: ['value', 'pk'],
  data () {
    return {
      facts: null,
      data_facts: null
    }
  },
  watch: {
    pk: function (newVal, lastVal) {
      if (newVal !== '') {
        this.get_facts()
      }
    }
  },
  methods: {
    close: function () {
      this.$emit('input', false)
    },
    refresh: function () {
      this.$emit('refresh')
    },
    get_facts: function () {
      this.$axios({ method: 'POST', url: '/getfacts/', data: { pk: this.pk } })
        .then((response) => {
          this.facts = response.data
        })
    },
    add_facts: function () {
      this.$axios({ method: 'PATCH', url: 'view/problem/' + this.pk + '/', data: { fact: this.data_facts.value } })
        .then((response) => {
          this.$q.notify({
            type: 'positive',
            message: 'Факт добавлен'
          })
          this.$emit('refresh')
          this.$emit('input', false)
        })
    }
  },
  mounted () {
  }
}
</script>
