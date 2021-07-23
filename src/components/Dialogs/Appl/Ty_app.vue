<template>
  <q-dialog v-bind:value='value' v-on:hide="close" v-on:show="shows" transition-show="slide-left" transition-hide="jump-left">
    <q-card>
      <q-form @submit="add_ty">
        <q-card-section>
          <div class="text-h6">Назначение территориального управления</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-none">
          <div class="column">
            <div class="col">
              <q-select v-model="to_value" :options="tos" label="Территариальное управление" :rules="[v => !!v || 'Обязательно поле.']" />
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
  name: 'Ty_app',
  props: ['value', 'pk'],
  methods: {
    close: function () {
      this.$emit('input', false)
    },
    refresh: function () {
      this.$emit('refresh')
    },
    shows: function () {
      this.to_value = null
    },
    add_ty: function () {
      this.$axios({ method: 'PATCH', url: 'view/problem/' + this.pk + '/', data: { ciogv: this.to_value.value } })
        .then((response) => {
          this.$q.notify({
            type: 'positive',
            message: 'Территориальное управление добавлено'
          })
          this.$emit('refresh')
          this.$emit('input', false)
        })
    }
  },
  data () {
    return {
      tos: null,
      to_value: null
    }
  },
  mounted () {
    this.$axios({ method: 'POST', url: 'getto/' })
      .then((response) => {
        this.tos = response.data
      })
  }
}
</script>
