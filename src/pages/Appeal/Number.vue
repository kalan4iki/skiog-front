<template>
  <q-page class="q-mt-md q-ml-xs q-mr-xs">
    <div class="row q-pl-xs q-pr-xs q-pb-md justify-between">
      <div class="col-12 col-sm-1 col-md-6">
        <q-btn rounded icon="arrow_back" @click="go_back">
          <q-tooltip>
            Назад
          </q-tooltip>
        </q-btn>
      </div>
      <div class="col-12 col-sm-8 col-md-6" style="text-align: right; animation: fadeInDown; animation-duration: 1s;">
        <q-btn class="q-mr-xs" icon="refresh" @click='refresh'>
          <q-tooltip>
            Обновить карточку
          </q-tooltip>
        </q-btn>
        <q-btn-group v-if='this.$init_perm({ type: "problem", name: "user_moderator"})'>
          <q-btn icon="add_box" @click="dialogs.term = true">
            <q-tooltip>
              Добавить назначение
            </q-tooltip>
          </q-btn>
          <q-btn icon="file_download" @click="dialogs.to = true">
            <q-tooltip>
              Назначить ТО
            </q-tooltip>
          </q-btn>
          <q-btn icon="fact_check" @click="dialogs.fact = true">
            <q-tooltip>
              Добавить факт
            </q-tooltip>
          </q-btn>
          <q-btn :icon="this.obr.connect ? 'notifications' : 'notifications_off'" @click="connect_change">
            <q-tooltip>
              Есть обратная связь
            </q-tooltip>
          </q-btn>
        </q-btn-group>
        <q-btn class="q-ml-xs" disable icon="print">
          <q-tooltip>
            Печатать
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card class="q-mb-md">
          <q-card-section v-if='obr.ciogv'>
            <q-banner inline-actions rounded class="bg-primary text-white">
              <div class='text-h6'>Курирующее территориальное управление: {{ obr.ciogv }}</div>
              <template v-slot:avatar>
                <q-icon name="info" color="white" />
              </template>
            </q-banner>
          </q-card-section>
          <q-card-section v-else>
            <q-banner inline-actions rounded class="bg-orange text-white">
              Нет курирующего территориального отдела
              <template v-slot:avatar>
                <q-icon name="warning" color="white" />
              </template>
              <template v-slot:action>
                <q-btn label="Назначить ТО" @click="dialogs.to = true" />
              </template>
            </q-banner>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
            <div class="text-h6">Назначения</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if='load.term'>
              <q-skeleton height="100px" animation="pulse" />
            </div>
            <div v-else>
              <q-expansion-item v-for='term in terms' :key="term.pk" :header-class="term.answers !== '0' ? 'text-positive': ''" default-opened popup :label="`Ответственный: ${(term.org) ? term.org: ''} ${(term.curat) ? ' | ' + term.curat: ''} ${(term.curatuser) ? ' | ' + term.curatuser: ''}`" :caption="`Дата создания - ${term.datecre}. Статус - ${term.statuss}. Срок исполнения - ${term.date}`">
                <!-- <template v-slot:header>
                  <q-item-section avatar>
                    <div>Ответственный:</div>
                    <div>{{ `${(term.org) ? term.org: ''} ${(term.curat) ? ' | ' + term.curat: ''} ${(term.curatuser) ? ' | ' + term.curatuser: ''}` }}</div>
                  </q-item-section>
                  <q-separator vertical/>
                  <q-item-section class="text-center">
                    <div>Статус:</div>
                    <div>{{ term.statuss }}</div>
                  </q-item-section>
                  <q-separator vertical />
                  <q-item-section side>
                    <div>{{ `Дата создания - ${term.datecre}.` }}
                    </div>
                    <div>{{ `Срок исполнения - ${term.date}.` }}</div>
                  </q-item-section>
                </template> -->
                <q-separator />
                <q-card>
                  <q-card-section>
                    <div>Назначил: <b>{{ term.user }}</b>.</div>
                    <div v-if="term.desck">Текст назначения: {{ term.desck }}</div>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn-group>
                      <q-btn color='grey' size="sm" @click="add_answer(term.pk, 'view')">Ответить</q-btn>
                      <q-btn  v-show="term.answers > 0 & $init_perm({ type: 'problem', name: 'user_moderator'})" color="primary" size="sm" label="Просмотреть ответы" @click="get_term_answer(term.pk)" />
                    </q-btn-group>
                    <q-space />
                    <q-chip v-if="term.answers === '0'" color="warning">Ответов: {{ term.answers }}</q-chip>
                    <q-chip v-else color="positive">Ответов: {{ term.answers }}</q-chip>
                  </q-card-actions>
                </q-card>
                <q-menu
                  context-menu
                  v-if='$init_perm({ type: "problem", name: "user_moderator"})'
                >
                  <q-list dense style="min-width: 100px" v-if="$init_perm({ type: 'problem', name: 'user_moderator'})">
                    <q-item clickable v-close-popup @click="open_edit_term(term.pk)">
                      <q-item-section>Редактировать</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="del_term(term.pk)">
                      <q-item-section>Удалить</q-item-section>
                    </q-item>
                    <q-separator />
                  </q-list>
                </q-menu>
              </q-expansion-item>
              <q-banner v-if='terms.length == 0' inline-actions rounded class="bg-orange text-white">
                Нет назначений
                <template v-slot:avatar>
                  <q-icon name="warning" color="white" />
                </template>
                <template v-slot:action>
                  <q-btn label="Добавить" @click="dialogs.term = true" />
                </template>
              </q-banner>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-12 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="col-4 col-sm-4 col-md-4">
                <div class="text-h6">Обращение №{{ obr.nomdobr }}</div>
              </div>
              <q-space />
              <div class="col-8 col-sm-8 col-md-8" style="text-align: right;">
                <q-btn-group>
                  <q-btn :disable="dialogs_data.img.len" flat icon="image" @click="dialogs.img = true" >
                    <q-tooltip>
                      Фото обращения
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if='this.$init_perm({ type: "problem", name: "user_supermoderator"})' flat icon="person" @click="open_page('https://skiog.ru/admin/problem/problem/' + obr.pk + '/change/')" >
                    <q-tooltip>
                      В кабинет администратора
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if='this.$init_perm({ type: "problem", name: "user_moderator"})' disable flat icon="arrow_upward" >
                    <q-tooltip>
                      На обновление
                    </q-tooltip>
                  </q-btn>
                  <q-btn flat icon="arrow_forward"  @click="open_page('https://vmeste.mosreg.ru/CardInNewPage?show=/Topic?id=' + obr.nomdobr)">
                    <q-tooltip>
                      Перейти на добродел
                    </q-tooltip>
                  </q-btn>
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-if='load.obr'>
              <div class="row">
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-skeleton height="50px" animation="pulse" />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-skeleton height="50px" animation="pulse" />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-skeleton height="100px" animation="pulse" />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-skeleton height="100px" animation="pulse" />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-skeleton height="50px" animation="pulse" />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-skeleton height="50px" animation="pulse" />
                </div>
                <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
                  <q-skeleton height="100px" animation="pulse" />
                </div>
                <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
                  <q-skeleton height="50px" animation="pulse" />
                </div>
              </div>
            </div>
            <div v-else>
              <div class="row">
                <div class="col-12 col-sm-12 col-md-126 q-pl-xs q-pr-xs q-pb-sm">
                  <q-banner v-if='obr.visible != "1"' inline-actions rounded class="bg-grey text-white">
                    Обращение скрыто в системе
                    <template v-slot:avatar>
                      <q-icon name="warning" color="white" />
                    </template>
                  </q-banner>
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-input
                    v-model="obr.status"
                    label='Статус в доброделе'
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-input
                    v-model="obr.statussys"
                    label='Статус в системе'
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-input
                    v-model="obr.temat"
                    label='Тематика'
                    readonly
                    rows="2"
                    type="textarea"
                  />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-input
                    v-model="obr.adres"
                    label='Адрес'
                    readonly
                    rows="2"
                    type="textarea"
                  />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-input
                    v-model="obr.datecre"
                    label='Дата создания'
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-4 col-md-6 q-pl-xs q-pr-xs q-pb-sm">
                  <q-input
                    v-model="obr.dateotv"
                    label='Срок добродела'
                    readonly
                  />
                </div>
                <div class="col-12 col-sm-4 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
                  <q-input
                    v-model="obr.text"
                    label='Текст обращения'
                    readonly
                    rows="3"
                    type="textarea"
                  />
                </div>
                <div class="col-12 col-sm-12 col-md-12 q-pl-xs q-pr-xs q-pb-sm">
                  <q-input
                    v-model="obr.fact"
                    label='Выбранный факт'
                    readonly
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="dialogs.term" transition-show="rotate" transition-hide="rotate">
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавление назначения для обращения №{{ obr.nomdobr }}</div>
        </q-card-section>
        <q-separator />
        <q-form @submit="add_term" ref="form_term">
          <q-card-section class="">
            <div class="column">
              <div class="col-12 col-sm-4 col-md-6 q-ml-xs q-mr-xs q-mb-md">
                <q-input  label='Срок' v-model="dialogs_data.term.srok" mask="##.##.####" :rules="[date_rul]">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="dialogs_data.term.srok" mask="DD.MM.YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Закрыть" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col q-mb-md">
                <q-card>
                  <q-tabs
                    v-model="dialogs_data.term.tabs"
                    dense
                    class="text-grey"
                    active-color="primary"
                    indicator-color="primary"
                    align="justify"
                    narrow-indicator
                  >
                    <q-tab name="org" label="Организация" />
                    <q-tab name="dep" label="Отдел" />
                    <q-tab name="user" label="Сотрудник" />
                  </q-tabs>

                  <q-separator />

                  <q-tab-panels v-model="dialogs_data.term.tabs" animated>
                    <q-tab-panel name="org">
                      <q-select v-model="dialogs_data.term.org" :options="orgs" label="Организация" />
                    </q-tab-panel>

                    <q-tab-panel name="dep">
                      <q-select v-model="dialogs_data.term.dep" :options="deps" option-value='pk' :option-label='(item) => `${item.org}, ${item.name}`' label="Отдел" />
                    </q-tab-panel>

                    <q-tab-panel name="user">
                      <q-select v-model="dialogs_data.term.user" :options="users" option-value='pk' :option-label='(item) => `${item.last_name} ${item.first_name}`' label="Сотрудник" />
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card>
              </div>
              <div class="col q-mb-md">
                <q-input
                  label='Описание'
                  v-model="dialogs_data.term.text"
                  rows="4"
                  type="textarea"
                />
              </div>
              <div class="col q-mb-sm">
                <div class="row">
                  <div class="col">
                    <div class="q-gutter-sm">
                      <q-checkbox v-model="dialogs_data.term.dop" label="Для дальнейшего рассмотрения" />
                    </div>
                  </div>
                  <div class="col">
                    <q-input ref="date_appeal" :readonly='!dialogs_data.term.dop' label='Срок обещания' v-model="dialogs_data.term.srok_appr" mask="####-##-##" >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date :disable='!dialogs_data.term.dop' v-model="dialogs_data.term.srok_appr" mask="YYYY-MM-DD">
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
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Закрыть" color="primary" v-close-popup />
            <q-btn flat label="Добавить" color="primary" type='submit' />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogs.img" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="width: 700px; max-width: 800px; max-height: 1500px"> <!-- width: 700px; max-width: 800px; max-height: 1500px  -->
        <q-card-section>
          <q-carousel
            transition-prev="slide-right"
            transition-next="slide-left"
            animated
            thumbnails
            arrows
            v-model="dialogs_data.img.id"
            padding
          >
            <q-carousel-slide v-for='img in obr.imgsobr' :key='img.id_dd' :name="img.id_dd" :img-src="'https://vmeste.mosreg.ru/images/' + img.url">
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Закрыть" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogs.answer" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="width: 700px;">
        <q-form @submit="add_answer(dialogs_data.answer.term_id, 'submit')">
          <q-card-section class="text-center"><div class="text-h6">Добавление ответа для назначения</div></q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-12 col-sm-12 col-md-12 q-pb-sm">
                <q-input
                  v-model="dialogs_data.answer.text"
                  label='Комментарий'
                  square
                  outlined
                  rows="4"
                  type="textarea"
                  :rules="[val => val !== null && val !== '' || 'Необходим комментарий']"
                />
              </div>
              <div class="col-12 col-sm-12 col-md-12 q-pb-md">
                <q-file
                  v-model="dialogs_data.answer.files"
                  label="Выбрать файлы"
                  square
                  outlined
                  multiple
                  :filter="checkFileType"
                  @rejected="onRejected"
                  :rules="[val => val !== null && val !== '' || 'Прикрепите файл']"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn v-close-popup label="Закрыть" />
            <q-btn type="submit" label="Отправить" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogs.view_answer">
      <q-card style="width: 700px;">
        <q-card-section class="text-center"><div class="text-h6">Просмотр ответов</div></q-card-section>
        <q-separator />
        <q-card-section>
          <q-list>
            <q-expansion-item v-for="answer in term_answers" :key="answer.pk" :header-class="answer.statuc === '1' ? 'text-positive': answer.statuc === '1' ? 'text-negative': ''" :label="`Ответ №${answer.pk} от ${answer.user}. Статус ответа ${answer.get_status_display}`" :caption="`Дата создания ${answer.datecre}`" default-opened popup >
              <q-separator />
              <q-card>
                <q-card-section>Комментарий ответа: {{ answer.text }}</q-card-section>
                <q-card-actions align="right">
                  <q-btn-group>
                    <q-btn size='sm' color="secondary" label="Скачать файлы" @click="down_files(answer.pk)" />
                    <q-btn v-show="answer.action" @click="active_answer(answer.pk, '1')" size='sm' color="positive" label="Утвердить" />
                    <q-btn v-show="answer.action" @click="active_answer(answer.pk, '2')" size='sm' color="negative" label="Отклонить" />
                  </q-btn-group>
                </q-card-actions>
              </q-card>
              <q-menu
                  context-menu
                  v-if='$init_perm({ type: "problem", name: "user_moderator"})'
                >
                <q-list dense style="min-width: 100px" v-if="$init_perm({ type: 'problem', name: 'user_moderator'})">
                  <q-item clickable v-close-popup @click="del_answer(answer.pk)">
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                  <q-separator />
                </q-list>
              </q-menu>
            </q-expansion-item>
          </q-list>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn v-close-popup label="Закрыть" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Fact v-model="dialogs.fact" :pk="obr.pk" @refresh='get_problem' />
    <Ty v-model="dialogs.to" :pk="obr.pk" @refresh='get_problem' />
    <Editterm v-model="dialogs.edit_term" :pk="edit_term_pk" @refresh='get_terms' />
  </q-page>
