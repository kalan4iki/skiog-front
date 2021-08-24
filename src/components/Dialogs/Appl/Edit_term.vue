<template>
  <q-dialog v-bind:value='value' v-on:hide="close" transition-show="slide-up" transition-hide="slide-down">
    <q-card>
      <q-form @submit="save_term">
      <q-card-section><div class="text-h6">Редактирование срока назначения</div></q-card-section>
      <q-separator />
      <q-card-section>
        <q-input  label='Срок' v-model="term.date" mask="##.##.####" :rules="[date_rul]">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="term.date" mask="DD.MM.YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Закрыть" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn v-close-popup label="Закрыть" />
        <q-btn type="submit" label="Сохранить" />
      </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'Edit_term',
  props: ['value', 'pk'],
  watch: {
    pk: function () {
      this.get_term()
    }
  },
  data () {
    return {
      term: { date: '' },
      date_rul: v => /^\d{2}.\d{2}.\d{4}$/.test(v)
    }
  },
  methods: {
    close: function () {
      this.$emit('input', false)
    },
    get_term: function () {
      if (this.pk) {
        this.$axios({ method: 'GET', url: 'view/term/' + this.pk })
          .then((response) => {
            this.term = response.data
          })
      }
    },
    refresh: function () {
      this.$emit('refresh')
    },
    save_term: function () {
      const data = new FormData()
      data.append('date', this.term.date)
      this.$axios({ method: 'PATCH', url: 'view/term/' + this.pk + '/', data: data })
        .then((response) => {
          this.$q.notify({
            type: 'positive',
            message: 'Назначение изменено.'
          })
          this.$emit('input', false)
          this.refresh()
        })
    }
  }
}
</script>
