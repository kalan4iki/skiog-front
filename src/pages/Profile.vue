<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <div class="row">
      <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="col-4">
                <div class="text-h6">Карточка пользователя</div>
              </div>
              <q-space />
              <div class="col-4" style="text-align: right;">
                <q-btn-group >
                  <q-btn color="grey-10" icon="edit" >
                    <q-tooltip>
                      Редактировать
                    </q-tooltip>
                  </q-btn>
                  <q-btn color="grey-10" icon="block" >
                    <q-tooltip>
                      Заблокировать
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            Имя пользователя
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="col-4">
                <div class="text-h6">Разрешения</div>
              </div>
              <q-space />
              <div class="col-4" style="text-align: right;">
                <q-btn-group >
                  <q-btn color="grey-10" icon="add" >
                    <q-tooltip>
                      Добавить
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="col-4">
              <div class="text-h6">История пользователя</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'Profile'
}
</script>
