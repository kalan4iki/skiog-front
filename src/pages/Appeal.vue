<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <div class="row">
      <div class="col">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-12 col-md-4">
                <div class="text-h6">{{ title }}</div>
              </div>
              <div class="col-12 col-sm-12 col-md-8 text-right">
              <q-btn-group>
                <q-btn-dropdown icon="visibility">
                  <q-list>
                    <q-item clickable v-close-popup :active="!model_grid" @click="grid_change(false)" >
                      <q-item-section avatar>
                        <q-avatar icon="toc" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Режим таблицы</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup :active="model_grid" @click="grid_change(true)" >
                      <q-item-section avatar>
                        <q-avatar icon="apps" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Режим карточек</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn v-show="false" flat icon="bug_report" @click="initialPagination.rowsNumber += 50">
                  <q-tooltip>
                    Тестовая кнопочка
                  </q-tooltip>
                </q-btn>
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
            </div>
          </q-card-section>
          <q-card-section>
            <q-table
              :grid='model_grid'
              :data="data"
              :columns="columns"
              dense
              row-key="nomdobr"
              :pagination.sync="initialPagination"
              bordered
              :loading='load'
              separator='cell'
              @request="test_pag"
              binary-state-sort
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
                      <q-item clickable v-close-popup>
                        <a class="text-black" :href="'https://vmeste.mosreg.ru/CardInNewPage?show=/Topic?id=' + props.row.nomdobr" target="_blank" style="text-decoration: none;">Перейти на добродел</a>
                        <!-- <q-item-section>Перейти на добродел</q-item-section> -->
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
              <q-select v-model="dialogs_data.filt.temat" square outlined :options="filter_data.cat" option-value='pk' option-label="name" label="Тематика" emit-value />
            </div>
            <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="dialogs_data.filt.status" square outlined :options="filter_data.status" option-value='pk' option-label="name" label="Статус в доброделе" emit-value />
            </div>
            <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="dialogs_data.filt.ciogv" square outlined :options="filter_data.to" option-value='pk' option-label="name" label="Тер. Управление" emit-value />
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

// import { openURL } from 'quasar'
export default {
  name: 'Appeal',
  components: { Tyapp, Fact },
  data () {
    return {
      columns: [
        { label: 'ID в системе', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 100px' },
        { label: 'Номер добродела', name: 'nomdobr', field: 'nomdobr', align: 'center', headerStyle: 'width: 110px' },
        { label: 'Дата ответа по доброделу', name: 'dateotv', field: 'dateotv', align: 'center', headerStyle: 'width: 120px', sortable: true },
        { label: 'Адрес', name: 'adres', field: 'adres', align: 'left', style: 'max-width: 450px; white-space: normal' },
        { label: 'Тематика', name: 'temat', field: 'temat', align: 'left', style: 'max-width: 150px; white-space: normal', sortable: true },
        { label: 'Подкатегория', name: 'podcat', field: 'podcat', align: 'left', style: 'max-width: 200px; white-space: normal', sortable: true },
        { label: 'Статус в доброделе', name: 'status', align: 'left', field: 'status', style: 'max-width: 100px; white-space: normal' },
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
        rowsPerPage: 15,
        rowsNumber: 10
      },
      inputTO: null,
      url: '',
      inputfact: null,
      pagesNumber: 1,
      model_grid: false
    }
  },
  computed: {
  },
  watch: {
    $route (to, from) {
      this.load_table(to.params.action)
    }
  },
  methods: {
    grid_change: function (ed) {
      this.model_grid = ed
      localStorage.appeal_grid = ed
    },
    test_pag: function (event) {
      this.initialPagination.page = event.pagination.page
      this.initialPagination.sortBy = event.pagination.sortBy
      if (event.pagination.rowsPerPage === 0) {
        this.initialPagination.rowsPerPage = event.pagination.rowsNumber
      } else {
        this.initialPagination.rowsPerPage = event.pagination.rowsPerPage
      }
      this.filter_met()
      this.load_table()
    },
    open_page: function (urls) {
      window.open(urls, '_blank')
      window.focus()
      // openURL(urls, '_blank', { noreferrer: false })
    },
    clear_filt: function () {
      this.initialPagination.page = 1
      this.initialPagination.rowsPerPage = 15
      this.dialogs_data.filt = { temat: null, status: null, ciogv: null }
      this.$router.replace({ name: 'appeal', params: { action: this.$route.params.action } })
      this.load_table()
    },
    filter_met: function () {
      const params = {}
      for (const fil in this.dialogs_data.filt) {
        if (this.dialogs_data.filt[fil]) {
          params[fil] = this.dialogs_data.filt[fil]
        }
      }
      params.page = this.initialPagination.page
      params.page_size = this.initialPagination.rowsPerPage
      if (this.initialPagination.sortBy) {
        params.ordering = this.initialPagination.sortBy
      }
      this.$router.replace({ name: 'appeal', params: { action: this.$route.params.action }, query: params })
    },
    get_data: function (action) {
      let url
      const data = new URLSearchParams()
      // const data = new FormData()
      if (action == null) {
        url = this.$route.params.action
      } else if (action.type === 'click') {
        url = this.$route.params.action
      } else {
        url = action
      }
      data.append('action', url)
      // data.append('page', this.initialPagination.page)
      for (const fil in this.$route.query) {
        if (this.$route.query[fil]) {
          data.append(fil, this.$route.query[fil])
        }
      }
      if (!data.get('page_size')) {
        data.append('page_size', this.initialPagination.rowsPerPage)
      }
      return data
    },
    load_table: function (action) {
      this.load = true
      const data = this.get_data()
      this.$axios({ method: 'GET', url: 'view/allproblem/', params: data })
        .then(response => {
          this.data = response.data.results.data
          this.initialPagination.rowsNumber = response.data.count
          this.title = response.data.results.title
          this.load = false
        })
    },
    load_filter: function () {
      const datafilt = this.get_data()
      datafilt.append('type', 'filter')
      this.$axios({ method: 'GET', url: 'view/allproblem/', params: datafilt })
        .then(response => {
          this.filter_data.cat = response.data.temat
          this.filter_data.status = response.data.status
          this.filter_data.to = response.data.ciogv
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
    if (localStorage.appeal_grid) {
      this.model_grid = localStorage.appeal_grid === 'true'
    }
    if ('page' in this.$route.query) {
      this.initialPagination.page = this.$route.query.page
    }
    if ('page_size' in this.$route.query) {
      this.initialPagination.rowsPerPage = this.$route.query.page_size
    }
    this.url = this.$route.params.action
    this.load_table()
    this.load_filter()
    this.get_to()
  }
}
</script>
