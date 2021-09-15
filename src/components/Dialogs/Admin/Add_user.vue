<template>
  <q-dialog v-bind:value='value' v-on:hide="close" v-on:show="shows" transition-show="slide-left" transition-hide="jump-left">
    <q-card style="width: 1100px; max-width: 1500px;">
      <q-form @submit="form_submit">
        <q-card-section class="text-center"><div class="text-h6">Добавить пользователя</div></q-card-section>
        <q-separator />
        <q-card-section>
          <q-stepper
            v-model="step"
            ref="stepper"
            color="primary"
            header-nav
            animated
          >
            <q-step
              :name="1"
              title="Введение ФИО"
              icon="settings"
              :error="username.length === 0"
              :done="step > 1"
            >
              <div class="row">
                <div class="col-12 col-sm-6 col-md-6 q-pb-md">
                  <q-input v-model="last_name" square outlined label="Фамилия" />
                </div>
                <div class="col-12 col-sm-6 col-md-6 q-pb-md">
                  <q-input v-model="first_name" square outlined label="Имя" />
                </div>
                <div class="col-12 col-sm-12 col-md-12 q-pb-md">
                  <q-input v-model="username" square outlined autocapitalize="none" type="text" autocomplete="username" label="Имя пользователя" />
                </div>
              </div>
            </q-step>
            <q-step
              :name="2"
              title="Выбор типа пользователя"
              icon="format_size"
              :done="step > 2"
            >
              <div class="row">
                <div class="col-12 col-sm-12 col-md-12 q-pb-md text-center">
                  <q-option-group
                    name="preferred_genre"
                    v-model="type"
                    :options="options"
                    color="primary"
                    inline
                  />
                </div>
              </div>
            </q-step>
            <q-step
              :name="3"
              title="Дополнительная информация"
              icon="settings"
              :done="step > 3"
            >
              <div class="row">
                <div class="col-12 col-sm-12 col-md-12 q-pb-md">
                  <q-input v-model="position" square outlined  label="Должность" />
                </div>
                <div v-show="type === 'user'" class="col-12 col-sm-12 col-md-12 q-pb-md">
                  <q-select v-model="org" square outlined :options="orgs" label="Организация" />
                </div>
                <div v-show="type === 'user'" class="col-12 col-sm-12 col-md-12 q-pb-md">
                  <q-select v-model="group_sel" square outlined multiple :options="groups" label="Группа" />
                </div>
                <div v-show="type === 'ty'" class="col-12 col-sm-12 col-md-12 q-pb-md">
                  <q-select v-model="to_sel" :options="tos" square outlined label="Территориальное управление" />
                </div>
              </div>
            </q-step>
            <q-step
              :name="4"
              title="Заключение"
              icon="check_circle_outline"
              :done="step > 4"
            >
              <q-markup-table dense separator='cell'>
                <!-- <thead>
                  <tr>
                    <th class="">Наименование</th>
                    <th class="">Значение</th>
                  </tr>
                </thead> -->
                <tbody>
                  <tr>
                    <td class="text-center" colspan="2"><b>Базовая информация</b></td>
                  </tr>
                  <tr>
                    <td class="text-center">Логин</td>
                    <td class="text-center">{{username}}</td>
                  </tr>
                  <tr>
                    <td class="text-center">Фамилия</td>
                    <td class="text-center">{{last_name}}</td>
                  </tr>
                  <tr>
                    <td class="text-center">Имя</td>
                    <td class="text-center">{{first_name}}</td>
                  </tr>
                  <tr>
                    <td class="text-center" colspan="2"><b>Дополнительная информация</b></td>
                  </tr>
                  <tr v-if="position !== null">
                    <td class="text-center">Должность</td>
                    <td class="text-center">{{position}}</td>
                  </tr>
                  <tr>
                    <td class="text-center">Тип учетной записи</td>
                    <td class="text-center">{{type}}</td>
                  </tr>
                  <tr v-if="type === 'user' && group_sel !== null">
                    <td class="text-center">Группы</td>
                    <td class="text-center"><div v-for="group in group_sel" :key="group.value">{{group.label}} </div></td>
                  </tr>
                  <tr v-if="type === 'user' && org !== null">
                    <td class="text-center">Организация</td>
                    <td class="text-center">{{org.label}}</td>
                  </tr>
                  <tr v-if="type === 'ty' && to_sel !== null">
                    <td class="text-center">Территориальное управление</td>
                    <td class="text-center">{{to_sel.label}}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-step>
            <template v-slot:navigation>
              <q-stepper-navigation class="text-center">
                <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Завершить' : 'Продолжить'" />
                <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Назад" class="q-ml-sm" />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-card-section>
        <q-separator />
        <!-- <q-card-section align="right">
          <q-btn-group>
            <q-btn @click="close" label="Закрыть" />
            <q-btn type="submit" label="Создать" />
          </q-btn-group>
        </q-card-section> -->
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
/* eslint-disable */
export default {
  name: 'Add_user',
  props: ['value'],
  data () {
    return {
      first_name: null,
      last_name: null,
      username: '',
      disable: false,
      reado: true,
      org: null,
      orgs: null,
      position: null,
      group_sel: null,
      groups: null,
      type: 'user',
      tos: null,
      to_sel: null,
      step: 1,
      options: [
        {
          label: 'Обычный пользователь',
          value: 'user'
        },
        {
          label: 'Территориальное управление',
          value: 'ty'
        }
      ]
    }
  },
  watch: {
    last_name: function (newval, oldval) {
      this.gen_username()
    },
    first_name: function (newval, oldval) {
      this.gen_username()
    }
  },
  methods: {
    gen_username: function () {
      let temp = ''
      if (this.last_name) {
        temp = this.last_name
      }
      if (this.first_name) {
        const temp1 = this.first_name.split(' ')
        for (let text of temp1) {
          if (text) temp = temp + text[0]
        }
      }
      this.username = this.translit(temp)
    },
    close: function () {
      this.$emit('input', false)
    },
    refresh: function () {
      this.$emit('refresh')
    },
    shows: function () {
      this.to_value = null
    },
    translit: function (word) {
      const converter = {
        'а': 'a','б': 'b','в': 'v','г': 'g','д': 'd',
        'е': 'e','ё': 'e','ж': 'zh','з': 'z','и': 'i',
        'й': 'y','к': 'k','л': 'l','м': 'm','н': 'n',
        'о': 'o','п': 'p','р': 'r','с': 's','т': 't',
        'у': 'u','ф': 'f','х': 'h','ц': 'c','ч': 'ch',
        'ш': 'sh','щ': 'sch','ь': '','ы': 'y','ъ': '',
        'э': 'e','ю': 'yu','я': 'ya'
      }
      word = word.toLowerCase()
      let answer = ''
      for (var i = 0; i < word.length; ++i) {
        if (converter[word[i]] === undefined) {
          answer += word[i]
        } else {
          answer += converter[word[i]];
        }
      }
      answer = answer.replace(/[^-0-9a-z]/g, '-')
      answer = answer.replace(/[-]+/g, '-')
      return answer
    },
    gen_password: function () {
      return Math.random().toString(36).slice(4)
    },
    get_org: function () {
      this.$axios({ method: 'GET', url: '/admin/get_orgs/' })
        .then((response) => {
          this.orgs = response.data
        })
    },
    get_groups: function () {
      this.$axios({ method: 'GET', url: '/admin/get_group/' })
        .then((response) => {
          this.groups = response.data
        })
    },
    get_to: function () {
      this.$axios({ method: 'POST', url: '/getto/' })
        .then(response => {
          this.tos = response.data
        })
    },
    form_submit: function () {
      const data = new FormData()
      let password = this.gen_password()
      console.log(password)
      data.append('last_name', this.last_name)
      data.append('first_name', this.first_name)
      data.append('username', this.username)
      data.append('password', password)
      data.append('userprofile', { org: this.org })
      this.$axios({ method: 'PUT', url: '/admin/users/', data: data })
        .then((response) => {
          console.log(response)
        })
    }
  },
  mounted () {
    this.get_org()
    this.get_groups()
    this.get_to()
  }
}
</script>
