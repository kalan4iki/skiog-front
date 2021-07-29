<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <div class="row">
      <div class="col">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="row">
              <div class="col-4">
                <div class="text-h6">{{ title }}</div>
              </div>
              <q-space />
              <q-btn-group>
                <q-btn flat icon="clear" @click="clear_filt">
                  <q-tooltip>
                    Сбросить фильтр
                  </q-tooltip>
                </q-btn>
                <q-btn flat icon="filter_alt" @click="dialogs.filt = true">
                  <q-tooltip>
                    Фильтрация
                  </q-tooltip>
                </q-btn>
                <q-btn flat icon="refresh" @click="load_table">
                  <q-tooltip>
                    Обновить таблицу
                  </q-tooltip>
                </q-btn>
                <q-btn flat icon="file_upload" @click="exports_table">
                  <q-tooltip>
                    Выгрузить
                  </q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>
          </q-card-section>
          <q-card-section>
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
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <b>{{ props.row[column.name] }}</b>
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div v-else-if="column.name == 'nomdobr'">
                      <q-btn flat :to="`/obr/${props.row[column.name]}`" color="blue">{{ props.row[column.name] }}</q-btn>
                    </div>
                    <div v-else-if="column.name == 'pk'">
                      <q-btn flat :to="`/obr/${props.row.nomdobr}`" color="blue">{{ props.row[column.name] }}</q-btn>
                    </div>
                    <div v-else-if="column.name == 'chats'">
                      <div v-if='props.row[column.name]'><q-icon name="done" color="positive" size='md'/></div>
                      <div v-else><q-icon name="close" class="text-red" size='md'/></div>
                    </div>
                    <div v-else style="">
                      {{ props.row[column.name] }}
                    </div>
                  </q-td>
                  <q-menu
                    context-menu
                  >
                    <q-list dense style="min-width: 100px">
                      <q-item clickable v-close-popup @click="copy(props.row.nomdobr)">
                        <q-item-section>Скопировать номер</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="opendialogto(props.row.pk)">
                        <q-item-section>Назначить ТО</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="opendialogfact(props.row.pk)">
                        <q-item-section>Добавить факт</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="open_page('https://vmeste.mosreg.ru/CardInNewPage?show=/Topic?id=' + props.row.nomdobr)">
                        <q-item-section>Перейти на добродел</q-item-section>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </q-menu>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="dialogs.filt" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">
            Фильтрация
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="dialogs_data.filt.temat" square outlined :options="filter_data.cat" option-value='pk' option-label="name" label="Тематика" />
            </div>
            <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="dialogs_data.filt.status" square outlined :options="filter_data.status" option-value='pk' option-label="name" label="Статус в доброделе" />
            </div>
            <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="dialogs_data.filt.ciogv" square outlined :options="filter_data.to" option-value='pk' option-label="name" label="Тер. Управление" />
            </div>
            <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-input v-model="dialogs_data.filt.dateotv" square outlined label='Дата ответа по доброделу' mask="##.##.####">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="dialogs_data.filt.dateotv" mask="DD.MM.YYYY">
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
        </q-card-section>
        <q-card-actions>
          <q-space />
          <q-btn v-close-popup>Закрыть</q-btn>
          <q-btn @click="filter_met">Применить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Tyapp v-model="dialogs.to" :pk="inputTO" @refresh='load_table'/>
    <Fact v-model="dialogs.fact" :pk="inputfact" />
  </q-page>
</template>

