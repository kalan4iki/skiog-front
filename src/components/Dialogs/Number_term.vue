<template>
  
</template>
<script>
export default {
  name: 'Number_term',
  data () {
    return {
      show2: this.show
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    showes: function () {
      return this.show
    }
  }
}
</script>
