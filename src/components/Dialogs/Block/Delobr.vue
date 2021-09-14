<template>
  <q-dialog v-bind:value='value' v-on:hide="$emit('input', false)">
    <q-layout view="hHh lpR fFf" container class="bg-white" style="max-width: 800px; height: 500px">
      <q-header class="bg-indigo">
        <q-toolbar>
          <q-btn flat v-close-popup round icon="close" />
          <q-toolbar-title>Удаление обращения с блокировки</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-expansion-item
          expand-separator
          :label="`Обращение №${this.obr.nomdobr}. Статус блокировок: ${this.obr.get_status_display}. `"
          :caption="`Дата создания: ${this.obr.datecre}`"
        >
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
              commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-page-container>
      <q-footer elevated class="bg-indigo-8 text-white">
        <q-toolbar>
          <q-space />
          <q-btn class="full-width" flat type="submit" label="Удалить" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'Delobr',
  data () {
    return {
      obr: { nomdobr: null }
    }
  },
  props: ['value', 'pk'],
  watch: {
    pk: function (newvalue, lastvalue) {
      if (newvalue) {
        this.$axios({ method: 'get', url: 'block/view/appeal/' + newvalue })
          .then((response) => {
            this.obr = response.data
          })
      }
    }
  }
}
</script>
