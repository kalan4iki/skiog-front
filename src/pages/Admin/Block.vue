<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Управление блокировкой</div>
          </div>
          <div class="col">
            <q-input dense square outlined label="Найти обращение"/>
          </div>
          <div class="col" align='right'>
            <q-btn-group>
              <q-btn icon="file_download" @click="load_table"><q-tooltip>Загрузить таблицу</q-tooltip></q-btn>
            </q-btn-group>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-show="shows">
        <q-table></q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
export default {
  name: 'Block',
  data () {
    return {
      shows: false
    }
  },
  methods: {
    load_table: function () {
      this.shows = true
    }
  }
}
</script>