</template>
<script>
import Ty from 'components/Dialogs/Appl/Ty_app.vue'
import Fact from 'components/Dialogs/Appl/Fact.vue'
import fileDownload from 'js-file-download'
import Editterm from 'components/Dialogs/Appl/Edit_term.vue'
import { openURL } from 'quasar'
export default {
  name: 'Number',
  components: { Ty, Fact, Editterm },
  data () {
    return {
      dialogs: { term: false, to: false, img: false, fact: false, answer: false, view_answer: false, edit_term: false },
      date_rul: v => /^\d{2}.\d{2}.\d{4}$/.test(v),
      form_term: null,
      edit_term_pk: null,
      dialogs_data: {
        term: {
          tabs: 'org',
          org: null,
          dep: null,
          user: null,
          dop: false,
          srok: null,
          srok_appr: null,
          text: null
        },
        to: {
          to: ''
        },
        img: {
          id: 1,
          len: true
        },
        fact: {
          facts: null
        },
        answer: {
          text: null,
          files: null,
          term_id: null
        }
      },
      obr: {
        pk: '',
        nomdobr: '',
        adres: '',
        dateotv: '',
        datecre: '',
        podcat: '',
        status: '',
        statussys: '',
        temat: '',
        ciogv: '',
        text: '',
        imgsobr: [],
        fact: ''
      },
      terms: [],
      load: {
        obr: true,
        term: true
      },
      tos: [],
      orgs: [],
      deps: {},
      users: {},
      facts: null,
      term_answers: null
    }
  },
  computed: {
  },
  methods: {
    open_edit_term: function (pk) {
      this.edit_term_pk = pk
      this.dialogs.edit_term = true
    },
    down_files: function (pk) {
      this.$axios({ method: 'GET', url: '/term/answer/downimage/' + pk, responseType: 'blob' })
        .then((response) => {
          fileDownload(response.data, `answer-${pk}.zip`)
        })
    },
    del_answer: function (pk) {
      this.$axios({ method: 'DELETE', url: '/term/answer/' + pk })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Ответ удален'
          })
          this.dialogs.view_answer = false
          this.get_terms()
        })
    },
    active_answer: function (pk, action) {
      const data = new FormData()
      data.append('status', action)
      this.$axios({ method: 'PATCH', url: '/term/answer/' + pk, data: data })
        .then((response) => {
          console.log(response)
          this.dialogs.view_answer = false
          this.get_terms()
        })
    },
    get_term_answer: function (pk) {
      this.$axios({ method: 'POST', url: '/term/answers/' + pk })
        .then((response) => {
          this.term_answers = response.data
          this.dialogs.view_answer = true
        })
    },
    checkFileType: function (files) {
      return files.filter(file => file.type === 'image/png' ^ file.type === 'application/pdf' ^ file.type === 'image/jpeg')
    },
    onRejected () {
      this.$q.notify({
        type: 'negative',
        message: 'Неправильный форматы файлов (разрешены pdf, png, jpg)'
      })
    },
    add_answer: function (pk, type) {
      if (type === 'view') {
        this.dialogs_data.answer.term_id = pk
        this.dialogs.answer = true
      } else {
        if (this.dialogs_data.answer.files != null) {
          const formData = new FormData()
          for (let i = 0; i < this.dialogs_data.answer.files.length; i++) {
            const file = this.dialogs_data.answer.files[i]
            formData.append('image', file)
          }
          formData.append('text', this.dialogs_data.answer.text)
          const config = { headers: { 'Content-Type': 'multipart/form-data' } }
          this.$axios.post('/term/add_answer/' + pk, formData, config)
            .then((response) => {
              this.get_terms()
              this.dialogs.answer = false
            })
        } else {
          const formData = new FormData()
          formData.append('text', this.dialogs_data.answer.text)
          this.$axios({ method: 'POST', url: '/term/add_answer/' + pk, data: formData })
            .then((response) => {
              this.get_terms()
              this.dialogs.answer = false
            })
        }
      }
    },
    open_page: function (urls) {
      openURL(urls)
    },
    // date_rules: v => /^-?[0-3]\d+\.[0-1]\d\.[\d]$/.test(v),
    date_app: v => (this.dialogs_data.term.dop && /[0-1]\d\.[0-1]\d\.[0-4]\d/.test(v)) || 'Не правильный формат даты, нужен yyyy.mm.dd.',
    go_back: function () {
      this.$router.go(-1)
    },
    get_problem: function () {
      this.load.obr = true
      this.$axios({ method: 'POST', url: '/getobr/', data: { obr: this.$route.params.nomdobr } })
        .then(response => {
          this.obr = response.data
          if (this.obr.imgsobr.length > 0) {
            this.dialogs_data.img.id = this.obr.imgsobr[0].id_dd
            this.dialogs_data.img.len = false
          }
          this.load.obr = false
        })
    },
    connect_change: function () {
      this.obr.connect = !this.obr.connect
      this.$axios({ method: 'PATCH', url: 'view/problem/' + this.obr.pk + '/', data: { connect: this.obr.connect } })
        .then((response) => {
          let message = ''
          if (this.obr.connect) {
            message = 'Есть обратная связь'
          } else {
            message = 'Нет обратной связи'
          }
          this.$q.notify({
            type: 'positive',
            message: message
          })
          this.get_problem()
        })
    },
    del_term: function (pk) {
      const params = new URLSearchParams()
      params.append('pk', pk)
      this.$axios({ method: 'DELETE', url: 'view/term/' + pk + '/', data: { pk: pk } })
        .then((response) => {
          this.$q.notify({
            type: 'positive',
            message: 'Назначение удалено'
          })
          this.get_terms()
        })
    },
    get_terms: function () {
      this.load.term = true
      this.$axios({ method: 'POST', url: '/getterms/', data: { obr: this.$route.params.nomdobr } })
        .then(response => {
          this.terms = response.data
          this.load.term = false
        })
    },
    get_to: function () {
      this.$axios({ method: 'POST', url: '/getto/' })
        .then(response => {
          this.tos = response.data
        })
    },
    refresh: function () {
      this.get_problem()
      this.get_terms()
      this.$q.notify({
        type: 'positive',
        message: 'Карточка обновлена'
      })
    },
    add_ty: function () {
      this.$axios({ method: 'PATCH', url: 'view/problem/' + this.obr.pk + '/', data: { ciogv: this.dialogs_data.to.to.value } })
        .then((response) => {
          this.$q.notify({
            type: 'positive',
            message: 'Территориальное управление добавлено'
          })
          this.get_problem()
          this.dialogs.to = false
        })
    },
    add_term: function () {
      let sub = true
      const data = {}
      data.problem = this.obr.pk
      data.date = this.dialogs_data.term.srok
      data.user = this.$store.getters.getUserPk
      if (this.dialogs_data.term.text) {
        data.desck = this.dialogs_data.term.text
      }
      if (this.dialogs_data.term.org) {
        data.org = this.dialogs_data.term.org.value
      }
      if (this.dialogs_data.term.dep) {
        data.curat = this.dialogs_data.term.dep.pk
      }
      if (this.dialogs_data.term.user) {
        data.curatuser = this.dialogs_data.term.user.pk
      }
      if (this.dialogs_data.term.dop) {
        if (this.dialogs_data.term.srok_appr) {
          data.further = this.dialogs_data.term.dop
          data.furtherdate = this.dialogs_data.term.srok_appr
        } else {
          sub = false
          this.$q.notify({
            type: 'negative',
            message: 'Нужно выбрать дату для срока обещания.'
          })
        }
      }
      if (sub) {
        this.$axios({ method: 'POST', url: 'view/term/', data: data })
          .then((response) => {
            this.dialogs.term = false
            this.$q.notify({
              type: 'positive',
              message: 'Назначение добавлено'
            })
            this.get_terms()
          })
      }
    },
    get_base: function () {
      this.$axios({ method: 'GET', url: 'problem/' + this.$route.params.nomdobr })
        .then((response) => {
          this.get_problem()
          this.get_terms()
          this.orgs = response.data.orgs
          this.deps = response.data.dep
          this.users = response.data.userorg
        })
        .catch(error => {
          if (error.response.status === 403) {
            this.$q.notify({
              type: 'negative',
              message: error.response.data.error
            })
            this.$router.push({ name: error.response.data.redirect })
          }
        })
    }
  },
  watch: {
    $route (to, from) {
      this.get_base()
    }
  },
  mounted () {
    this.get_base()
  }
}
</script>
