<template>
  <canvas :id="`Chart${action}`"></canvas>
</template>

<script>
/* eslint-disable */
import Chart from 'chart.js'

export default {
  name: 'Terms',
  data () {
    return {
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
      action: 1,
      chart: null
    }
  },
  mounted() {
    const data = new FormData()
    data.append('action', this.action)
    this.$axios({ method: 'POST', url: 'dashboard/', data: data })
      .then((response) => {
        var ctx = document.getElementById(`Chart${this.action}`).getContext('2d');
        this.config.data.labels = response.data.content.subobjects
        this.config.data.datasets.push({ label: 'Количество созданых назначений', data: response.data.content.objects, borderColor: '#ffb1c1', backgroundColor: '#ffb1c1' })
        this.chart = new Chart(ctx, this.config)
      })
  }
}
</script>

<style>
</style>
