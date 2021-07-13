<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <div class="row q-pl-xs q-pr-xs q-pb-md justify-between">
      <div class="col-12 col-sm-1 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="text-h6">Отчёты</div>
          </q-card-section>
          <q-card-section>
            <q-btn label="Определенный период"/>
            <q-btn v-if='this.$init_perm({ type: "problem", name: "user_moderator"})' label="Не закрытые обращения"/>
            <q-btn v-if='this.$init_perm({ type: "problem", name: "user_moderator"})' label="Выгрузка по автору"/>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row" v-if='this.$init_perm({ type: "problem", name: "user_moderator"})'>
      <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="text-h6">Назначения</div>
          </q-card-section>
          <q-card-section>
            <Terms />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="text-h6">Новые обращения</div>
          </q-card-section>
          <q-card-section>
            <Newobr />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
      <q-banner rounded class="bg-orange text-white">
        Графики доступны модератору
      </q-banner>
    </div>
  </q-page>
</template>
<script>
/* eslint-disable */
import Terms from 'components/Charts/Terms.vue'
import Newobr from 'components/Charts/Newobr.vue'
export default {
  name: 'Appeal',
  components: {
    Terms,
    Newobr
  },
  data: () => ({
  }),

  mounted() {
  }
}
</script>
