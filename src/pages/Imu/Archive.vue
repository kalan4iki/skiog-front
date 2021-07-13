<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="row">
              <div class="col">
                <div class="text-h6">Архив</div>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-table
              :data="data"
              :columns="columns"
              row-key="nomdobr"
              :pagination="initialPagination"
              bordered
              :loading='load'
              separator='cell'
            >
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Archive',
  data () {
    return {
      columns: [
        { label: 'Номер задачи', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 120px' },
        { label: 'Описание', name: 'text', field: 'text', align: 'left', headerStyle: 'max-width: 450px; white-space: normal' },
        { label: 'Адрес', name: 'address', field: 'address', align: 'left', style: 'max-width: 450px; white-space: normal' },
        { label: 'Статус', name: 'stat', field: 'stat', align: 'left', style: 'max-width: 150px; white-space: normal' }
      ],
      data: []
    }
  }
}
</script>
