<template>
  <q-page class="q-mt-md q-ml-md q-mr-md">
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <div class="col-4">
            <div class="text-h6">Список пользователя</div>
          </div>
          <div class="col-4">
            <q-input
                v-model="search"
                dense
                square
                outlined
                label='Поиск по таблице'
              >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <q-space />
          <q-btn-group>
            <q-btn flat icon="refresh" @click="get_users">
              <q-tooltip>
                Обновить
              </q-tooltip>
            </q-btn>
            <q-btn flat icon="add" @click="dialogs.adduser = true">
              <q-tooltip>
                Создать пользователя
              </q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
      </q-card-section>
      <q-card-section>
        <q-table dense :data='data' :filter="search" :columns="columns" row-key="username" bordered :loading='loading' separator='cell' :pagination="initialPagination">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for='column in columns' :key="column.name" :props="props" class="word-wrap: break-word;">
                <div v-if="column.name == 'is_staff'">
                  <div v-if='props.row[column.name] == true'><q-icon name="done" color="positive" size='xs'/></div>
                  <div v-else><q-icon name="close" class="text-red" size='xs'/></div>
                </div>
                <div v-else-if="column.name == 'is_active'">
                  <div v-if='props.row[column.name] == true'><q-icon name="done" color="positive" size='xs'/></div>
                  <div v-else><q-icon name="close" class="text-red" size='xs'/></div>
                </div>
                <div v-else-if="column.name == 'userprofile'">
                  {{props.row[column.name].org.label}}
                </div>
                <div v-else>
                  {{ props.row[column.name] }}
                </div>
              </q-td>
              <q-menu
                context-menu
              >
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup @click="view_dialog(props.row.pk)">
                    <q-item-section>Редактировать</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup v-if='props.row["is_active"]' @click="edit_active(props.row.pk, false)">
                    <q-item-section>Заблокировать</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup v-else @click="edit_active(props.row.pk, true)">
                    <q-item-section>Активировать</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Сменить пароль</q-item-section>
                  </q-item>
                  <q-separator />
                </q-list>
              </q-menu>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <Adduser v-model="dialogs.adduser" />
    <Viewuser v-model="dialogs.viewuser" :pk='view_pk' />
  </q-page>
</template>
<script>
import Adduser from 'components/Dialogs/Admin/Add_user.vue'
import Viewuser from 'components/Dialogs/Admin/View_user.vue'
export default {
  name: 'Users',
  components: { Adduser, Viewuser },
  data () {
    return {
      loading: true,
      search: '',
      dialogs: { adduser: false, viewuser: false },
      view_pk: null,
      data: [],
      columns: [
        { label: 'ID', name: 'pk', field: 'pk', align: 'center', headerStyle: 'width: 50px' },
        { label: 'Имя пользователя', name: 'username', field: 'username', align: 'left', sortable: true },
        { label: 'Адрес почты', name: 'email', field: 'email', align: 'center', sortable: true },
        { label: 'Имя', name: 'first_name', field: 'first_name', align: 'left' },
        { label: 'Фамилия', name: 'last_name', field: 'last_name', align: 'left', sortable: true },
        { label: 'Активен', name: 'is_active', field: 'is_active', align: 'center' },
        { label: 'Администратор', name: 'is_staff', field: 'is_staff', align: 'center' },
        { label: 'Организация', name: 'userprofile', field: 'userprofile', align: 'left' }
      ],
      initialPagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 15
        // rowsNumber: xx if getting data from a server
      }
    }
  },
  methods: {
    view_dialog: function (pk) {
      this.view_pk = pk
      this.dialogs.viewuser = true
    },
    get_users: function () {
      this.loading = true
      this.$axios({ method: 'GET', url: '/admin/users/' })
        .then((response) => {
          this.data = response.data
          this.loading = false
        })
    },
    edit_active: function (pk, type) {
      const data = new FormData()
      data.append('is_active', type)
      this.$axios({ method: 'PATCH', url: '/admin/users/' + pk, data: data })
        .then((response) => {
          this.get_users()
        })
    }
  },
  created () {
    this.get_users()
  }
}
</script>
