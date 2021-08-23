<template>
  <div>
    <q-dialog v-bind:value='value' v-on:hide="$emit('input', false)">
      <q-layout view="hHh lpR fFf" container class="bg-white" style="max-width: 800px; height: 710px">
        <q-header class="bg-indigo">
          <q-toolbar>
            <q-btn flat v-close-popup round dense icon="close" />
            <q-toolbar-title @contextmenu="copyobr">Обращение №{{ obr.nomd }}</q-toolbar-title>
            <a target="_blank" :href="'https://vmeste.mosreg.ru/CardInNewPage?show=/Topic?id=' + obr.nomd" style="text-decoration: none; color: white;">
              <q-btn flat dense label="Добродел" />
            </a>
            <q-btn flat dense label="Сменить статус" @click="viewsmen" />
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page padding>
            <div class="row items-center">
              <div v-if='obr.times' class="col-12 col-sm-12 col-md-12 q-pb-md q-pl-xs q-pr-xs">
                <q-banner inline-actions rounded class="bg-orange text-white">
                  <p>48 часов с момента отклонения не прошло!</p>
                  <p>Осталось <strong>{{ obr.times.hour }}</strong> часов, <strong>{{ obr.times.minute }}</strong> минут, <strong>{{ obr.times.second }}</strong> секунд.</p>
                </q-banner>
              </div>
              <div class="col-12 col-sm-12 col-md-12 q-pb-md q-pl-xs q-pr-xs">
                <q-input
                  :value="obr.last_text"
                  label='Последний комментарий'
                  square
                  outlined
                  readonly
                  rows="4"
                  type="textarea"
                />
              </div>
              <div class="col-12 col-sm-12 col-md-12 q-pb-md q-pl-xs q-pr-xs">
                <q-input
                  :value="obr.text"
                  label='Начальный комментарий'
                  square
                  outlined
                  readonly
                  rows="4"
                  type="textarea"
                />
              </div>
              <div class="col-12 col-sm-12 col-md-6 q-pb-md q-pl-xs q-pr-xs">
                <q-input
                  :value="obr.datecre"
                  label='Дата создания'
                  square
                  outlined
                  readonly
                />
              </div>
              <div class="col-12 col-sm-12 col-md-6 q-pb-md q-pl-xs q-pr-xs">
                <q-input
                  :value="obr.datebzm"
                  label='Дата изменения'
                  outlined
                  readonly
                />
              </div>
              <div class="col-12 col-sm-12 col-md-6 q-pb-md q-pl-xs q-pr-xs">
                <q-input
                  :value="obr.user"
                  label='Пользователь'
                  square
                  outlined
                  readonly
                />
              </div>
              <div class="col-12 col-sm-12 col-md-6 q-pb-md q-pl-xs q-pr-xs">
                <q-input
                  :value="obr.status"
                  label='Статус обращения'
                  square
                  outlined
                  readonly
                />
              </div>
              <div class="col-12 col-sm-6 col-md-6 q-pb-md q-pl-xs q-pr-xs">
                <q-btn class="full-width" @click="down_files" :disable='!obr.message || !obr.files_message' color="indigo" label="Скачать файлы" />
              </div>
              <div class="col-12 col-sm-6 col-md-6 q-pb-md q-pl-xs q-pr-xs">
                <q-btn class="full-width" :disable='!obr.message' color="indigo" @click="dialogs.viewmes = true" label="Сообщения" />
              </div>
              <div class="col-12 col-sm-12 col-md-12 q-pb-md q-pl-xs q-pr-xs">
                <q-banner class="bg-warning text-black" v-if="obr.files_message">
                  <template v-slot:avatar>
                    <q-icon name="warning" color="white" />
                  </template>
                  <div class="text-h6">Внимание!</div>
                  Есть файлы в сообщениях, нажмите "скачать файлы".
                </q-banner>
              </div>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
    <AddmessageVue v-model="dialogs.addmessage" @refresh="$emit('refresh')" :pk="obr.nomd" :statoptions='statoptions' @closeall='close' />
    <ViewmessVue v-model="dialogs.viewmes" :task="obr" @closeall='close' />
  </div>
</template>

<script>
import AddmessageVue from './Addmessage.vue'
import ViewmessVue from './Viewmess.vue'
import fileDownload from 'js-file-download'

export default {
  name: 'Viewobr',
  props: { value: Boolean, obr: Object },
  components: { AddmessageVue, ViewmessVue },
  data () {
    return {
      dialogs: {
        addmessage: false,
        viewmes: false
      },
      loading: true,
      task: {
        last_text: '',
        text: '',
        nomd: '',
        pk: '',
        status: '',
        datecre: '',
        datebzm: '',
        image: false,
        message: false,
        files_message: false,
        times: null
      },
      statoptions: []
    }
  },
  computed: {
  },
  methods: {
    down_files: function () {
      this.$axios({ method: 'GET', url: 'block/downimage_new/' + this.obr.nomd, responseType: 'blob' })
        .then((response) => {
          fileDownload(response.data, `block-${this.obr.nomd}.zip`)
        })
    },
    close: function () {
      this.$emit('input', false)
    },
    viewsmen: function () {
      this.dialogs.addmessage = true
    },
    copyobr: function (event) {
      event.preventDefault()
      navigator.clipboard.writeText(this.obr.nomd)
    }
  },
  mounted () {
    const params = new URLSearchParams()
    params.append('pk', this.obr.nomd)
    this.$axios
      .post('block/control/', params)
      .then(response => {
        this.statoptions = response.data.status
      })
  }
}
</script>
