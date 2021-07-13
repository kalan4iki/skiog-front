<template>
  <q-dialog v-bind:value='value' v-on:show="shows" v-on:hide="$emit('input', false)">
    <q-layout view="hHh lpR fFf" container class="bg-white" style="max-width: 800px; height: 710px">
      <q-header class="bg-indigo">
        <q-toolbar>
          <q-btn flat v-close-popup round dense icon="keyboard_backspace" />
          <q-btn flat round dense icon="close" @click="closeall" />
          <q-toolbar-title>Обновление статуса обращению</q-toolbar-title>
          <q-btn flat label="Отправить" @click="submit" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding>
          <div class="row">
            <div class="col-12 col-sm-12 col-md-12 q-pb-md">
              <q-input
                v-model="form.text"
                label='Комментарий'
                square
                outlined
                rows="4"
                type="textarea"
              />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pb-md">
              <q-input
                v-model="form.nomkom"
                label='Номер комиссии'
                square
                outlined
              />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pb-md">
              <q-file
                v-model="form.files"
                label="Выбрать файлы"
                square
                outlined
                multiple
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pb-md">
              <q-select v-model="form.newstatus" square outlined :options="statoptions" option-label='text' model-value="value" label="Новый статус" />
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'Addmessage',
  props: { value: Boolean, statoptions: Array, pk: String },
  methods: {
    closeall: function () {
      this.$emit('closeall')
      this.$emit('input', false)
    },
    close: function () {
      this.$emit('input', false)
    },
    shows: function () {
      this.form.newstatus = this.statoptions[0]
    },
    submit: function () {
      if (this.form.files != null) {
        const formData = new FormData()
        for (let i = 0; i < this.form.files.length; i++) {
          const file = this.form.files[i]
          formData.append('files[' + i + ']', file)
        }
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        if (this.form.nomkom) {
          formData.append('nomkom', this.form.nomkom)
        }
        formData.append('pk', this.pk)
        formData.append('text', this.form.text)
        formData.append('status', this.form.newstatus.value)
        this.$axios
          .post('block/addresult/', formData, config)
          .then(response => {
            this.form = { text: '', nomkom: '', newstatus: '', files: [] }
            this.$q.notify({
              color: 'green',
              message: response.data.text
            })
            this.close()
            this.$emit('refresh')
          })
          .catch(error => {
            console.log(error)
            this.$q.notify({
              type: 'negative',
              message: `${error.response.data.text}`
            })
          })
      } else {
        const formData = new URLSearchParams()
        if (this.form.nomkom) {
          formData.append('nomkom', this.form.nomkom)
        }
        formData.append('pk', this.pk)
        formData.append('text', this.form.text)
        formData.append('status', this.form.newstatus.value)
        this.$axios
          .post('block/addresult/', formData)
          .then(response => {
            this.form = { text: '', nomkom: '', newstatus: '', files: [] }
            this.$q.notify({
              color: 'green',
              message: response.data.text
            })
            this.close()
            this.$emit('refresh')
          })
          .catch(error => {
            this.$q.notify({
              type: 'negative',
              message: `${error.response.data.text}`
            })
          })
      }
    }
  },
  data () {
    return {
      form: { text: '', nomkom: '', newstatus: '', files: [] }
    }
  }
}
</script>
