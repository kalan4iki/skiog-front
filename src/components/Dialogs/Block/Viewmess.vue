<template>
  <q-dialog v-bind:value='value' v-on:hide="close" @show="viewmes">
    <q-layout view="hHh lpR fFf" container class="bg-white" style="max-width: 800px; height: 710px">
      <q-header class="bg-indigo">
        <q-toolbar>
          <q-btn flat round dense icon="keyboard_backspace" @click="close" />
          <q-btn flat round dense icon="close" @click="closeall" />
          <q-toolbar-title>Сообщения по обращению</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding>
          <q-table
            :data="data"
            :columns="columns"
            row-key="nomdobr"
            :pagination="initialPagination"
            bordered
            :loading='loading'
            separator='cell'
          >
          </q-table>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'Viewmess',
  props: { value: Boolean, task: Object },
  methods: {
    closeall: function () {
      this.$emit('closeall')
      this.$emit('input', false)
    },
    close: function () {
      this.data = []
      this.$emit('input', false)
    },
    viewmes: function () {
      this.loading = true
      const params = new URLSearchParams()
      params.append('pk', this.task.nomd)
      this.$axios
        .post('block/view_message/', params)
        .then(response => {
          this.data = response.data.message
          this.loading = false
        })
    }
  },
  data () {
    return {
      columns: [
        { label: 'ID', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 3%' },
        { label: 'Номер комиссии', name: 'nomkom', field: 'nomkom', align: 'center', headerStyle: 'width: 10%; white-space: normal' },
        { label: 'Дата создания', name: 'datecre', field: 'datecre', align: 'center', style: 'width: 10%; white-space: normal' },
        { label: 'Статус', name: 'status', field: 'status', align: 'center', style: 'width: 10%; white-space: normal' },
        { label: 'Пользователь', name: 'user', field: 'user', align: 'center', style: 'width: 10%; white-space: normal' },
        { label: 'Комментарий', name: 'text', field: 'text', align: 'left', style: 'max-width: 57%; white-space: normal' }
      ],
      loading: true,
      data: [],
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10
      }
    }
  }
}
</script>
