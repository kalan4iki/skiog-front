<template>
  <div>
    <q-btn @click="dialogs = true"></q-btn>
    <q-dialog v-model="dialogs">
      <q-card>
        <q-card-section>
          <div class="text-h6"></div>
        </q-card-section>
        <q-card-section>

        </q-card-section>
        <q-card-actions>

        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  props: ['name', 'task', 'step'],
  data () {
    return {
      dialogs: false
    }
  }
}
</script>
