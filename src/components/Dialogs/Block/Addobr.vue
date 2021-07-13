<template>
  <q-dialog v-bind:value='value' v-on:hide="$emit('input', false)">
    <q-layout view="hHh lpR fFf" container class="bg-white" style="max-width: 800px; height: 500px">
      <q-header class="bg-indigo">
        <q-toolbar>
          <q-btn flat v-close-popup round icon="close" />
          <q-toolbar-title>Добавление на блокировку</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-form @submit="submit">
        <q-page-container>
          <q-page padding>
            <q-form @submit="submit">
              <div class="row">
                <div class="col-12 col-sm-12 col-md-12 q-pb-md">
                  <q-input
                    v-model="task.nomd"
                    label='Номер обращения'
                    type="number"
                    :rules="[ val => val && val.length > 0 || 'Пожалуйста, напишите что-нибудь']"
                    square
                    outlined
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-12 q-pb-md">
                  <q-input
                    v-model="task.text"
                    label='Комментарий'
                    square
                    outlined
                    rows="4"
                    type="textarea"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-12">
                  <q-file
                    v-model="task.files"
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
              </div>
            </q-form>
          </q-page>
        </q-page-container>
        <q-footer elevated class="bg-indigo-8 text-white">
          <q-toolbar>
            <q-space />
            <q-btn flat type="submit" label="Отправить" />
          </q-toolbar>
        </q-footer>
      </q-form>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'Addobr',
  props: ['value'],
  methods: {
    submit: function (event) {
      event.preventDefault()
      if (this.task.files != null) {
        const formData = new FormData()
        for (let i = 0; i < this.task.files.length; i++) {
          const file = this.task.files[i]
          formData.append('files[' + i + ']', file)
        }
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        formData.append('nomdobr', this.task.nomd)
        formData.append('text', this.task.text)
        this.$axios
          .post('block/createblock/', formData, config)
          .then(response => {
            this.task = { nomd: null, text: null, file: null }
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
      } else {
        const formData = new URLSearchParams()
        formData.append('nomdobr', this.task.nomd)
        formData.append('text', this.task.text)
        this.$axios
          .post('block/createblock/', formData)
          .then(response => {
            this.task = { nomd: null, text: null, file: null }
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
    },
    close: function () {
      this.$emit('input', false)
    }
  },
  data () {
    return {
      accept: false,
      task: {
        text: '',
        nomd: '',
        files: []
      }
    }
  },
  mounted () {
  }
}
</script>
