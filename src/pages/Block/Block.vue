<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <div class="row justify-between">
      <div class="col-12 col-sm-1 col-md-3 q-pr-md ">
        <div class="column">
          <div class="col q-pb-lg">
            <q-form @submit="search_obr">
            <q-input
              class=""
              square
              outlined
              label='Поиск'
              v-model="searchnom"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search_obr"/>
              </template>
            </q-input>
            </q-form>
          </div>
          <div class="col q-pb-lg">
            <q-btn class="full-width" color="indigo-6" icon="add" label="Добавить" @click="dialogs.add = true"/>
          </div>
          <div class="col q-pb-lg">
            <q-btn class="full-width" color="indigo-6" icon="refresh" label="Обновить таблицу" @click="get_table" />
          </div>
          <div class="col q-pb-lg">
            <q-tabs
              v-model="tab"
              vertical
              dense
              class="shadow-3 bg-indigo-6 text-white"
            >
              <q-tab v-for='(cat, index) in category' :key="cat.nom" :name='index' :icon='cat.icon' :label='cat.text' />
            </q-tabs>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-1 col-md-9">
        <q-card>
          <q-card-section>
            <div class="row items-center">
              <div class="col-12 col-sm-3 col-md-3">
                 <div class="text-h6">{{ category[tab]['text'] }}</div>
              </div>
              <div class="col-12 col-sm-9 col-md-6">
                <q-input
                    v-model="search"
                    square
                    outlined
                    label='Поиск по таблице'
                  >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-2 col-md-3" align="right">
                <q-toggle
                  v-model="me"
                  color="red"
                  label="Смотреть свои"
                  left-label
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-table
              :data="data"
              :columns="columns"
              row-key="nomdobr"
              bordered
              :pagination.sync="initialPagination"
              @request="load_page"
              :filter="search"
              :loading='loading'
              separator='cell'
              @row-click='search_obr'
              @row-contextmenu='copyobr'
            >
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <ViewobrVue v-model="dialogs.view" :obr='task' @refresh="get_table" />
    <AddobrVue v-model="dialogs.add" @refresh="get_table" />
    <Delobr v-model="dialogs.delobr" :pk="delpk" />
  </q-page>
</template>

<script>
import Delobr from 'components/Dialogs/Block/Delobr.vue'
import ViewobrVue from 'components/Dialogs/Block/Viewobr.vue'
import AddobrVue from 'components/Dialogs/Block/Addobr.vue'

export default {
  name: 'BlockMain',
  components: { ViewobrVue, AddobrVue, Delobr },
  data () {
    return {
      dialogs: {
        view: false,
        add: false,
        delobr: false
      },
      me: false,
      category: [
        {
          icon: 'settings_input_antenna',
          color: 'green',
          text: 'На согласовании',
          nom: '4'
        },
        {
          icon: 'work',
          color: 'deep-orange',
          text: 'В работе',
          nom: '0'
        },
        {
          icon: 'textsms',
          color: 'deep-purple lighten-3',
          text: 'На блокировке',
          nom: '1'
        },
        {
          icon: 'close',
          color: 'black',
          text: 'Закрытые',
          nom: '2'
        },
        {
          icon: 'block',
          color: 'red',
          text: 'Отклоненные',
          nom: '3'
        }
      ],
      tab: 0,
      columns: [
        { label: 'ID', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 70px' },
        { label: 'Номер обращения', name: 'nomdobr', field: 'nomdobr', align: 'left', headerStyle: 'width: 160px; white-space: normal' },
        { label: 'Дата создания', name: 'datecre', field: 'datecre', align: 'center', style: 'width: 140px; white-space: normal' },
        { label: 'Статус', name: 'status', field: 'status', align: 'left', style: 'width: 150px; white-space: normal' },
        { label: 'Пользователь', name: 'user', field: 'user', align: 'left', style: 'width: 140px; white-space: normal' },
        { label: 'Модератор', name: 'usermoder', field: 'usermoder', align: 'left', style: 'width: 140px; white-space: normal' },
        { label: 'Комментарий', name: 'text', field: 'text', align: 'left', style: 'max-width: 150px; white-space: normal' }
      ],
      data: [],
      loading: true,
      search: '',
      searchnom: '',
      task: {
        last_text: '',
        text: '',
        nomdobr: '',
        pk: '',
        status: '',
        datecre: '',
        datebzm: '',
        image: false,
        message: false,
        times: null
      },
      delpk: null,
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 10
      }
    }
  },
  methods: {
    load_page: function (event) {
      this.initialPagination.page = event.pagination.page
      this.initialPagination.sortBy = event.pagination.sortBy
      if (event.pagination.rowsPerPage === 0) {
        this.initialPagination.rowsPerPage = event.pagination.rowsNumber
      } else {
        this.initialPagination.rowsPerPage = event.pagination.rowsPerPage
      }
      this.get_table()
    },
    get_table: function () {
      this.loading = true
      this.data = []
      const params = new URLSearchParams()
      params.append('status', 'status-' + this.category[this.tab].nom)
      params.append('selectme', this.me)
      params.append('page', this.initialPagination.page)
      params.append('page_size', this.initialPagination.rowsPerPage)
      if (this.initialPagination.sortBy) {
        params.append('ordering', this.initialPagination.sortBy)
      }
      this.$axios({ methods: 'GET', url: 'block/view/table/', params })
        .then(response => {
          this.data = response.data.results.data
          this.initialPagination.rowsNumber = response.data.count
          this.loading = false
        })
        .catch(error => {
          this.$q.notify({
            type: 'negative',
            message: `Ошибка №${error.response.status}. Текст ошибки: ${error.response.data.error}`
          })
        })
    },
    search_obr: function (event, row) {
      event.preventDefault()
      const params = new URLSearchParams()
      if (row) {
        params.append('pk', row.nomdobr)
      } else {
        params.append('pk', this.searchnom)
      }
      this.$axios
        .post('block/obr_view/', params)
        .then(response => {
          if (response.data.status === 'error') {
            this.$q.notify({
              type: 'negative',
              message: `Текст ошибки: ${response.data.text}`
            })
          } else {
            this.task = response.data.app
            this.dialogs.view = true
          }
        })
    },
    copyobr: function (event, row) {
      event.preventDefault()
      if (this.$init_perm({ type: 'block', name: 'superuser' })) {
        this.delpk = row.pk
        this.dialogs.delobr = true
      } else {
        navigator.clipboard.writeText(row.nomdobr)
      }
    }
  },
  watch: {
    tab: function (newTab, oldTab) {
      this.initialPagination = {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 10
      }
      this.get_table()
    },
    me: function (newSelect) {
      localStorage.block_selectMe = newSelect
      this.get_table()
    }
  },
  mounted () {
    if (localStorage.block_selectMe) {
      this.me = localStorage.block_selectMe === 'true'
    }
    this.get_table()
  }
}
</script>
