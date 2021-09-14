<template>
  <q-page class="q-mt-md q-ml-md q-mr-md q-mb-md">
    <q-card style="width: 100%;">
      <q-card-section>
        <div class="row justify-between">
          <div class="col-4 col-sm-4 col-md-4">
            <div class="text-h6">Карта обращений</div>
          </div>
          <div class="col-4 col-sm-4 col-md-4">
            <q-toggle
              v-model="type_maps"
              false-value="Обычная"
              true-value="Тепловая"
              color="red"
              :label="'Тип карты: ' + type_maps"
            />
          </div>
          <div class="col-8 col-sm-8 col-md-4 text-right">
            <q-btn-group>
              <q-btn icon="clear" @click="clear_filter"><q-tooltip>Очистить фильтр</q-tooltip></q-btn>
              <q-btn icon="filter_alt" @click="dialog_filt=true"><q-tooltip>Фильтрация</q-tooltip></q-btn>
              <q-btn icon="refresh" @click="load_map"><q-tooltip>Обновить карту</q-tooltip></q-btn>
            </q-btn-group>
          </div>
        </div>
      </q-card-section>
      <q-linear-progress indeterminate dark stripe rounded size="20px" class="q-mt-sm" v-if="loading_map"/>
      <q-card-section style="width: 100%; height: 600px;">
        <div id="map"></div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialog_filt" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">
            Фильтрация
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm" >
              <q-select @input="podcat_refresh" v-model="dialogs_data.filt.temat" square outlined :options="filter_data.cat" option-value='pk' option-label="name" label="Тематика" emit-value />
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="dialogs_data.filt.podcat" square outlined multiple :disable="filter_data.podcat === null" :options="filter_data.podcat" label="Подкатегория" emit-value />
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="dialogs_data.filt.status" square outlined :options="filter_data.status" option-value='pk' option-label="name" label="Статус в доброделе" emit-value />
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-model="dialogs_data.filt.terms__org" square outlined :options="filter_data.org" option-value='pk' option-label="name" label="Организация" emit-value />
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-select v-if='$init_perm({ type: "problem", name: "user_executor"})' v-model="dialogs_data.filt.ciogv" square outlined :options="filter_data.to" option-value='pk' option-label="name" label="Тер. Управление" emit-value />
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-input v-model="dialogs_data.filt.datecre_after" square outlined label='Дата создания обращения от'>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="dialogs_data.filt.datecre_after"  mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-input v-model="dialogs_data.filt.datecre_before" square outlined label='Дата создания обращения до'>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="dialogs_data.filt.datecre_before"  mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-input v-model="dialogs_data.filt.dateotv" square outlined label='Дата ответа по доброделу' mask="##.##.####">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="dialogs_data.filt.dateotv" mask="DD.MM.YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Закрыть" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
              <q-toggle
                v-model="dialogs_data.filt.visible"
                label="Показывать закрытые"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space />
          <q-btn v-close-popup>Закрыть</q-btn>
          <q-btn @click="load_filter">Применить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
/* eslint-disable */

