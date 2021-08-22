<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <div class="row q-pl-xs q-pr-xs q-pb-md justify-between">
      <div class="col-12 col-sm-1 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="text-h6">Отчёты</div>
          </q-card-section>
          <q-card-section>
            <q-banner class="shadow-3 q-mb-sm">
              <div class="text-h6">Общие</div>
              <p/>
              <q-btn-group outline>
                <q-btn outline v-if='$init_perm({ type: "problem", name: "user_moderator"})' label="Определенный период" @click="dialogs.per = true" />
                <q-btn outline v-if='$init_perm({ type: "problem", name: "user_moderator"})' label="Не закрытые обращения" disable/>
                <q-btn outline v-if='$init_perm({ type: "problem", name: "user_moderator"})' label="Выгрузка по автору" disable/>
              </q-btn-group>
            </q-banner>
            <q-banner class="shadow-3">
              <div class="text-h6">ТО</div>
              <p/>
              <q-btn-group outline>
                <q-btn outline v-if='$init_perm({ type: "problem", name: "user_moderator"})' label="Отчет за год" />
                <q-btn outline v-if='$init_perm({ type: "problem", name: "user_moderator"})' label="Отчет за текущий месяц" />
              </q-btn-group>
            </q-banner>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row" v-if='$init_perm({ type: "problem", name: "user_moderator"})'>
      <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="col-4 col-sm-4 col-md-4">
                <div class="text-h6">Назначения</div>
              </div>
              <q-space />
              <div class="col-4 col-sm-4 col-md-4 text-center">
                <q-btn v-if="!charts.terms" label="Показать график" @click="charts.terms = true" />
                <q-btn v-else label="Скрыть график" @click="charts.terms = false" />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-show="charts.terms">
            <Terms />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section class="items-center">
            <div class="row justify-between">
              <div class="col-4 col-sm-4 col-md-4">
                <div class="text-h6">Новые обращения</div>
              </div>
              <q-space />
              <div class="col-4 col-sm-4 col-md-4 text-center">
                <q-btn v-if="!charts.newobr" label="Показать график" @click="charts.newobr = true" />
                <q-btn v-else label="Скрыть график" @click="charts.newobr = false" />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-show="charts.newobr">
            <Newobr />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section class="items-center">
            <div class="row justify-between">
              <div class="col-4 col-sm-4 col-md-4">
                <div class="text-h6">График по ТУ</div>
              </div>
              <div class="col-4 col-sm-4 col-md-4 text-center">
                <q-btn v-if="!charts.TO" label="Показать график" @click="charts.TO = true" />
                <q-btn v-else label="Скрыть график" @click="charts.TO = false" />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-show="charts.TO">
            <TO />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
      <q-banner rounded class="bg-orange text-white">
        Графики доступны модератору
      </q-banner>
    </div>
    <q-dialog v-model="dialogs.per">
      <q-card>
        <q-form @submit="submit_per">
          <q-card-section><div class="text-h6">Отчет обращений за определенный период</div></q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                <q-input  label='Дата создания обращения от' v-model="dialogs_data.per.from" mask="####-##-##">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="dialogs_data.per.from" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Закрыть" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                <q-input  label='Дата создания обращения до' v-model="dialogs_data.per.to" mask="####-##-##">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="dialogs_data.per.to" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Закрыть" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-space />
            <q-btn v-close-popup>Закрыть</q-btn>
            <q-btn type="submit">Запросить</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
/* eslint-disable */
import fileDownload from 'js-file-download'
import Terms from 'components/Charts/Terms.vue'
import Newobr from 'components/Charts/Newobr.vue'
import TO from 'components/Charts/TO.vue'
export default {
  name: 'Appeal',
  components: {
    Terms,
    Newobr,
    TO
  },
  data () {
    return {
      dialogs: { per: false },
      dialogs_data: { per: { from: null, to: null } },
      charts: { terms: false, newobr: false, TO: false }
    }
  },
  methods: {
    submit_per: function () {
      const data = new FormData()
      data.append('datefrom', this.dialogs_data.per.from)
      data.append('datebefore', this.dialogs_data.per.to)
      data.append('action', '8')
      data.append('front', true)
      this.$axios({ method: 'POST', url: 'dashboard/problem', responseType: 'blob', data: data })
        .then((response) => {
          console.log(response)
          fileDownload(response.data, `export-period.xlsx`)
          this.dialogs.per = false
          this.dialogs_data.per = { form: null, to: null }
        })
    }
  },
  mounted() {
  }
}
</script>
