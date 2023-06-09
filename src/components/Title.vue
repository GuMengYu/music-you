<template>
  <app-headline size="subtitle-2" weight="black" v-bind="$attrs" />
</template>

<script>
import AppHeadline from './Headline.vue'
export default {
  name: 'Title',
  components: { AppHeadline },
}
</script>