<script>
import Tyapp from 'components/Dialogs/Appl/Ty_app.vue'
import Fact from 'components/Dialogs/Appl/Fact.vue'
import fileDownload from 'js-file-download'
import { openURL } from 'quasar'
export default {
  name: 'Appeal',
  components: { Tyapp, Fact },
  data () {
    return {
      columns: [
        { label: 'ID в системе', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 100px' },
        { label: 'Номер добродела', name: 'nomdobr', field: 'nomdobr', align: 'center', headerStyle: 'width: 110px' },
        { label: 'Дата ответа по доброделу', name: 'dateotv', field: 'dateotv', align: 'center', headerStyle: 'width: 120px' },
        { label: 'Адрес', name: 'adres', field: 'adres', align: 'left', style: 'max-width: 450px; white-space: normal' },
        { label: 'Тематика', name: 'temat__name', field: 'temat__name', align: 'left', style: 'max-width: 150px; white-space: normal' },
        { label: 'Подкатегория', name: 'podcat__name', field: 'podcat__name', align: 'left', style: 'max-width: 200px; white-space: normal' },
        { label: 'Статус в доброделе', name: 'status__name', align: 'left', field: 'status__name', style: 'max-width: 100px; white-space: normal' },
        { label: 'Текст', name: 'text', field: 'text', align: 'left' },
        { label: 'Сообщения', name: 'chats', field: 'chats', align: 'center', sortable: false }
      ],
      data: [
      ],
      date_rul: v => /^-?[\d]+-[0-1]\d-[0-3]\d$/.test(v),
      dialogs: {
        filt: false,
        to: false,
        fact: false
      },
      filter_data: {
        cat: null,
        status: null,
        to: null
      },
      deps: null,
      dialogs_data: {
        filt: {
          temat: null,
          status: null,
          ciogv: null,
          dateotv: null
        },
        to: {
          to: ''
        }
      },
      tos: [],
      load: true,
      title: '',
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 15
        // rowsNumber: xx if getting data from a server
      },
      inputTO: null,
      url: '',
      inputfact: null
    }
  },
  watch: {
    $route (to, from) {
      this.load_table(to.params.action)
    }
  },
  methods: {
    open_page: function (urls) {
      openURL(urls)
    },
    clear_filt: function () {
      this.dialogs_data.filt = { temat: null, status: null, ciogv: null }
      this.load_table()
    },
    filter_met: function () {
      this.load_table()
      this.dialogs.filt = false
    },
    load_table: function (action) {
      let url
      const data = new FormData()
      if (action == null) {
        url = this.$route.params.action
      } else if (action.type === 'click') {
        url = this.$route.params.action
      } else {
        url = action
      }
      for (const fil in this.dialogs_data.filt) {
        if (this.dialogs_data.filt[fil]) {
          if (this.dialogs_data.filt[fil].value) {
            data.append(fil, this.dialogs_data.filt[fil].value)
          } else {
            data.append(fil, this.dialogs_data.filt[fil])
          }
        }
      }
      this.load = true
      this.$axios({ method: 'POST', url: `/allproblem/${url}`, data: data })
        .then(response => {
          this.title = response.data.title
          this.data = response.data.list
          this.load = false
          this.filter_data.cat = response.data.filter.temat
          this.filter_data.status = response.data.filter.status
          this.filter_data.to = response.data.filter.ciogv
        })
    },
    exports_table: function () {
      this.load = true
      const url = this.$route.params.action
      const data = new FormData()
      data.append('_export', 'xlsx')
      this.$axios({ method: 'POST', url: `/allproblem/${url}`, responseType: 'blob', data: data })
        .then(response => {
          fileDownload(response.data, `export-${this.$route.params.action}.xlsx`)
          this.load = false
        })
    },
    copy: function (e) {
      navigator.clipboard.writeText(e)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Номер скопирован'
          })
        })
    },
    get_to: function () {
      this.$axios({ method: 'POST', url: '/getto/' })
        .then(response => {
          this.tos = response.data
        })
    },
    opendialogto: function (number) {
      this.inputTO = number
      this.dialogs.to = true
    },
    opendialogfact: function (number) {
      this.inputfact = number
      this.dialogs.fact = true
    }
  },
  mounted () {
    this.url = this.$route.params.action
    this.load_table()
    this.get_to()
  }
}
</script>
