<template>
  <div>
    <q-btn @click="dialogs = true">{{ name }}</q-btn>
    <q-dialog v-model="dialogs">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="text-center bg-grey-8 text-white">
          <div class="text-h6">Исполнение</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
              <q-input
                v-model="result.text"
                square
                outlined
                label='Описание'
                rows="3"
                type="textarea"
              />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="result.res" :options="res_items" square outlined option-label='name' model-value="pk" label="Результат" />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
              <q-file class="" multiple square outlined v-model="result.files" label="Вставить файлы">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-space />
          <q-btn @click="dialogs = false">Закрыть</q-btn>
          <q-btn>Отправить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Step_exec',
  props: ['name', 'task', 'step'],
  data () {
    return {
      dialogs: false,
      result: { text: '', res: [], files: [] },
      res_items: [],
      template: []
    }
  },
  mounted () {
    const params = new URLSearchParams()
    params.append('type', 'execution')
    this.$axios({ url: 'imu/step/results/', params: params })
      .then((response) => {
        this.res_items = response.data
      })
  }
}
</script>
