<template>
  <q-page class="q-mt-md q-ml-md q-mr-md q-mb-md">
    <q-card style="width: 100%;">
      <q-card-section class="items-center" horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-h6">Карта обращений</div>
        </q-card-section>
        <q-space />
        <q-card-section class="q-pt-xs">
          <q-btn-group>
            <q-btn icon="clear"><q-tooltip>Очистить фильтр</q-tooltip></q-btn>
            <q-btn icon="filter_alt"><q-tooltip>Фильтрация</q-tooltip></q-btn>
            <q-btn icon="refresh"><q-tooltip>Обновить карту</q-tooltip></q-btn>
          </q-btn-group>
        </q-card-section>
      </q-card-section>
      <q-card-section style="width: 100%; height: 600px;">
        <yandex-map :coords="coords" :use-object-manager="true" :cluster-options="clusterOptions" :controls='controls' :zoom='zoom' :settings="settings">
          <div v-for="problem in problems" :key="problem.pk">
            <ymap-marker
              :coords="problem.get_coord"
              :marker-id="problem.pk"
              :hint-content="problem.nomdobr"
              :balloon-template="`
                <p>Обращение №<b>${problem.nomdobr}</b></p>
                <p>Тематика: <b>${problem.temat}</b></p>
                <p>Статус обращения: <b>${problem.status}</b></p>
                <p>Дата ответа: <b>${problem.dateotv}</b></p>
                <p>Дата создания: <b>${problem.datecre}</b></p>
                <a href='obr/${problem.nomdobr}'>Перейти в карточку обращения</a>
              `"
              cluster-name="1"
            >
            </ymap-marker>
          </div>
        </yandex-map>
      </q-card-section>
      <q-linear-progress indeterminate dark stripe rounded size="20px" class="q-mt-sm" v-if="loading_map"/>
    </q-card>
  </q-page>
</template>
<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps'
export default {
  name: 'Maps',
  components: { yandexMap, ymapMarker },
  data () {
    return {
      settings: {
        apiKey: '7b7dadf9-e657-4698-a244-afeb046e40d7',
        lang: 'ru_RU',
        coordorder: 'latlong',
        version: '2.1'
      },
      filters: { temat: [], TO: [] },
      problems: [],
      controls: ['zoomControl', 'fullscreenControl'],
      clusterOptions: {
        1: {
          clusterDisableClickZoom: false,
          clusterOpenBalloonOnClick: true,
          clusterBalloonLayout: ['{{properties.geoObjects}}'].join('')
        }
      },
      zoom: 10,
      coords: [55.919135, 36.863040],
      loading_map: true
    }
  },
  mounted () {
    this.$axios({ method: 'POST', url: 'get_problem_maps/' })
      .then((response) => {
        this.problems = response.data.prob
        this.filters.temat = response.data.temat
        this.filters.TO = response.data.to
        this.loading_map = false
      })
  },
  methods: {
  }
}
</script>
<style>
.ymap-container {
  width: 100%;
  height: 100%;
  display:inline-block;
}
.red {
  color: red;
}
</style>
