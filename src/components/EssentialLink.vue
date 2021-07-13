<template>
  <q-item
    clickable
    v-ripple
    tag="a"
    :active='thisactive'
    @click="getPage"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    getPage (e) {
      this.$router.push({ name: this.link })
    }
  },
  computed: {
    thisactive () {
      if (this.$router.name === this.link) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
  }
}
</script>
