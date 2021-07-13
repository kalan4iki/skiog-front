<template>
  <div>
    <q-btn @click="dialogs = true">{{ name }}</q-btn>
    <q-dialog v-model="dialogs">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="text-center bg-grey-8 text-white">
          <div class="text-h6">Согласование</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
              <q-input
                v-model="result.text"
                label='Описание'
                square
                outlined
                rows="3"
                type="textarea"
              />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="result.res" square outlined :options="res_items" option-label='name' model-value="pk" label="Результат" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-space />
          <q-btn @click="dialogs = false">Закрыть</q-btn>
          <q-btn @click="sogl">Отправить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Step_sogl',
  props: ['name', 'task', 'step'],
  data () {
    return {
      dialogs: false,
      result: { text: '', res: [] },
      res_items: [],
      template: []
    }
  },
  methods: {
    sogl: function () {
      const params = new URLSearchParams()
      params.append('task_pk', this.task.pk)
      if (this.step) {
        params.append('step_pk', this.step.pk)
      }
      params.append('text', this.result.text)
      params.append('result', this.result.res.pk)
      this.$axios({ url: 'imu/task/action/sogl/', params: params })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Согласование отправлено'
          })
          self.dialog = false
          this.$emit('refresh')
        })
    }
  },
  mounted () {
    const params = new URLSearchParams()
    params.append('type', 'sogl')
    this.$axios({ url: 'imu/step/results/', params: params })
      .then((response) => {
        console.log(response)
        this.res_items = response.data
      })
  }
}
</script>
