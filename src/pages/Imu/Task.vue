<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <div class="row q-pl-xs q-pr-xs q-pb-md justify-between">
      <div class="col-12 col-sm-12 col-md-12">
        <q-btn rounded icon="arrow_back" @click="go_back">
          <q-tooltip>
            Назад
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-8 col-md-6">
                <div class="text-h6">Задача №<b>{{ task.pk }}</b> | Статус:<b> {{ task.stat }}</b></div>
              </div>
              <div class="col-12 col-sm-8 col-md-6" style="text-align: right;">
                <q-btn-group>
                  <q-btn icon="refresh" @click="load_task">
                    <q-tooltip>
                      Обновить карточку
                    </q-tooltip>
                  </q-btn>
                  <q-btn icon="photo">
                    <q-tooltip>
                      Файлы по задаче
                    </q-tooltip>
                  </q-btn>
                  <q-btn icon="arrow_upward">
                    <q-tooltip>
                      Подписаться на задачу
                    </q-tooltip>
                  </q-btn>
                  <q-btn icon="chat" >
                    <q-tooltip>
                      Комментарии
                    </q-tooltip>
                  </q-btn>
                  <q-btn icon="timeline">
                    <q-tooltip>
                      История
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-linear-progress indeterminate v-show="loading" />
            <q-tabs
              v-model="tabs"
              class="text-black shadow-3"
              active-color="primary"
              indicator-color="primary"
              align="justify"
            >
              <q-tab name="text" label="Описание" />
              <q-tab name="stage" label="Этапы" />
            </q-tabs>
            <q-separator />
            <q-tab-panels class='shadow-3' v-model="tabs" animated>
              <q-tab-panel  name="text">
                <q-banner class="shadow-3 rounded-borders items-center">
                  <template v-slot:avatar>
                    <q-icon square name="arrow_right_alt" color="primary"/>
                  </template>
                  <div class="row items-center">
                    <div class="col-12 col-sm-8 col-md-6">
                      <p>Текущий этап: <b>{{task.cur_step.name}}</b></p>
                      <p>{{task.cur_step.text}}</p>
                      <p>Ответсвенные: <b v-for="resp in task.cur_step.resp" :key="resp.pk">{{ resp.user_name }}</b></p>
                    </div>
                    <div class="col-12 col-sm-4 col-md-6" style="text-align: right;">
                      <q-btn color="secondary" @click="tabs = 'stage'">Просмотр</q-btn>
                    </div>
                  </div>
                </q-banner>
                <div class="row q-pb-md justify-between">
                  <div class="col-12 col-sm-12 col-md-12">
                      <q-input
                        v-model="task.address"
                        label='Адрес'
                        readonly
                      />
                  </div>
                  <q-separator />
                  <div class="col-12 col-sm-12 col-md-12">
                      <q-input
                        v-model="task.text"
                        label='Описание'
                        readonly
                        rows="2"
                        type="textarea"
                      />
                  </div>
                  <div class="col-12 col-sm-12 col-md-12">
                      <q-select v-model="task.temp" label="Шаблон" readonly />
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel v-if="task.steps.length == 0" class="text-center bg-warning" name="stage">
                <div class="row">
                  <div class="col-12 col-sm-12 col-md-12">
                    <div class="text-h5"><b>Нет этапов</b></div>
                    <p class=""><b>В данном шаблоне недоступны этапы. Необходимо исправить шаблон или заменить шаблон задачи.</b></p>
                  </div>
                  <div class="col-12 col-sm-12 col-md-12">
                    <q-btn class="text-black shadow-3" color="white">Определить</q-btn>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel v-else name="stage">

                <q-timeline color="secondary">
                  <q-timeline-entry v-for='step in task.steps' :key='step.pk' :color="step.nom == task.cur_step.nom ? 'secondary' : (step.nom > task.cur_step.nom ? 'primary' : 'positive')" :icon="step.nom == task.cur_step.nom ? 'arrow_right_alt' : (step.nom > task.cur_step.nom ? 'next_plan' : 'done_all')">
                    <template v-slot:title>
                      {{ step.name }} <b v-if="step.pk == task.cur_step.pk" class="text-secondary">| Текущий этап.</b>
                    </template>
                    <!-- <template v-slot:subtitle>
                      February 22, 1986
                    </template> -->
                    <div class="row items-center">
                      <div class="col-12 col-sm-12 col-md-8">
                        <div>
                          {{ step.text }}
                        </div>
                        <div>
                          Ответсвенные: <b v-for="resp in step.resp" :key="resp.pk">{{ resp.user_name }}</b>
                        </div>
                      </div>
                      <div class="col-12 col-sm-12 col-md-4" style="text-align: right;" v-if="step.pk == task.cur_step.pk">
                        <Stepmoder v-if='step.types.text == "moder"' v-bind:name='step.types.name_but' v-bind:task="task" v-bind:step='step' v-on:refresh="load_task" />
                        <Stepsogl v-if='step.types.text == "sogl"' v-bind:name='step.types.name_but' v-bind:task="task" v-bind:step='step' v-on:refresh="load_task" />
                        <Stepexec v-if='step.types.text == "execution"' v-bind:name='step.types.name_but' v-bind:task="task" v-bind:step='step' v-on:refresh="load_task" />
                      </div>
                    </div>
                  </q-timeline-entry>
                </q-timeline>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import Stepmoder from 'components/Dialogs/Imu/Step_moder.vue'
import Stepsogl from 'components/Dialogs/Imu/Step_sogl.vue'
import Stepexec from 'components/Dialogs/Imu/Step_exec.vue'
export default {
  name: 'Task',
  components: { Stepmoder, Stepsogl, Stepexec },
  data () {
    return {
      tabs: 'text',
      loading: true,
      task: {
        pk: null,
        address: null,
        text: null,
        stat: null,
        temp: null,
        template: null,
        steps: [],
        cur_step: { name: null }
      }
    }
  },
  methods: {
    go_back: function () {
      this.$router.go(-1)
    },
    load_task: function () {
      this.loading = true
      const url = `imu/tasks/${this.$route.params.pk}`
      this.$axios({ url: url })
        .then((response) => {
          this.task = response.data
          this.loading = false
        })
    }
  },
  mounted () {
    this.load_task()
  }
}
</script>
