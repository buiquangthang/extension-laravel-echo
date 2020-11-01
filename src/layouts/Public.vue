<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'PublicLayout',
  methods: {
    toggleBodyClass (addRemoveClass, className) {
      const el = document.body

      if (addRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    }
  },
  mounted () {
    this.toggleBodyClass('addClass', 'bg-gradient-primary')
  },
  destroyed () {
    this.toggleBodyClass('removeClass', 'bg-gradient-primary')
  }
}
</script>