export default {
  name: 'Maps',
  data () {
    return {
      curr_map: null,
      dialog_filt: false,
      temat: null,
      filter_data: {
        cat: null,
        status: null,
        to: null,
        podcat: null,
        org: null
      },
      type_maps: 'Обычная',
      dialogs_data: {
        filt: {
          temat: null,
          status: null,
          ciogv: null,
          dateotv: null,
          podcat: null,
          datecre_after: null,
          datecre_before: null,
          visible: false,
          terms__org: null
        },
      },
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
      loading_map: true,
      objectManager: null,
      heatmap: null
    }
  },
  watch: {
    type_maps: function () {
      this.curs_type()
    }
  },
  async mounted () {
    await ymaps.ready(['Heatmap'])
      .then(this.init_map)
    this.load_map()
    setInterval(this.load_map, 1800000)
  },
  methods: {
    podcat_refresh: function () {
      if (this.dialogs_data.filt.temat) {
        this.$axios({ method: 'GET', url: 'podcategory?categ=' + this.dialogs_data.filt.temat })
          .then((response) => {
            this.dialogs_data.filt.podcat = null
            this.filter_data.podcat = response.data
          })
      }
    },
    curs_type: function () {
      if (this.type_maps === 'Обычная') {
        this.init_map(1)
      } else if (this.type_maps === 'Тепловая') {
        this.init_map(2)
      }
    },
    init_map: function (type=1) {
      if (!this.curr_map) {
        const inputSearch = new ymaps.control.SearchControl({
              options: {
                  // Пусть элемент управления будет
                  // в виде поисковой строки.
                  size: 'large',
                  // Включим возможность искать
                  // не только топонимы, но и организации.
                  provider: 'yandex#search'            
              }
          })
        this.controls.push(inputSearch)
        this.curr_map = new ymaps.Map('map', {
          center: this.coords,
          zoom: this.zoom,
          controls: this.controls
        });
      }
      if (!this.objectManager) {
        this.objectManager = new ymaps.ObjectManager({
          geoObjectOpenBalloonOnClick: false,
          clusterize: true
        })
        this.objectManager.objects.events.add('click', this.open_blln)
      }
      if (type === 1) {
        if (this.heatmap) {
          this.heatmap.destroy()
        }
        this.curr_map.geoObjects.removeAll()
        this.curr_map.geoObjects.add(this.objectManager)
      } else if (type === 2) {
        this.curr_map.geoObjects.removeAll()
        if (this.heatmap) {
          this.heatmap.destroy()
        }
        const self = this
        ymaps.ready({
          require: ['Heatmap'],
          successCallback: function (ym) {
            var data = [];
            for (var i = 0; i < self.problems.length; i++) {
              data.push(self.problems[i].geometry.coordinates)
            }
            ym.modules.require(['Heatmap'], function (Heatmap) {
              self.heatmap = new Heatmap(data, {
                radius: 15,
                dissipating: false,
                opacity: 0.8,
                intensityOfMidpoint: 0.2,
                gradient: {
                  0.1: 'rgba(128, 255, 0, 0.7)',
                  0.2: 'rgba(255, 255, 0, 0.8)',
                  0.7: 'rgba(234, 72, 58, 0.9)',
                  1.0: 'rgba(162, 36, 25, 1)'
                }
              })
              self.heatmap.setMap(self.curr_map)
            })
        }})
      }
      
    },
    getMap: function (map) {
      this.curr_map = map
      this.curr_map.geoObjects.add(this.objectManager)
    },
    open_blln: function (event) {
      const nomdobr = event.get('objectId')
      const obj = this.objectManager.objects.getById(nomdobr)
      obj.properties.balloonContent = "Идет загрузка данных...";
      this.objectManager.objects.balloon.open(nomdobr);
      this.$axios({ method: 'POST', url: 'getobr/', data: { obr: nomdobr }})
        .then((response) => {
          const problem = response.data
          const blln = `
            <p>Обращение №<b>${problem.nomdobr}</b></p>
            <p>Тематика: <b>${problem.temat}</b></p>
            <p>Подкатегория: <b>${problem.podcat}</b></p>
            <p>Статус обращения: <b>${problem.status}</b></p>
            <p>Адрес обращения: <b>${problem.adres}</b></p>
            <p>Дата ответа: <b>${problem.dateotv}</b></p>
            <p>Дата создания: <b>${problem.datecre}</b></p>
            <a href='#/obr/${problem.nomdobr}'>Перейти в карточку обращения</a>
          ` 
          obj.properties.balloonContent = blln;
          console.log(obj)
          this.objectManager.objects.balloon.setData(obj);
        })
    },
    clear_filter: function () {
      this.dialogs_data.filt = {
        temat: null,
        status: null,
        ciogv: null,
        dateotv: null,
        podcat: null,
        datecre_after: null,
        datecre_before: null,
        visible: false,
        terms__org: null
      }
      this.load_map()
    },
    load_filter: function () {
      this.load_map()
      this.dialog_filt = false
    },
    load_map: function () {
      const data = new FormData()
      for (const fil in this.dialogs_data.filt) {
        if (this.dialogs_data.filt[fil]) {
          if (this.dialogs_data.filt[fil].length > 1 && fil != 'datecre_after' && fil != 'datecre_before' && fil != 'dateotv') {
            for (const filj in this.dialogs_data.filt[fil]) {
              data.append(fil, this.dialogs_data.filt[fil][filj])
            }
          } else {
            data.append(fil, this.dialogs_data.filt[fil])
          }
          
        }
      }
      this.loading_map = true
      this.$axios({ method: 'POST', url: 'get_problem_maps/', data: data })
        .then((response) => {
          this.objectManager.removeAll()
          this.objectManager.add(response.data.prob)
          this.curs_type()
          this.problems = response.data.prob
          this.filter_data.cat = response.data.temat
          this.filter_data.to = response.data.to
          this.filter_data.status = response.data.status
          this.filter_data.org = response.data.orgs
          this.loading_map = false
        })
    }
  }
}
</script>
<style>
#map {
  width: 100%;
  height: 100%;
  display:inline-block;
}
.ymap-container {
  width: 100%;
  height: 100%;
  display:inline-block;
}
.red {
  color: red;
}
</style>
