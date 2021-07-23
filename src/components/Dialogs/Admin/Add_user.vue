<template>
  <q-dialog v-bind:value='value' v-on:hide="close" v-on:show="shows" transition-show="slide-left" transition-hide="jump-left">
    <q-card style="width: 900px;">
      <q-form @submit="form_submit">
        <q-card-section class="text-center"><div class="text-h6">Добавить пользователя</div></q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row items-center text-center">
            <div class="col-12 col-sm-6 col-md-6 q-pb-md q-pr-xs">
              <q-input v-model="last_name" square outlined label="Фамилия" />
            </div>
            <div class="col-12 col-sm-6 col-md-6 q-pb-md q-pl-xs">
              <q-input v-model="first_name" square outlined label="Имя" />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pb-md">
              <q-input v-model="username" square outlined autocapitalize="none" type="text" autocomplete="username" label="Имя пользователя" />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pb-md">
              <q-select v-model="org" square outlined :options="orgs" label="Организация" />
            </div>
            <div class="col-12 col-sm-12 col-md-12 q-pb-md">
              <q-select v-model="group_sel" square outlined multiple :options="groups" label="Группа" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section align="right">
          <q-btn-group>
            <q-btn @click="close" label="Закрыть" />
            <q-btn type="submit" label="Создать" />
          </q-btn-group>
        </q-card-section>
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
      username: null,
      disable: false,
      reado: true,
      org: null,
      orgs: null,
      group_sel: null,
      groups: null
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
  }
}
</script>
