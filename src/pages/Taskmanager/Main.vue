<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <div class="row q-pl-xs q-pr-xs q-pb-md justify-between">
      <div class="col-12 col-sm-12 col-md-12 q-pb-sm" style="text-align: right; animation: fadeInDown; animation-duration: 1s;">
        <q-btn-group>
          <q-btn icon="add" @click="dialogs.create = true"><q-tooltip>Создать задачу</q-tooltip></q-btn>
          <q-btn-dropdown icon="remove_red_eye">
            <q-tooltip>Режимы отображения</q-tooltip>
            <q-list>
              <q-item clickable v-close-popup @click="type=0">
                <q-item-section avatar><q-avatar icon="toc" color="primary" text-color="white" /></q-item-section>
                <q-item-section>
                  Таблица
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="type=1">
                <q-item-section avatar><q-avatar icon="table_chart" color="secondary" text-color="white" /></q-item-section>
                <q-item-section>
                  Столбцы
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="type=2">
                <q-item-section avatar><q-avatar icon="assessment" color="primary" text-color="white" /></q-item-section>
                <q-item-section>
                  Диаграмма Ганта
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
      </div>
      <div v-show="type === 0" class="col-12 col-sm-12 col-md-12" style="animation: fadeIn; animation-duration: 1s;" >
        <q-card>
          <q-card-section><div class="text-h6">Список задач</div></q-card-section>
          <q-card-section></q-card-section>
        </q-card>
      </div>
      <div v-show="type === 1" class="col-12 col-sm-12 col-md-12" style="animation: fadeIn; animation-duration: 1s;" >
        <q-card>
          <q-card-section><div class="text-h6">Столбцы задач</div></q-card-section>
          <q-card-section>
            <div class="row">
              <div :class="'q-pr-sm col-12 col-sm-' + 12/status_tasks.length + ' col-md-' + 12/status_tasks.length" v-for="status in status_tasks" :key="status.pk">
                <q-banner class="shadow-3">
                  <div class="text-center">{{ status.name }}</div>
                  <q-separator class="q-mb-sm" />
                  <!-- <q-card class="shadow-3">
                    <q-card-section class="text-center">Title</q-card-section>
                    <q-separator />
                    <q-card-section>Text</q-card-section>
                    <q-card-actions align="right"><q-btn flat round  icon="menu"><q-tooltip>Дополнительные действия</q-tooltip></q-btn></q-card-actions>
                  </q-card> -->
                </q-banner>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-show="type === 2" class="col-12 col-sm-12 col-md-12" style="animation: fadeIn; animation-duration: 1s;" >
        <q-card>
          <q-card-section><div class="text-h6">Диаграмма задач</div></q-card-section>
          <q-card-section></q-card-section>
        </q-card>
      </div>
    </div>
    <Createtask v-model="dialogs.create" />
  </q-page>
</template>
<script>
import Createtask from 'components/Dialogs/Taskmanager/Create_task.vue'
export default {
  name: 'Main',
  components: { Createtask },
  data () {
    return {
      type: 0,
      status_tasks: {},
      dialogs: { create: false }
    }
  },
  watch: {
    type: function (newval, lastval) {
      if (newval === 1) {
        this.$axios({ method: 'GET', url: '/task_manager/status_task/' })
          .then((response) => {
            this.status_tasks = response.data
          })
      }
    }
  }
}
</script>
