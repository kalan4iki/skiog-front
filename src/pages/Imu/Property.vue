<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="row">
              <div class="col">
                <div class="text-h6">Список</div>
              </div>
              <div class="col" style="text-align: right;">
                <Taskadd />
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
              :loading='loading'
              separator='cell'
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td v-for='column in columns' :key="column.name" :props="props" class="word-wrap: break-word;">
                    <div v-if="column.name == 'pk'">
                      <q-btn flat :to="`/imu/task/${props.row[column.name]}`" color="blue">{{ props.row[column.name] }}</q-btn>
                    </div>
                    <div v-else style="">
                      {{ props.row[column.name] }}
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import Taskadd from 'components/Dialogs/Imu/Task_add.vue'
export default {
  name: 'Property',
  components: { Taskadd },
  data () {
    return {
      columns: [
        { label: 'Номер задачи', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 120px' },
        { label: 'Описание', name: 'text', field: 'text', align: 'left', headerStyle: 'max-width: 450px; white-space: normal' },
        { label: 'Адрес', name: 'address', field: 'address', align: 'left', style: 'max-width: 450px; white-space: normal' },
        { label: 'Статус', name: 'stat', field: 'stat', align: 'left', style: 'max-width: 150px; white-space: normal' }
      ],
      data: [],
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 15
        // rowsNumber: xx if getting data from a server
      },
      dialog_create: false,
      loading: true
    }
  },
  mounted () {
    // let self = this
    this.$axios({ url: 'imu/tasks/' })
      .then((response) => {
        this.loading = false
        this.data = response.data
      })
  }
}
</script>
