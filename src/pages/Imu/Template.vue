<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="row">
              <div class="col">
                <div class="text-h6">Шаблоны</div>
              </div>
              <div class="col" style="text-align: right;">
                <!-- <q-btn @click="dialog_create = true">Создать</q-btn> -->
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-table
              :data="data"
              :columns="columns"
              row-key="nom"
              :pagination="initialPagination"
              bordered
              :loading='loading'
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
  name: 'Template',
  data () {
    return {
      columns: [
        { label: 'Номер шаблона', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 150px' },
        { label: 'Название', name: 'text', field: 'text', align: 'left', headerStyle: 'max-width: 450px; white-space: normal' }
      ],
      data: [],
      loading: true,
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 15
        // rowsNumber: xx if getting data from a server
      }
    }
  },
  mounted () {
    this.$axios({ url: 'imu/templates/' })
      .then((response) => {
        this.loading = false
        this.data = response.data
      })
  }
}
</script>
