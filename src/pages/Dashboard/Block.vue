<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <div class="row q-pl-xs q-pr-xs q-pb-md justify-between">
      <div class="col-12 col-sm-1 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="text-h6">Отчёты</div>
          </q-card-section>
          <q-card-section>
            <q-btn v-if='this.$init_perm({ type: "problem", name: "user_moderator"})' label="Определенный период" @click="dialogs.per = true" />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="dialogs.per">
      <q-card>
        <q-form @submit="submit_per">
          <q-card-section><div class="text-h6">Отчет обращений за определенный период</div></q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                <q-input label='Дата создания обращения от' v-model="dialogs_data.per.from" mask="####-##-##">
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
                <q-input label='Дата создания обращения до' v-model="dialogs_data.per.to" mask="####-##-##">
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
import fileDownload from 'js-file-download'
export default {
  name: 'Block.vue',
  data: () => ({
    dialogs: { per: false },
    dialogs_data: { per: { from: null, to: null } }
  }),
  methods: {
    submit_per: function () {
      const data = new FormData()
      data.append('datefrom', this.dialogs_data.per.from)
      data.append('datebefore', this.dialogs_data.per.to)
      data.append('action', '1')
      data.append('front', true)
      this.$axios({ method: 'POST', url: 'dashboard/block', responseType: 'blob', data: data })
        .then((response) => {
          console.log(response)
          fileDownload(response.data, 'export-period-block.xlsx')
          this.dialogs.per = false
          this.dialogs_data.per = { form: null, to: null }
        })
    }
  }
}
</script>
