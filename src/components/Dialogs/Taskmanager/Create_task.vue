<template>
  <q-dialog v-bind:value='value' v-on:hide="$emit('input', false)">
    <q-layout view="hHh lpR fFf" container class="bg-white" style="max-width: 800px; height: 500px">
      <q-header class="bg-indigo">
        <q-toolbar>
          <q-btn flat round dense icon="close" @click="close" />
          <q-toolbar-title>Создание задачи</q-toolbar-title>
          <q-btn flat label="Очистить" />
          <q-btn flat label="Создать" />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding>
          <div class="row items-center q-pb-md">
            <div class="col-12 col-sm-4 col-md-4 text-center text-h6">
              Заголовок задачи
            </div>
            <div class="col-12 col-sm-8 col-md-8">
              <q-input dense square outlined />
            </div>
          </div>
          <div class="row items-center q-pb-md">
            <div class="col-12 col-sm-4 col-md-4 text-center text-h6">
              Описание задачи
            </div>
            <div class="col-12 col-sm-8 col-md-8">
              <q-input type="textarea" dense square outlined />
            </div>
          </div>
          <div class="row items-center q-pb-md text-center">
            <div class="col-12 col-sm-4 col-md-4 q-pr-sm">
              Дней на исполнение
              <q-input dense type="number" square  />
            </div>
            <div class="col-12 col-sm-5 col-md-5 q-pr-sm">
              или дата исполнения задачи
              <q-input dense square type="date" outlined/>
            </div>
            <div class="col-12 col-sm-3 col-md-3 q-pr-sm">
              <p>Приоритет задачи</p>
              <q-rating
                size="3em"
                :max="3"
                icon="circle"
                icon-selected="radio_button_checked"
                color="primary"
              />
            </div>
          </div>
          <div class="row items-center q-pb-md">
            <div class="col-12 col-sm-4 col-md-4 text-center text-h6">
              Ответственный пользователь
            </div>
            <div class="col-12 col-sm-8 col-md-8">
              <q-input dense square outlined />
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'Create_task',
  props: { value: Boolean },
  data () {
    return {
      form: {}
    }
  },
  methods: {
    close: function () {
      this.$emit('input', false)
    }
  }
}
</script>
