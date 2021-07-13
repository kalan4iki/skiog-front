<template>
  <div>
    <q-btn @click="dialogs = true">Создать</q-btn>
    <q-dialog v-model="dialogs">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="text-center bg-grey-8 text-white">
          <div class="text-h6">Создание задачи</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
                <q-input
                  v-model="task.address"
                  square
                  outlined
                  label='Адрес'
                />
            </div>
            <q-separator />
            <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
                <q-input
                  v-model="task.text"
                  square
                  outlined
                  label='Описание'
                  rows="2"
                  type="textarea"
                />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
                <q-select v-model='task.template' :options="temp_items" square outlined option-label='text' model-value="pk" label="Шаблон" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-space />
          <q-btn flat @click="dialogs = false">Закрыть</q-btn>
          <q-btn flat>Создать</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Task_add',
  data () {
    return {
      dialogs: false,
      temp_items: [],
      task: { address: '', text: '', template: [] }
    }
  },
  mounted () {
    this.$axios({ url: 'imu/templates/' })
      .then((response) => {
        this.temp_items = response.data
      })
  }
}
</script>
