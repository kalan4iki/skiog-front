<template>
  <div class="row">
    <q-linear-progress v-if='load' query color="warning" class="q-mt-sm" />
    <div class="col-12 col-sm-5 col-md-5 text-center">
      <q-input  label='Дата создания обращения от' v-model="per.from" mask="####-##-##">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="per.from" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-sm-5 col-md-5 text-center">
      <q-input  label='Дата создания обращения до' v-model="per.to" mask="####-##-##">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="per.to" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Закрыть" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-sm-2 col-md-2 text-right">
      <q-btn-group>
        <q-btn flat icon="refresh" @click="refresh"><q-tooltip>Обновить график</q-tooltip></q-btn>
        <q-btn flat icon="visibility" @click="dialog=true"><q-tooltip>Показать данные</q-tooltip></q-btn>
      </q-btn-group>
    </div>
    <div class="col-12 col-sm-12 col-md-12">
      <canvas :id="`Chart${action}`"></canvas>
    </div>
    <q-dialog v-model="dialog">
      <q-card style="width: 500px">
        <q-card-section><div class="text-h6 text-center">Данные графика</div></q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 col-sm-12 col-md-12">
              <p v-for="(item, index) in config.data.labels" :key="item">{{item}} - {{config.data.datasets[0].data[index]}}</p>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup label="Закрыть" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import Chart from 'chart.js'

export default {
  name: 'Terms',
  props: ['month'],
  data () {
    return {
      load: true,
      dialog: false,
      per: { from: null, to: null},
      mounth: [
        { label: 'Январь', value: 1 },
        { label: 'Февраль', value: 2 },
        { label: 'Март', value: 3 },
        { label: 'Апрель', value: 4 },
        { label: 'Май', value: 5 },
        { label: 'Июнь', value: 6 },
        { label: 'Июль', value: 7 },
        { label: 'Август', value: 8 },
        { label: 'Сентябрь', value: 9 },
        { label: 'Октябрь', value: 10 },
        { label: 'Ноябрь', value: 11 },
        { label: 'Декабрь', value: 12 }
      ],
      mounth_data: null,
      config: {
        type: 'bar',
        data: { labels: null, datasets: [] },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Bar Chart'
            }
          }
        },
      },
      action: 4,
      chart: null
    }
  },
  methods: {
    load_data: function () {
      this.load = true
      const data = new FormData()
      data.append('action', this.action)
      if (this.per.from) {
        data.append('period_from', this.per.from)
      }
      if (this.per.from) {
        data.append('period_to', this.per.to)
      }
      this.$axios({ method: 'POST', url: 'dashboard/problem', data: data })
        .then((response) => {
          var ctx = document.getElementById(`Chart${this.action}`).getContext('2d');
          this.config.data.labels = response.data.content.subobjects
          this.config.data.datasets = [{ label: 'Количество созданых назначений', data: response.data.content.objects, borderColor: '#ffb1c1', backgroundColor: '#ffb1c1' }]
          if (!this.chart) {
            this.chart = new Chart(ctx, this.config)
          } else {
            this.chart.update()
          }
          this.load = false
        })
    },
    refresh: function () {
      this.load_data()
    }
  },
  mounted() {
    const nowdate = new Date()
    this.mounth_data = nowdate.getMonth() + 1
    this.load_data()
  }
}
</script>

<style>
</style>
