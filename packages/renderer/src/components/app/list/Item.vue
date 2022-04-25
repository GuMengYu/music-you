<template>
  <v-list-item
    :href="item.href"
    :rel="item.href ? 'nofollow' : undefined"
    :target="item.href ? '_blank' : undefined"
    :to="item.to"
    class="v-list-item--default"
    color="primary"
    :prepend-icon="item.icon"
    :title="item.title"
  />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppListItem',

  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
})
</script>
