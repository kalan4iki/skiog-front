<template>
  <q-dialog v-bind:value='value' v-on:hide="close" transition-show="slide-left" transition-hide="jump-left">
    <q-card style="width: 700px; max-width: 1500px;">
      <q-card-section><div class="text-h6">Отчет по организации</div></q-card-section>
      <q-card-section>
        <div class="row items-center">
          <div class="col-12 col-sm-8 col-md-8">
            <q-select v-model="selection" :options="orgs" label="Выберите организацию" />
          </div>
          <div class="col-12 col-sm-4 col-md-4 text-center">
            <q-btn @click="request_data" label="Запросить" />
          </div>
          <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
            <q-input  label='Дата создания обращения от' v-model="per.from" mask="####-##-##">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="per.from" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
            <q-input  label='Дата создания обращения до' v-model="per.to" mask="####-##-##">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="per.to" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Закрыть" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <q-table
          :data="data"
          :columns="columns"
          dense
          row-key="nomdobr"
          :pagination="initialPagination"
          bordered
          :loading='load'
          separator='cell'
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for='column in columns' :key="column.name" :props="props" class="word-wrap: break-word;">
                <div v-if='column.name == "text"'>
                  <q-btn size='sm' color="black" flat icon="message">
                    <q-tooltip
                      anchor="bottom left"
                      class="bg-black"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <b>{{ props.row[column.name] }}</b>
                    </q-tooltip>
                  </q-btn>
                </div>
                <div v-else style="">
                  {{ props.row[column.name] }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup label="Закрыть" />
        <q-btn label="Скачать" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'Org',
  props: ['value'],
  methods: {
    close: function () {
      this.to_value = null
      this.$emit('input', false)
    },
    request_data: function () {
      if (this.selection) {
        this.load = true
        const data = new FormData()
        data.append('action', '12')
        data.append('org', this.selection.value)
        data.append('datefrom', this.per.from)
        data.append('datebefore', this.per.to)
        this.$axios({ method: 'POST', url: 'dashboard/problem', data: data })
          .then((response) => {
            this.load = false
            this.data = response.data.content.data
          })
      }
    }
  },
  mounted () {
    this.$axios({ method: 'GET', url: 'view/org/' })
      .then((response) => {
        this.orgs = response.data
      })
  },
  data () {
    return {
      per: { from: null, to: null },
      data: [],
      load: false,
      orgs: null,
      selection: null,
      columns: [
        { label: 'Номер добродела', name: 'nomdobr', field: 'nomdobr', align: 'center', headerStyle: 'width: 110px' },
        { label: 'Дата ответа по доброделу', name: 'dateotv', field: 'dateotv', align: 'center', headerStyle: 'width: 120px', sortable: true },
        { label: 'Адрес', name: 'adres', field: 'adres', align: 'left', style: 'max-width: 450px; white-space: normal' },
        { label: 'Тематика', name: 'temat__name', field: 'temat__name', align: 'left', style: 'max-width: 150px; white-space: normal', sortable: true },
        { label: 'Подкатегория', name: 'podcat__name', field: 'podcat__name', align: 'left', style: 'max-width: 200px; white-space: normal', sortable: true },
        { label: 'Статус в доброделе', name: 'status__name', align: 'left', field: 'status__name', style: 'max-width: 100px; white-space: normal' },
        { label: 'Текст', name: 'text', field: 'text', align: 'left' }
      ],
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 15
        // rowsNumber: xx if getting data from a server
      }
    }
  }
}
</script>
