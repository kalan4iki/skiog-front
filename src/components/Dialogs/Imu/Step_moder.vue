<template>
  <div>
    <q-btn @click="dialogs = true">{{ name }}</q-btn>
    <q-dialog v-model="dialogs">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="text-center bg-grey-8 text-white">
          <div class="text-h6">Модерация</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-select v-model="template" square outlined :options="temp_items" required option-label='text' model-value="pk" label="Шаблон" />
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-space />
          <q-btn @click="dialogs = false">Закрыть</q-btn>
          <q-btn @click="moderation">Отправить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Step_moder',
  props: ['name', 'task', 'step'],
  data () {
    return {
      dialogs: false,
      temp_items: [],
      template: []
    }
  },
  methods: {
    moderation: function () {
      const params = new URLSearchParams()
      params.append('task_pk', this.task.pk)
      if (this.step) {
        params.append('step_pk', this.step.pk)
      }
      params.append('template', this.template.pk)
      this.$axios({ url: 'imu/task/action/moderation/', params: params })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Модерация отправлена'
          })
          this.dialogs = false
          this.$emit('refresh')
        })
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
